import { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const Sesi1Page = lazy(() => import('./pages/Sesi1Page'));
const Sesi2Page = lazy(() => import('./pages/Sesi2Page'));
const Sesi3Page = lazy(() => import('./pages/Sesi3Page'));

function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center text-fit-text">
      Memuat…
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-fit-black">
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sesi-1" element={<Sesi1Page />} />
            <Route path="/sesi-2" element={<Sesi2Page />} />
            <Route path="/sesi-3" element={<Sesi3Page />} />
          </Routes>
        </Suspense>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-fit-grey">
          Panduan Fitpedia — konten disinkron dari <span className="font-mono">docs/07-GUIDE-SESI-*.md</span>
        </footer>
      </div>
    </HashRouter>
  );
}
