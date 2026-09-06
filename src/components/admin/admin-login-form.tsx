"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(searchParams.get("error") === "unauthorized" ? "This account is not authorised for the inventory workspace." : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) throw new Error("Email or password is incorrect.");
      const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!admin) { await supabase.auth.signOut(); throw new Error("This account is not authorised for the inventory workspace."); }
      router.replace("/admin/dashboard"); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to sign in. Please try again."); setPending(false); }
  }

  return <div className="p-7 sm:p-12"><a href="/" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#716e66]">← Back to website</a><div className="mt-16"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a17e4f]">Inventory dashboard</p><h1 className="mt-3 font-serif text-4xl text-[#272824]">Welcome back.</h1><p className="mt-3 text-sm leading-6 text-[#716e66]">Sign in with your authorised administrator account.</p></div><form onSubmit={handleSubmit} className="mt-10 space-y-5"><label className="block text-sm font-semibold text-[#4e514d]">Email<div className="relative mt-2"><Mail size={17} className="absolute left-3 top-3.5 text-[#9b978e]" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full border border-[#d0cbc1] bg-white pl-10 pr-4 outline-none transition focus:border-[#9d784a]" placeholder="you@company.com" /></div></label><label className="block text-sm font-semibold text-[#4e514d]">Password<div className="relative mt-2"><LockKeyhole size={17} className="absolute left-3 top-3.5 text-[#9b978e]" /><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full border border-[#d0cbc1] bg-white pl-10 pr-12 outline-none transition focus:border-[#9d784a]" placeholder="Your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-3"><span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p role="alert" className="border border-[#d8b6ad] bg-[#f6e9e5] px-4 py-3 text-sm text-[#8a4d42]">{error === "configuration" ? "Supabase is not configured yet. Add your environment variables first." : error}</p>}<button disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 bg-[#20211f] text-sm font-semibold text-white transition hover:bg-[#3a3c37] disabled:cursor-wait disabled:opacity-60">{pending && <LoaderCircle size={17} className="animate-spin" />}{pending ? "Signing in..." : "Sign in"}</button></form></div>;
}
