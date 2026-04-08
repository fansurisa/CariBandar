import { Link } from 'react-router-dom';
import { CheckCircle, Crown, Zap, X } from 'lucide-react';

const freeFeatures = [
  { text: 'Lihat 5 supplier', included: true },
  { text: 'Info dasar supplier', included: true },
  { text: 'Kontak supplier (WA, telepon, alamat)', included: false },
  { text: 'Simpan favorit', included: false },
  { text: 'Filter advanced', included: false },
];

const proFeatures = [
  { text: 'Akses semua supplier tanpa batas', included: true },
  { text: 'Info lengkap supplier', included: true },
  { text: 'Kontak supplier (WA, telepon, alamat)', included: true },
  { text: 'Simpan favorit', included: true },
  { text: 'Filter advanced', included: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent mb-4">
            <Zap size={14} /> Harga Sederhana
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Satu Harga, Akses{' '}
            <span className="text-accent">Unlimited</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Tidak ada biaya tersembunyi. Mulai gratis, upgrade kapan saja.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-4xl px-5 -mt-8 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* FREE */}
          <div className="flex flex-col rounded-2xl border border-border bg-white p-8 shadow-sm transition hover:shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
              Gratis
            </p>
            <p className="mt-4 text-4xl font-extrabold">
              Rp 0<span className="text-base font-medium text-text-secondary">/bulan</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Mulai jelajahi supplier terkurasi kami
            </p>

            <ul className="mt-8 flex-1 space-y-3.5">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  {f.included ? (
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-gray-400" />
                  ) : (
                    <X size={16} className="mt-0.5 shrink-0 text-gray-300" />
                  )}
                  <span className={f.included ? '' : 'text-text-secondary line-through'}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/cari"
              className="mt-8 flex items-center justify-center rounded-xl border-2 border-border py-3.5 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* PRO */}
          <div className="relative flex flex-col rounded-2xl border-2 border-accent bg-white p-8 shadow-xl shadow-accent/10 transition hover:shadow-2xl hover:shadow-accent/15">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/30">
              <Crown size={12} /> Populer
            </span>

            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Pro
            </p>
            <p className="mt-4 text-4xl font-extrabold">
              Rp 15.000<span className="text-base font-medium text-text-secondary">/bulan</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Akses penuh ke semua supplier & kontak
            </p>

            <ul className="mt-8 flex-1 space-y-3.5">
              {proFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-success" />
                  {f.text}
                </li>
              ))}
            </ul>

            <Link
              to="/subscribe"
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
            >
              <Zap size={16} /> Berlangganan Sekarang
            </Link>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-16 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-center mb-8">Perbandingan Lengkap</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-semibold text-text-secondary">Fitur</th>
                  <th className="py-3 text-center font-semibold text-text-secondary w-28">Gratis</th>
                  <th className="py-3 text-center font-semibold text-accent w-28">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Lihat supplier', '5 supplier', 'Unlimited'],
                  ['Informasi supplier', 'Dasar', 'Lengkap'],
                  ['Kontak WhatsApp', '✗', '✓'],
                  ['Kontak Telepon', '✗', '✓'],
                  ['Alamat Supplier', '✗', '✓'],
                  ['Simpan Favorit', '✗', '✓'],
                  ['Filter Advanced', '✗', '✓'],
                  ['Update Mingguan', '✗', '✓'],
                ].map(([feature, free, pro]) => (
                  <tr key={feature}>
                    <td className="py-3 font-medium">{feature}</td>
                    <td className="py-3 text-center text-text-secondary">{free}</td>
                    <td className="py-3 text-center font-medium text-accent">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ-like */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary">
            Ada pertanyaan?{' '}
            <Link to="/#faq" className="font-semibold text-accent hover:underline">
              Lihat FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
