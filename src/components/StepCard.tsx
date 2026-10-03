import type { Step } from '../data/types';
import CodeBlock from './CodeBlock';

export default function StepCard({ step, nomor }: { step: Step; nomor: number }) {
  return (
    <section id={step.id} className="scroll-mt-24 rounded-2xl border border-fit-line bg-fit-card p-6">
      <h2 className="break-words font-heading text-xl font-bold text-white">
        <span className="mr-2 inline-block rounded-md bg-fit-yellow px-2 py-0.5 text-sm font-bold text-black">
          {nomor}
        </span>
        {step.judul}
      </h2>
      <p className="mt-2 break-words text-sm leading-relaxed text-fit-text">{step.tujuan}</p>

      {step.pngHasil.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fit-yellow">
            👀 Hasil yang diharapkan
          </p>
          <div className="flex flex-wrap gap-3">
            {step.pngHasil.map((src) => (
              <figure key={src} className="w-44 overflow-hidden rounded-lg border border-fit-line bg-black">
                <img src={src} alt={src} loading="lazy" className="h-72 w-full object-contain" />
              </figure>
            ))}
          </div>
        </div>
      )}

      {step.asetDipakai.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {step.asetDipakai.map((src) => (
            <img
              key={src}
              src={src}
              alt={src}
              loading="lazy"
              title={src}
              className="h-14 w-14 rounded-md border border-fit-line bg-black object-contain p-0.5"
            />
          ))}
        </div>
      )}

      {step.kerangka && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fit-yellow">
            🌳 Kerangka widget
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black p-3 font-mono text-xs leading-relaxed text-fit-text">
            {step.kerangka}
          </pre>
        </div>
      )}

      {step.bedah && step.bedah.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fit-yellow">
            📦 Bedah widget
          </p>
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="text-fit-grey">
                <th className="py-1 pr-3 font-mono">Widget</th>
                <th className="py-1 pr-3">Fungsi</th>
                <th className="py-1">Bagian di PNG</th>
              </tr>
            </thead>
            <tbody>
              {step.bedah.map((b) => (
                <tr key={b.widget} className="border-t border-fit-line align-top">
                  <td className="py-1.5 pr-3 font-mono text-fit-yellow">{b.widget}</td>
                  <td className="py-1.5 pr-3 text-fit-text">{b.fungsi}</td>
                  <td className="py-1.5 text-fit-text">{b.bagianPng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {step.kode.map((k) => (
          <CodeBlock key={k.file} file={k.file} lang={k.lang} code={k.code} noCopy={k.noCopy} />
        ))}
      </div>

      {step.catatan && (
        <p className="mt-3 rounded-lg border border-fit-line bg-fit-window p-3 text-xs leading-relaxed text-fit-text">
          💡 {step.catatan}
        </p>
      )}

      {step.checkpoint && step.checkpoint.length > 0 && (
        <div className="mt-3 rounded-lg border border-green-800 bg-green-950 p-3">
          <p className="mb-1 text-xs font-bold text-green-300">✅ Titik cek</p>
          <ul className="list-inside list-disc text-xs text-green-200">
            {step.checkpoint.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
