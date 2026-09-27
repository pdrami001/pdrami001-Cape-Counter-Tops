export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl text-ivory">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 max-w-xl text-base leading-7 text-muted">{description}</p>}
    </div>
  );
}
