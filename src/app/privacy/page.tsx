import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cape Counter Tops handles personal information collected through enquiries, quotes and website contact.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-navy pt-[var(--header-height)] text-ivory">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>

        <article className="mt-8 rounded-[28px] border border-line bg-surface p-6 shadow-[0_16px_40px_rgba(32,33,31,0.04)] sm:p-8 lg:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Privacy</p>
          <h1 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">Privacy Policy</h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
            <p>
              This Privacy Policy explains how {siteConfig.name} handles personal information that we collect when you contact us, ask for a quote, or browse this website.
            </p>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Information we may collect</h2>
              <p className="mt-3">
                We may collect details that you provide directly, such as your name, email address, phone number, project type, location, material preferences, and any information contained in your enquiry or WhatsApp message. We may also keep a record of the project or service you are requesting.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">How we use information</h2>
              <p className="mt-3">
                We use personal information to respond to enquiries, prepare quotations, discuss project requirements, and communicate about the services we provide. We may also use the information to maintain records of customer contact and improve the quality of our service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Website usage</h2>
              <p className="mt-3">
                This website is primarily informational and does not currently use advertising, analytics, or marketing cookie tracking. We do not operate an online storefront or automated checkout on this website.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Information sharing</h2>
              <p className="mt-3">
                We do not sell personal information. We only share information with trusted service providers or partners where it is necessary to fulfil a project enquiry or communicate with you. We take reasonable steps to protect personal information against unauthorised access, loss, misuse or disclosure.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Retention and deletion</h2>
              <p className="mt-3">
                We retain contact and enquiry information only for as long as necessary to manage our relationship with you, respond to your enquiry, and meet legal or operational requirements. If you would like us to delete or update your personal information, please contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Your rights</h2>
              <p className="mt-3">
                You may request access to the personal information we hold about you, ask us to correct inaccurate information, or request that we delete information where there is no legitimate reason for us to retain it. We will consider such requests in line with applicable privacy obligations.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ivory">Contact us</h2>
              <p className="mt-3">
                If you have any questions about this policy or would like to discuss your personal information, please contact us at <a href={`mailto:${siteConfig.email}`} className="font-semibold text-ivory underline decoration-gold underline-offset-4">{siteConfig.email}</a>.
              </p>
            </section>
          </div>
        </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
