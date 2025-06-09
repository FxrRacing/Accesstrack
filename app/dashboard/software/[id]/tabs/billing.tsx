"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  PaymentMethod, PaymentFrequency as PrismaPaymentFrequency } from "@prisma/client"
import { paymentFrequencyOptions,  currencyOptions, licenseTypeOptions, paymentFrequency } from "@/lib/constants"
import { formatCurrency, formatPaymentFrequency, SupportedCurrency } from "@/lib/utils"
import { Software } from "@prisma/client"
import {  Calendar,  BadgeDollarSign, Banknote,  CalendarSync,  Clock, CreativeCommons, Info, Loader2, Settings, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useActionState } from "react"
import { toast } from "sonner"
import { updateSoftware } from "@/actions/software_actions"
import { Badge } from "@/components/ui/badge"
import { YearCalendar } from "../components/year-cal"
const initialState = {
  message: '',
  success: false
}

interface BillingTabProps {
  software: Software
}

export function BillingTab({ software }: BillingTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction, pending] = useActionState(updateSoftware, initialState)

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        setIsEditing(false)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <Card className="border shadow-sm md:col-span-2">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Billing</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage software billing details
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-slate-50"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isEditing ? (
          <form action={formAction}>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <input type="hidden" name="id" value={software.id} />
              
              <div className="flex flex-col gap-1">
                <Label>Amount <BadgeDollarSign className="h-4 w-4 mr-1.5" /></Label>
                <Input 
                  type="number" 
                  name="amount" 
                  defaultValue={software.amount?.toString() || "0"} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Price Per User <BadgeDollarSign className="h-4 w-4 mr-1.5" /></Label>  
                <Input 
                  type="number" 
                  name="pricePerUser" 
                  defaultValue={software.pricePerUser?.toString() || "0"} 
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Currency <Banknote className="h-4 w-4 mr-1.5" /></Label>
                <Select name="currency" defaultValue={software.currency || "USD"}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>License Type <CreativeCommons className="h-4 w-4 mr-1.5" /></Label>
                <Select name="licenseType" defaultValue={software.licenseType || "Subscription"}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select License Type" />
                  </SelectTrigger>
                  <SelectContent>
                     {licenseTypeOptions.map((license) => (
                      <SelectItem key={license.value} value={license.value}>{license.label}</SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Payment Frequency</Label>
                <Select name="paymentFrequency" defaultValue={software.paymentFrequency || paymentFrequency.MONTHLY}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select Payment Frequency"  />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentFrequencyOptions.map((frequency) => (
                      <SelectItem key={frequency.value} value={frequency.value}>{frequency.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Payment Method</Label>
                <Select name="paymentMethod" defaultValue={software.paymentMethod || "CREDIT_CARD"}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select Payment Method"  />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
              </div>
              <div className="flex flex-col gap-1">
                <Label>Purchase Date <Calendar className="h-4 w-4 mr-1.5" /></Label>
                <YearCalendar 
                  name="purchaseDate"
                  defaultValue={software.purchaseDate ? new Date(software.purchaseDate) : undefined}
                />
              </div>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1 text-muted-foreground">Total Price</p>
             
               
               <Badge>
                <div className="flex items-center">
                  <Banknote className="h-4 w-4 mr-1.5" />
                  <p className="font-medium ">
                    {formatCurrency(Number(software.amount || 0), (software.currency as SupportedCurrency) || "USD")} {software.currency}
                  </p>
                </div>
              </Badge>
              
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Price Per User</p>
             
               
               <Badge>
                <div className="flex items-center">
                  <Banknote className="h-4 w-4 mr-1.5" />
                  <p className="font-medium ">
                    {formatCurrency(Number(software.pricePerUser || 0), (software.currency as SupportedCurrency) || "USD")} {software.currency}
                  </p>
                </div>
              </Badge>
              
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Purchase Date</p>
              <p className="text-sm flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {software.purchaseDate ? new Date(software.purchaseDate).toLocaleDateString() : "Not specified"}</p>
            </div>

            <div>
              <p className="mb-1 text-muted-foreground">License Type</p>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1.5" />
                <p className="font-medium capitalize">{software.licenseType || "Not specified"}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-muted-foreground">Payment Frequency</p>
              <p className="text-sm flex items-center"><CalendarSync className="h-4 w-4 mr-1.5" /> {formatPaymentFrequency(software.paymentFrequency as PrismaPaymentFrequency) || "Not specified"}</p>
            </div>


            <div>
              <p className="mb-1 text-muted-foreground">Last Updated</p>
              <p className="text-sm flex items-center"> <Clock className="h-4 w-4 mr-1.5" /> {software.updatedAt ? new Date(software.updatedAt).toLocaleString() : "Not specified"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
