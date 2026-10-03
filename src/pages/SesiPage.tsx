import { Link } from 'react-router-dom';
import type { Sesi } from '../data/types';
import StepCard from '../components/StepCard';

interface Props {
  sesi: Sesi;
  nextTo?: string;
  nextLabel?: string;
}

export default function SesiPage({ sesi, nextTo, nextLabel }: Props) {
  return (
    <div className="mx-auto max-w-6xl gap-6 px-4 py-8 lg:flex">
      <aside className="mb-6 shrink-0 lg:sticky lg:top-20 lg:mb-0 lg:h-fit lg:w-60">
        <div className="rounded-2xl border border-fit-line bg-fit-card p-4">
          <p className="text-xs font-bold tracking-widest text-fit-yellow">{sesi.nomor}</p>
          <ol className="mt-2 space-y-1">
            {sesi.steps.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() =>
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="block w-full rounded-md px-2 py-1 text-left text-xs leading-snug text-fit-text hover:bg-fit-window hover:text-white"
                >
                  <span className="mr-1 font-bold text-fit-yellow">{i + 1}.</span>
                  <span className="break-words">{s.judul}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-4xl tracking-wide text-white">
          {sesi.nomor}: <span className="text-fit-yellow">{sesi.judul}</span>
        </h1>
        <p className="mt-2 text-sm text-fit-text">{sesi.deskripsi}</p>
        <div className="mt-6 space-y-6">
          {sesi.steps.map((s, i) => (
            <StepCard key={s.id} step={s} nomor={i + 1} />
          ))}
        </div>
        {nextTo && (
          <Link
            to={nextTo}
            className="mt-8 block rounded-2xl bg-fit-yellow p-5 text-center font-heading text-lg font-bold text-black transition hover:bg-fit-yellow-soft"
          >
            {nextLabel ?? 'Lanjut →'}
          </Link>
        )}
      </div>
    </div>
  );
}
