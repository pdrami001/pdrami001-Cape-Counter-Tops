import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#20211f] px-5 text-center text-[#f7f4ee]"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c6a77a]">404 / Surface not found</p><h1 className="mt-5 font-serif text-5xl">This page has moved.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#c9c4ba]">The page you are looking for is not in our current collection.</p><Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-[#f7f4ee] px-5 text-sm font-semibold text-[#20211f]">Return home</Link></div></main>;
}
