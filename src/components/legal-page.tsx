import { LegalDocument } from "@/data/legal";

export default function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className="px-6 md:px-0 py-8 md:py-12">
      <header className="max-w-3xl mx-auto mb-10 md:mb-14">
        <p className="text-brand-secondary italic text-sm tracking-wide mb-3">
          {document.updated}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          {document.title}
        </h1>
        <div className="mt-6 h-px w-24 bg-brand-secondary/70" />
      </header>

      <article className="max-w-3xl mx-auto space-y-5 text-slate-700 leading-relaxed text-[15px] md:text-base">
        {document.blocks.map((block, i) => {
          if (block.type === "h2") {
            return (
              <h2
                key={i}
                className="text-xl md:text-2xl font-semibold text-slate-900 pt-6 first:pt-0"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "ul") {
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 marker:text-brand-secondary">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-justify">
              {block.text}
            </p>
          );
        })}
      </article>
    </div>
  );
}
