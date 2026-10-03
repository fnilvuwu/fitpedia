import SesiPage from './SesiPage';
import { sesi2 } from '../data/sesi2';

export default function Sesi2Page() {
  return <SesiPage sesi={sesi2} nextTo="/sesi-3" nextLabel="Lanjut ke Sesi 3 →" />;
}
