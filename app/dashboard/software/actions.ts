'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentFrequency, PaymentMethod } from "@prisma/client";
import { SOFTWARE_STATUS_OPTIONS } from "@/utils/constants";

interface SoftwareImport {
  id?: string;
  name: string;
  description: string;
  category: string;
  status: string;
  userCount?: number;
  notes?: string;
  accountRep?: string;
  amount?: number;
  currency?: string;
  licenseType?: string;
  paymentDueDate?: Date;
  paymentFrequency?: PaymentFrequency;
  paymentMethod?: PaymentMethod;
  pricePerUser?: number;
  website?: string;
  iconUrl?: string;
  purchaseDate?: Date;
}

interface ValidationError {
  row: number;
  errors: string[];
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  importedRows: number;
  updatedRows: number;
  failedRows: number;
  validationErrors: ValidationError[];
  message: string;
}

function cleanDomain(input: string) {
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    console.error("Error cleaning domain:", error);
    return null;
  }
}

async function retrieveIcon(website: string): Promise<string | null> {
  // Clean the domain first
  const cleanedDomain = cleanDomain(website);
  
  if (!cleanedDomain) return null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ICON_API_BASE_URL}/${cleanedDomain}?token=${process.env.NEXT_PUBLIC_ICON_API_KEY}`);
    
    // Check if response is OK
    if (!response.ok) return null;
    
    // Return the response URL directly
    return response.url;
  } catch (error) {
    console.error("Error fetching icon:", error);
    return null;
  }
}

export async function importSoftware(csvData: string, authId: string): Promise<ImportResult> {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      return {
        success: false,
        totalRows: 0,
        importedRows: 0,
        updatedRows: 0,
        failedRows: 0,
        validationErrors: [],
        message: "CSV file must contain at least a header row and one data row"
      };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1);
    const validationErrors: ValidationError[] = [];
    const requiredHeaders = ['name', 'description', 'category', 'status'];

    // Validate headers
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        success: false,
        totalRows: data.length,
        importedRows: 0,
        updatedRows: 0,
        failedRows: data.length,
        validationErrors: [{
          row: 0,
          errors: [`Missing required headers: ${missingHeaders.join(', ')}`]
        }],
        message: "CSV file is missing required headers"
      };
    }

    // Process and validate each row
    const processRow = async (line: string, index: number) => {
      const rowNumber = index + 2; // +2 because we start from 0 and skip header
      const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
      const rowErrors: string[] = [];
      const software: Record<string, unknown> = {};

      // Map values to headers
      headers.forEach((header, i) => {
        const value = values[i];
        if (value) {
          try {
            // Handle date fields
            if (header === 'paymentDueDate' || header === 'purchaseDate') {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                rowErrors.push(`Invalid date format for ${header}`);
              } else {
                software[header] = date;
              }
            }
            // Handle number fields
            else if (['userCount', 'amount', 'pricePerUser'].includes(header)) {
              const num = parseFloat(value);
              if (isNaN(num)) {
                rowErrors.push(`Invalid number format for ${header}`);
              } else {
                software[header] = num;
              }
            }
            // Handle payment frequency enum
            else if (header === 'paymentFrequency') {
              if (Object.values(PaymentFrequency).includes(value as PaymentFrequency)) {
                software[header] = value as PaymentFrequency;
              } else {
                rowErrors.push(`Invalid payment frequency. Must be one of: ${Object.values(PaymentFrequency).join(', ')}`);
              }
            }
            // Handle payment method enum
            else if (header === 'paymentMethod') {
              if (Object.values(PaymentMethod).includes(value as PaymentMethod)) {
                software[header] = value as PaymentMethod;
              } else {
                rowErrors.push(`Invalid payment method. Must be one of: ${Object.values(PaymentMethod).join(', ')}`);
              }
            }
            // Handle all other fields as strings
            else {
              software[header] = value;
            }
          } catch (error) {
            if (error instanceof Error) {
              rowErrors.push(`Error processing ${header}: ${error.message}`);
            } else {
              rowErrors.push(`Error processing ${header}`);
            }
          }
        }
      });

      // Validate required fields
      requiredHeaders.forEach(header => {
        if (!software[header]) {
          rowErrors.push(`Missing required field: ${header}`);
        }
      });

      // Validate status field against SOFTWARE_STATUS_OPTIONS
      if (software.status) {
        const statusValue = (software.status as string).toLowerCase();
        const validStatus = SOFTWARE_STATUS_OPTIONS.some(option => option.value === statusValue);
        if (!validStatus) {
          rowErrors.push(`Invalid status. Must be one of: ${SOFTWARE_STATUS_OPTIONS.map(opt => opt.value).join(', ')}`);
        }
      }

      if (rowErrors.length > 0) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors
        });
        return null;
      }

      // Ensure all required fields are present before casting
      const hasRequiredFields = requiredHeaders.every(header => 
        typeof software[header] === 'string' && software[header] !== ''
      );
      
      if (hasRequiredFields) {
        const validSoftware = software as unknown as SoftwareImport;
        validSoftware.status = validSoftware.status.toLowerCase();
        validSoftware.category = validSoftware.category.toLowerCase();
        
        // Generate iconUrl from website if not provided
        if (validSoftware.website && !validSoftware.iconUrl) {
          const iconUrl = await retrieveIcon(validSoftware.website);
          if (iconUrl && iconUrl.trim() !== '') {
            validSoftware.iconUrl = iconUrl;
          } else {
            // Set to undefined instead of empty string
            validSoftware.iconUrl = undefined;
          }
        }
        
        return validSoftware;
      } else {
        rowErrors.push('Missing required fields');
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors
        });
        return null;
      }
    };

    // Process all rows
    const processedRows = await Promise.all(data.map((line, index) => processRow(line, index)));
    const validRows = processedRows.filter((row): row is SoftwareImport => row !== null);

    // Separate rows for update and create
    const rowsToUpdate = validRows.filter(row => row.id);
    const rowsToCreate = validRows.filter(row => !row.id);

    // If there are validation errors, return them without importing
    if (validationErrors.length > 0) {
      return {
        success: false,
        totalRows: data.length,
        importedRows: 0,
        updatedRows: 0,
        failedRows: validationErrors.length,
        validationErrors,
        message: `Validation failed for ${validationErrors.length} rows`
      };
    }

    let createdCount = 0;
    let updatedCount = 0;

    // Handle updates
    if (rowsToUpdate.length > 0) {
      const updatePromises = rowsToUpdate.map(async row => {
        const { id, ...updateData } = row;
        
        // Get current software data for history tracking
        const currentSoftware = await prisma.software.findUnique({
          where: { id }
        });

        if (!currentSoftware) {
          throw new Error(`Software with ID ${id} not found`);
        }

        // Find changed fields and build history entries
        const changes = Object.entries(updateData).reduce((acc, [key, value]) => {
          const field = key as keyof typeof currentSoftware;
          const currentValue = currentSoftware[field];
          
          // Skip undefined values and null values (except for purchaseDate)
          if (value === undefined || (value === null && field !== 'purchaseDate')) {
            return acc;
          }
          
          // Compare values as strings for consistency
          const currentStr = currentValue?.toString() || '';
          const newStr = value?.toString() || '';
          
          if (currentStr !== newStr) {
            acc.push({
              field,
              oldValue: currentStr,
              newValue: newStr
            });
          }
          return acc;
        }, [] as Array<{ field: string; oldValue: string; newValue: string }>);

        // Update software and create history entries in a transaction
        await prisma.$transaction(async (tx) => {
          // Update software
          await tx.software.update({
            where: { id },
            data: {
              ...updateData,
              updatedById: authId
            }
          });

          // Create history entries
          if (changes.length > 0) {
            await tx.softwareHistory.createMany({
              data: changes.map(change => ({
                softwareId: id as string,
                action: 'updated',
                field: change.field,
                oldValue: change.oldValue,
                newValue: change.newValue,
                updatedById: authId,
              }))
            });
          }
        });

        return id;
      });

      const updateResults = await Promise.all(updatePromises);
      updatedCount = updateResults.length;
    }

    // Handle creates
    if (rowsToCreate.length > 0) {
      const createPromises = rowsToCreate.map(async row => {
        // Create software and history entries in a transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create software
          const software = await tx.software.create({
            data: {
              ...row,
              updatedById: authId
            }
          });

          // Create initial history entry
          await tx.softwareHistory.create({
            data: {
              softwareId: software.id,
              action: 'created',
              field: 'all',
              oldValue: null,
              newValue: 'Software created via bulk import',
              updatedById: authId,
            }
          });

          return software;
        });

        return result;
      });

      const createResults = await Promise.all(createPromises);
      createdCount = createResults.length;
    }

    // Revalidate the software list page
    revalidatePath('/dashboard/software');

    return {
      success: true,
      totalRows: data.length,
      importedRows: createdCount,
      updatedRows: updatedCount,
      failedRows: data.length - (createdCount + updatedCount),
      validationErrors: [],
      message: `Successfully imported ${createdCount} new entries and updated ${updatedCount} existing entries`
    };

  } catch (error) {
    console.error('Error importing software:', error);
    return {
      success: false,
      totalRows: 0,
      importedRows: 0,
      updatedRows: 0,
      failedRows: 0,
      validationErrors: [],
      message: error instanceof Error ? error.message : 'Failed to import software'
    };
  }
}

