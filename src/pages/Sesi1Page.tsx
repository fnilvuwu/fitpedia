import SesiPage from './SesiPage';
import { sesi1 } from '../data/sesi1';

export default function Sesi1Page() {
  return <SesiPage sesi={sesi1} nextTo="/sesi-2" nextLabel="Lanjut ke Sesi 2 →" />;
}
