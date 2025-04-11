export const PaymentFrequency = {
    WEEKLY: "WEEKLY",
    BIWEEKLY: "BIWEEKLY",
    SEMIMONTHLY: "SEMIMONTHLY",
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    ANNUALLY: "ANNUALLY",
  } as const
  
  export const PaymentMethod = {
    CREDIT_CARD: "CREDIT_CARD",
    BANK_TRANSFER: "BANK_TRANSFER",
    CHECK: "CHECK",
    PAYPAL: "PAYPAL",
    OTHER: "OTHER",
  } as const

 export  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Pending", value: "PENDING" },
    { label: "Cancelled", value: "CANCELLED" },
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