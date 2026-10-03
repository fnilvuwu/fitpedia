import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/sesi-1', label: 'Sesi 1' },
  { to: '/sesi-2', label: 'Sesi 2' },
  { to: '/sesi-3', label: 'Sesi 3' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-fit-line bg-fit-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-4 flex items-center gap-2 font-display text-2xl tracking-wide text-fit-yellow">
          <img src="/favicon.ico" alt="Fitpedia" className="h-7 w-7 rounded" />
          <span>
            FITPEDIA <span className="text-white">GUIDE</span>
          </span>
        </Link>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              pathname === l.to
                ? 'bg-fit-yellow text-black'
                : 'text-fit-text hover:bg-fit-card hover:text-white'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
