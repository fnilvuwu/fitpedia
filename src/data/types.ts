export interface CodeFile {
  file: string;
  lang: string;
  code: string;
  /** Sembunyikan tombol Salin (untuk konten non-kode seperti pohon folder). */
  noCopy?: boolean;
}

export interface WidgetRow {
  widget: string;
  fungsi: string;
  bagianPng: string;
}

export interface Step {
  id: string;
  judul: string;
  tujuan: string;
  pngHasil: string[];
  asetDipakai: string[];
  kerangka?: string;
  bedah?: WidgetRow[];
  kode: CodeFile[];
  checkpoint?: string[];
  catatan?: string;
}

export interface Sesi {
  id: string;
  nomor: string;
  judul: string;
  deskripsi: string;
  steps: Step[];
}
