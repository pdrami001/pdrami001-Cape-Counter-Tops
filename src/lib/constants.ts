export const siteConfig = {
  name: "Cape Counter Tops",
  eyebrow: "Cape Town stone specialists",
  description:
    "Granite, quartz and sintered stone surfaces for kitchens, bathrooms and commercial spaces in Cape Town and surrounding areas.",
  email: "capecountertops1@gmail.com",
  whatsappNumber: "27816092933",
  whatsappDefaultMessage:
    "Hi, I would like to request a quote for a granite, quartz, or sintered stone project.",
  facebookUrl: "https://www.facebook.com/share/1Jf6gXG8SH/",
  serviceArea: "Cape Town and surrounding areas",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Materials", href: "/#materials" },
    { label: "Services", href: "/#services" },
    { label: "Our Work", href: "/projects" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
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

export const projectTypeLabels = {
  Kitchen: "Kitchen",
  Bathroom: "Bathroom",
  Vanity: "Vanity",
  "Kitchen Island": "Kitchen Island",
  Fireplace: "Fireplace",
  "Feature Wall": "Feature Wall",
  "Reception Counter": "Reception Counter",
  Commercial: "Commercial",
  Other: "Other",
} as const;

export const projectTypeOptions = [
  { value: "Kitchen", label: "Kitchen" },
  { value: "Bathroom", label: "Bathroom" },
  { value: "Vanity", label: "Vanity" },
  { value: "Kitchen Island", label: "Kitchen Island" },
  { value: "Fireplace", label: "Fireplace" },
  { value: "Feature Wall", label: "Feature Wall" },
  { value: "Reception Counter", label: "Reception Counter" },
  { value: "Commercial", label: "Commercial" },
  { value: "Other", label: "Other" },
] as const;

export type ProductCategory = keyof typeof categoryLabels;
export type ProjectType = keyof typeof projectTypeLabels;
