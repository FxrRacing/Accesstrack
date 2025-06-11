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



export function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}