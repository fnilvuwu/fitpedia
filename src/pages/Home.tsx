import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    {
      to: '/sesi-1',
      nomor: 'SESI 1',
      judul: 'Fondasi UI + Auth Lokal',
      deskripsi:
        'Setup proyek, pubspec, assets, tema, router sementara, shell + tab, widget bersama, layar Welcome/Login/Register yang sudah bisa dipakai.',
    },
    {
      to: '/sesi-2',
      nomor: 'SESI 2',
      judul: 'Data + Fitur Utama',
      deskripsi:
        'Model, prompt Gemini, API latihan, Home, Exercise, Scan + klasifikasi, Muscle, Survey, Subscribe, dan tes pertama.',
    },
    {
      to: '/sesi-3',
      nomor: 'SESI 3',
      judul: 'Fitur Lanjutan + Build',
      deskripsi:
        'Router final, Trainer + booking, Chat AI, Artikel, Discover, Maps, Rank, Settings, tes lengkap, build APK & Windows.',
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-5xl tracking-wide text-white">
        PANDUAN MEMBANGUN <span className="text-fit-yellow">FITPEDIA</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fit-text">
        Ikuti urut dari atas ke bawah, copy-paste tiap blok kode ke file yang
        namanya tertulis di judul langkah. Bandingkan hasilnya dengan gambar
        contoh di tiap langkah. Cocok untuk pemula — tidak ada bagian yang
        dilompati.
      </p>
      <div className="mt-4 rounded-xl border border-fit-line bg-fit-card p-4 text-xs leading-relaxed text-fit-text">
        <p className="font-bold text-fit-yellow">Cara membaca panduan</p>
        <ul className="mt-1 list-inside list-disc">
          <li>👀 Hasil yang diharapkan — screenshot yang harus mirip dengan hasilmu.</li>
          <li>🌳 Kerangka widget — susunan widget dari luar ke dalam.</li>
          <li>📦 Bedah widget — fungsi tiap widget dan bagian PNG-nya.</li>
          <li>✅ Titik cek — perintah verifikasi di akhir langkah.</li>
        </ul>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-fit-line bg-fit-card p-6 transition hover:border-fit-yellow"
          >
            <p className="text-xs font-bold tracking-widest text-fit-yellow">{c.nomor}</p>
            <h2 className="mt-1 font-heading text-lg font-bold text-white">{c.judul}</h2>
            <p className="mt-2 text-xs leading-relaxed text-fit-text">{c.deskripsi}</p>
            <p className="mt-4 text-sm font-bold text-fit-yellow">Mulai →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
