import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-navy px-5 text-center text-ivory"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">404 / Surface not found</p><h1 className="mt-5 font-serif text-5xl">This page has moved.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted">The page you are looking for is not in our current collection.</p><Link href="/" className="button-primary mt-8">Return home</Link></div></main>;
}
