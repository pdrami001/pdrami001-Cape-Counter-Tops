import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light" | "outline";
};

export function WhatsAppButton({ message, children, className, variant = "dark" }: WhatsAppButtonProps) {
  return (
    <a
      href={createWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        variant === "outline" ? "button-secondary" : "button-primary",
        className,
      )}
    >
      <FaWhatsapp size={17} aria-hidden="true" />
      {children}
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={createWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-gold text-navy shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:bottom-7 sm:right-7"
    >
      <FaWhatsapp size={25} aria-hidden="true" />
    </a>
  );
}
