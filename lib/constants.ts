export const PaymentFrequency = {
    WEEKLY: "WEEKLY",
    BIWEEKLY: "BIWEEKLY",
    SEMIMONTHLY: "SEMIMONTHLY",
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    ANNUALLY: "ANNUALLY",
  } 
  
  export const PaymentMethod = {
    CREDIT_CARD: "CREDIT_CARD",
    DEBIT_CARD: "DEBIT_CARD",
    BANK_TRANSFER: "BANK_TRANSFER",
    CHECK: "CHECK",
    PAYPAL: "PAYPAL",
    OTHER: "OTHER",
  } as const

 export  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
   
  ]
  
  export const currencyOptions = [
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
    { label: "CAD (C$)", value: "CAD" },
  ]
 export  const licenseTypeOptions = [
    { label: "Perpetual", value: "PERPETUAL" },
    { label: "Subscription", value: "SUBSCRIPTION" },
    { label: "Free", value: "FREE" },
    { label: "Trial", value: "TRIAL" },
    { label: "Open Source", value: "OPEN_SOURCE" },
  ]

  export const categoryOptions = [
    { label: "Other", value: "OTHER" },
    { label: "Software", value: "SOFTWARE" },
    { label: "Hardware", value: "HARDWARE" },
    { label: "Service", value: "SERVICE" },
    { label: "Web", value: "WEB" },
    { label: "Network", value: "NETWORK" },
  ]

  

export type Role = "admin" | "editor" | "viewer" | "contributor" | "owner" | "user"

export type AccessLevel = "view-only" | "edit" | "full-access" | "owner" | "user" | "delete"


export const accountTypeOptions = [
    { label: "Factory Ride", value: "factory-ride" },
    { label: "FXR", value: "fxr" },
    { label: "Adrenaline", value: "adrenaline" },
    { label: "Outlook", value: "outlook" },
    { label: "Gmail", value: "gmail" },
    { label: "Yahoo", value: "yahoo" },
    { label: "Hotmail", value: "hotmail" },
    { label: "AOL", value: "aol" },
    { label: "iCloud", value: "icloud" },
  
    { label: "Other", value: "other" },
]