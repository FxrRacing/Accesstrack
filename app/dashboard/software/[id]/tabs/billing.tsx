"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentFrequency } from "@/lib/constants"
import { Software } from "@prisma/client"
import { Edit3, Save, X } from "lucide-react"
import { useState } from "react"

interface BillingData {
  amount: string
  currency: string
  licenseType: string
  paymentDueDate: string
  paymentFrequency: string
}

interface BillingTabProps {
  software: Software
 
 
 
}

export function BillingTab({
  software,
  
 
 
}: BillingTabProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [isConfiguring, setIsConfiguring] = useState(true)
    const [billingData, setBillingData] = useState<BillingData>({
        amount: software.amount?.toString() || "0",
        currency: software.currency || "USD",
        licenseType: software.licenseType || "Enterprise",
        paymentDueDate: software.paymentDueDate?.toISOString() || new Date().toISOString(),
        paymentFrequency: software.paymentFrequency || PaymentFrequency.MONTHLY,
    })
  return (
    <Card className="border shadow-sm md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Billing</CardTitle>
          {isConfiguring && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-green-50 text-green-600"
                    // onClick={onSave}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-red-50 text-red-600"
                    // onClick={onCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-slate-50" onClick={() => {
                    setIsEditing(true)
                    setIsConfiguring(true)
                }}>
                  <Edit3 className="h-4 w-4" />
                </Button>
               
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  value={billingData.amount}
                  onChange={(e) => setBillingData({ ...billingData, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={billingData.currency}
                  onValueChange={(value) => setBillingData({ ...billingData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billingLicenseType">License Type</Label>
                <Select
                  value={billingData.licenseType}
                  onValueChange={(value) => setBillingData({ ...billingData, licenseType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentDueDate">Payment Due Date</Label>
                <Input
                  id="paymentDueDate"
                  value={software.paymentDueDate?.toDateString() || ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    setBillingData({ ...billingData, paymentDueDate: date.toISOString() })
                  }}
                />
              </div>
              <div>
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <Select
                  value={billingData.paymentFrequency}
                  onValueChange={(value) => setBillingData({ ...billingData, paymentFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  {Object.values(PaymentFrequency).map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Amount:</strong> {billingData.amount}
            </p>
            <p>
              <strong>Payment Due Date:</strong> {software.paymentDueDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>License Type:</strong> {billingData.licenseType}
            </p>
            <p>
              <strong>Currency:</strong> {billingData.currency}
            </p>
            <p>
              <strong>Payment Due Date:</strong> {software.paymentDueDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>Payment Frequency:</strong> {software.paymentFrequency}
            </p>
            <p>
              <strong>Payment Method:</strong> {software.paymentMethod}
            </p>
            
          </div>
        )}
      </CardContent>
    </Card>
  )
}
