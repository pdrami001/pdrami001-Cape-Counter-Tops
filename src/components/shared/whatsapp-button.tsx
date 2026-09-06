import { MessageCircle } from "lucide-react";
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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]",
        variant === "dark" && "bg-[#20211f] text-[#f7f4ee] shadow-lg shadow-black/10 hover:bg-[#353630]",
        variant === "light" && "bg-[#f7f4ee] text-[#20211f] hover:bg-white",
        variant === "outline" && "border border-[#bcb8ae] text-[#20211f] hover:border-[#20211f]",
        className,
      )}
    >
      <MessageCircle size={17} aria-hidden="true" />
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
      aria-label="Chat with StoneCraft Surfaces on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#2c9c68] text-white shadow-xl shadow-black/20 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a] sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={25} aria-hidden="true" />
    </a>
  );
}
