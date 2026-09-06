export function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return <div className={`max-w-2xl ${light ? "text-[#f7f4ee]" : "text-[#272824]"}`}><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a17e4f]">{eyebrow}</p><h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">{title}</h2>{description && <p className={`mt-5 max-w-xl text-base leading-7 ${light ? "text-[#c9c4ba]" : "text-[#716e66]"}`}>{description}</p>}</div>;
}
