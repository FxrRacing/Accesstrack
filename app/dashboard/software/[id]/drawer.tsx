"use client";
import { Software } from "@prisma/client";
import {  useForm } from "react-hook-form"
import { editSoftware } from "@/actions/software_actions";
import { z } from "zod"
import  {Command, CommandItem, CommandList, CommandGroup, CommandInput, CommandEmpty} from "@/components/ui/command"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { toast } from "sonner"
  import { Textarea } from "@/components/ui/textarea"

import Link from "next/link"
import { Input } from "@/components/ui/input"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Check, ChevronsUpDown } from "lucide-react";
import { statusOptions, PaymentFrequency, licenseTypeOptions, currencyOptions, categoryOptions} from "@/lib/constants";

const FormSchema = z.object({
  
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable(),
    category: z.string(
      {
        required_error: "Please select a category.",
      }
    ).nullable(),
    status: z.string(
      {
        required_error: "Please select a status.",
      }
    ),
   
    notes: z.string().nullable(),
   
   
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    licenseType: z.string().optional(),
   
    paymentFrequency: z
      .enum(["WEEKLY", "BIWEEKLY", "SEMIMONTHLY", "MONTHLY", "QUARTERLY", "ANNUALLY"])
      .nullable(),
    paymentMethod: z
      .enum(["CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CHECK", "PAYPAL", "OTHER", "CASH"])
      .nullable(),
    pricePerUser: z.number().nullable(),
    updatedById: z.string().optional(),
    website: z.string().url().nullable(),
})
// Type '"WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | null | undefined' is not assignable to type '"WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | null'.
//Type 'undefined' is not assignable to type '"WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | null'.ts(2719)



export function SoftwareForm({ software }: { software: Software }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: software.id,
      name: software.name,
      description: software.description || null,
      category: software.category,
      status: software.status || "ACTIVE",
      notes: software.notes || null,
      paymentFrequency: software.paymentFrequency || null,
      paymentMethod: software.paymentMethod || null,
      website: software.website || null,
      amount: software.amount || null,
      currency: software.currency || null,
      licenseType: software.licenseType || undefined,
      pricePerUser: software.pricePerUser || null,
    
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
    
   
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Software name" {...field} value={software.name || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
                        )}
                      />
        
<FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the software"
                              className="resize-none"
                              {...field}
                              value={software.description || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

<FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                      {software.status
                                        ? statusOptions.find((status) => status.value === field.value)?.label
                                        : "Select status"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandInput placeholder="Search status..." />
                                    <CommandList>
                                      <CommandEmpty>No status found.</CommandEmpty>
                                      <CommandGroup>
                                        {statusOptions.map((status) => (
                                          <CommandItem
                                            key={status.value}
                                            value={status.value}
                                            onSelect={() => {
                                              form.setValue("status", status.value)
                                            }}
                                          >
                                            <Check
                                              className={`mr-2 h-4 w-4 ${
                                                status.value === field.value ? "opacity-100" : "opacity-0"
                                              }`}
                                            />
                                            {status.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>

                          
                        )}
                      />  

<FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} value={software.website || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes about the software"
                              className="resize-none min-h-[100px]"
                              {...field}
                              value={software.notes || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>


                      {/* Licensing & Payment */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium">Licensing & Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licenseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select license type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {licenseTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pricePerUser"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per User</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === "" ? null : Number.parseFloat(value))
                                }}
                                value={field.value === null ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === "" ? null : Number.parseFloat(value))
                                }}
                                value={field.value === null ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencyOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                        control={form.control}
                        name="paymentDueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Payment Due Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value ? "text-muted-foreground" : ""
                                    }`}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     */}

</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="paymentFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Frequency</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {Object.values(PaymentFrequency).map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                ))}
                               
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                <SelectItem value="CHECK">Check</SelectItem>
                                <SelectItem value="PAYPAL">PayPal</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>


        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}




export  function Drawer({ software }: { software: Software }) {

  

  return (
    <>
    
    <Sheet >
  <SheetTrigger asChild> 
    <Button>
        Edit Software
    </Button>
    </SheetTrigger>
  <SheetContent 
    side="right" 
    className=" overflow-y-auto"
  >
    <SheetHeader>
      <SheetTitle>{software.name}</SheetTitle>
      <SheetDescription>
        Edit the software details here.
      </SheetDescription>
    </SheetHeader>
    <div className="flex justify-start p-5 w-full">

    <SoftwareForm software={software} />
    </div>

    <div className="flex justify-start p-1">
      
      <form action={editSoftware} className="flex flex-col gap-4">
        
        <input type="hidden" name="id" defaultValue={software.id} />
        <label htmlFor="name">Name:</label>
        <Input type="text" name="name" defaultValue={software.name} />

        <label htmlFor="description">Description:</label>
        <Input
          type="text"
          name="description"
          defaultValue={software.description || ""}
        />

        <label htmlFor="notes">Notes:</label>
        <Textarea
          name="notes"
          id="notes"
          rows={3}
          defaultValue={software.notes || ""}
        />
        <label htmlFor="status">Status:</label>
        <select name="status"  defaultValue={software.status || ""}>
        
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>
       
        <label htmlFor="category">Category:</label>
          <select
          name="category"

          defaultValue={software.category || ""}
        >
            <option value="WEB">Web</option>
            <option value="SOFTWARE">Software</option>
            <option value="HARDWARE">Hardware</option>
            <option value="NETWORK">Network</option>
            <option value="OTHER">Other</option>
          </select>
   
        <button type="submit" onClick={() => console.log("Update button clicked")}>
        Update
        </button>

      </form>
      </div>
  </SheetContent>
</Sheet>
   

   
    
    </>
  );
}
