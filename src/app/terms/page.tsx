import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Terms for using the Cape Counter Tops website and requesting quotes or project information.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f4ee] pt-[76px] text-[#272824]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#5d584f] transition hover:text-[#20211f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>

        <article className="mt-8 rounded-[28px] border border-[#d8d2c8] bg-white p-6 shadow-[0_16px_40px_rgba(32,33,31,0.04)] sm:p-8 lg:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e4f]">Website terms</p>
          <h1 className="mt-4 font-serif text-4xl text-[#20211f] sm:text-5xl">Website Terms</h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#4b473f]">
            <p>
              These terms govern your use of the {siteConfig.name} website. By using the site, you agree to these conditions. If you do not agree, please do not use the website.
            </p>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">General information</h2>
              <p className="mt-3">
                The website is provided for general information and enquiry purposes only. It does not constitute a quotation, contract, or commitment to supply materials or complete a project.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">Enquiries and quotations</h2>
              <p className="mt-3">
                Any request for a quotation or project discussion should be made directly by email, WhatsApp or phone. We may respond with a written estimate or project discussion based on the information provided. Pricing, lead times and scope can vary depending on measurements, material availability, installation requirements and project complexity.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">No automated transactions</h2>
              <p className="mt-3">
                This website does not provide automated purchasing, deposits, or payment processing. Any deposit, payment schedule, or accepted order must be agreed directly with us in writing.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">Material and installation information</h2>
              <p className="mt-3">
                Product information, material descriptions, images and project examples are provided for guidance. Final material selection, fabrication details and installation outcomes are subject to measurement, site conditions, product availability, and the specific written instruction or agreement we provide.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">Website content</h2>
              <p className="mt-3">
                We aim to keep the website accurate and up to date, but we do not guarantee that all information is complete, current or error-free. We may update or change website content at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">Liability</h2>
              <p className="mt-3">
                To the extent permitted by law, we do not accept liability for loss or damage arising from the use of this website or reliance on any information contained herein, except where this is required by law. This includes indirect, incidental or consequential losses.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#20211f]">Contact</h2>
              <p className="mt-3">
                If you have questions about these terms, please contact us at <a href={`mailto:${siteConfig.email}`} className="font-semibold text-[#20211f] underline decoration-[#c6a77a] underline-offset-4">{siteConfig.email}</a>.
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
