import { siteConfig } from "@/lib/constants";

export function createWhatsAppUrl(message: string = siteConfig.whatsappDefaultMessage) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(productName: string) {
  return `Hi, I'm interested in ${productName}. Please can you provide me with more information and a quote?`;
}
