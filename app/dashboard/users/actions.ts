'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ValidationError {
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

interface UserImport {
  id?: string;
  name: string;
  email: string;
  type: string;
  status: string;
  departmentId?: string;
  locationId?: string;
  jobTitle?: string;
  onboardingDate?: Date;
  department?: string;
  location?: string;
  [key: string]: unknown;
}

export async function importUsers(csvData: string, authId: string): Promise<ImportResult> {
  try {
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
    const requiredHeaders = ['name', 'email', 'type', 'status'];

    // Validate headers
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h as string));
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
      const rowNumber = index + 2;
      const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
      const rowErrors: string[] = [];
      const userData: Partial<UserImport> = {};

      // Map values to headers
      headers.forEach((header, i) => {
        const value = values[i];
        if (value) {
          try {
            // Handle date fields
            if (header === 'onboardingDate') {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                rowErrors.push(`Invalid date format for ${header}`);
              } else {
                userData[header] = date;
              }
            }
            // Handle all other fields as strings
            else {
              userData[header] = value;
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
        if (!userData[header]) {
          rowErrors.push(`Missing required field: ${header}`);
        }
      });

      // Validate status
      if (userData.status) {
        const statusValue = (userData.status as string).toLowerCase();
        if (!['active', 'inactive'].includes(statusValue)) {
          rowErrors.push('Invalid status. Must be either active or inactive');
        } else {
          userData.status = statusValue;
        }
      } else {
        // Set default status to inactive if not provided
        userData.status = 'inactive';
      }

      // Look up department if provided
      if (userData.department) {
        const department = await prisma.department.findFirst({
          where: {
            name: {
              equals: userData.department as string,
              mode: 'insensitive'
            }
          }
        });
        if (department) {
          userData.departmentId = department.id;
        } else {
          // Create new department if it doesn't exist
          const newDepartment = await prisma.department.create({
            data: {
              name: userData.department as string,
              description: `${userData.department} Department created via bulk import`
            }
          });
          userData.departmentId = newDepartment.id;
        }
      }

      // Look up location if provided
      if (userData.location) {
        const location = await prisma.location.findFirst({
          where: {
            name: {
              equals: userData.location as string,
              mode: 'insensitive'
            }
          }
        });
        if (location) {
          userData.locationId = location.id;
        } else {
          // Instead of treating missing location as an error, we'll just skip setting the locationId
          console.log(`Location "${userData.location}" not found. Skipping location assignment.`);
        }
      }

      if (rowErrors.length > 0) {
        validationErrors.push({
          row: rowNumber,
          errors: rowErrors
        });
        return null;
      }

      return userData as UserImport;
    };

    // Process all rows
    const processedRows = await Promise.all(data.map((line, index) => processRow(line, index)));
    const validRows = processedRows.filter((row): row is UserImport => row !== null);

    // Separate rows for update and create
    const rowsToUpdate = validRows.filter(row => row.id);
    const rowsToCreate = validRows.filter(row => !row.id);

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
        
        const currentUser = await prisma.user.findUnique({
          where: { id: id as string }
        });

        if (!currentUser) {
          throw new Error(`User with ID ${id} not found`);
        }

        // Find changed fields
        const changes = Object.entries(updateData).reduce((acc, [key, value]) => {
          const field = key as keyof typeof currentUser;
          const currentValue = currentUser[field];
          
          if (value === undefined) {
            return acc;
          }
          
          const currentStr = currentValue?.toString().toLowerCase() || '';
          const newStr = value?.toString().toLowerCase() || '';
          
          if (currentStr !== newStr) {
            acc.push({
              field,
              oldValue: currentStr,
              newValue: newStr
            });
          }
          return acc;
        }, [] as Array<{ field: string; oldValue: string; newValue: string }>);

        // Update user and create history entries
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: id as string },
            data: updateData
          });

          if (changes.length > 0) {
            await tx.userHistory.createMany({
              data: changes.map(change => ({
                userId: id as string,
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
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: row
          });

          await tx.userHistory.create({
            data: {
              userId: user.id,
              action: 'created',
              field: 'all',
              oldValue: null,
              newValue: 'User created via bulk import',
              updatedById: authId,
            }
          });

          return user;
        });

        return result;
      });

      const createResults = await Promise.all(createPromises);
      createdCount = createResults.length;
    }

    revalidatePath('/dashboard/users');

    return {
      success: true,
      totalRows: data.length,
      importedRows: createdCount,
      updatedRows: updatedCount,
      failedRows: data.length - (createdCount + updatedCount),
      validationErrors: [],
      message: `Successfully imported ${createdCount} new users and updated ${updatedCount} existing users`
    };

  } catch (error) {
    console.error('Error importing users:', error);
    return {
      success: false,
      totalRows: 0,
      importedRows: 0,
      updatedRows: 0,
      failedRows: 0,
      validationErrors: [],
      message: error instanceof Error ? error.message : 'Failed to import users'
    };
  }
}