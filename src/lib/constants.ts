export const siteConfig = {
  name: "StoneCraft Surfaces",
  eyebrow: "Cape Town stone specialists",
  description:
    "Premium granite, quartz and sintered stone fabrication and installation for kitchens, bathrooms and commercial spaces.",
  whatsappNumber: "27710779244",
  whatsappDefaultMessage:
    "Hi, I would like to request a quote for a granite, quartz, or sintered stone project.",
  navigation: [
    { label: "Home", href: "#home" },
    { label: "Materials", href: "#materials" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const categoryLabels = {
  granite: "Granite",
  quartz: "Quartz",
  sintered_stone: "Sintered Stone",
} as const;

export const categoryOptions = [
  { value: "granite", label: "Granite" },
  { value: "quartz", label: "Quartz" },
  { value: "sintered_stone", label: "Sintered Stone" },
] as const;

export type ProductCategory = keyof typeof categoryLabels;
