import { PaymentFrequency } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



//needs to work for all currencies

export type SupportedCurrency = 'USD' | 'CAD' | 'EUR' | 'GBP';

export function formatCurrency(amount: number, currency: SupportedCurrency = 'USD') {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}


export function formatPaymentFrequency(frequency: PaymentFrequency) {
  return frequency.charAt(0).toUpperCase() + frequency.slice(1).toLowerCase()
}


