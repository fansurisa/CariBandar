import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Layers,
  Shield,
  Search,
  FileCheck,
  Phone,
  MapPin,
  Star,
  Lock,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Quote,
  Zap,
  Crown,
} from 'lucide-react';
import { mockSuppliers, mockCategories } from '../lib/mockData';

/* ------------------------------------------------------------------ */
/*  Testimonial data                                                   */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    quote:
      'Dulu cari supplier bisa makan waktu berminggu-minggu. Lewat CariBandar, dalam 1 hari saya sudah dapat 3 supplier terpercaya untuk toko saya.',
    name: 'Rina Wulandari',
    business: 'Pemilik Toko Sembako, Bandung',
    rating: 5,
  },
  {
    quote:
      'Yang paling saya suka, semua supplier di sini sudah dikurasi. Jadi saya nggak perlu khawatir soal kualitas dan harga yang nggak wajar.',
    name: 'Budi Santoso',
    business: 'Reseller Fashion Online, Surabaya',
    rating: 5,
  },
  {
    quote:
      'Harga langganannya sangat terjangkau dibanding manfaat yang saya dapat. Kontak supplier langsung tersedia, tinggal hubungi.',
    name: 'Dewi Anggraini',
    business: 'Owner Katering, Semarang',
    rating: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: 'Apa itu CariBandar?',
    a: 'CariBandar adalah platform direktori supplier terkurasi untuk UMKM dan reseller Indonesia.',
  },
  {
    q: 'Bagaimana cara kurasi dilakukan?',
    a: 'Tim kami menghubungi dan memverifikasi setiap supplier secara manual sebelum ditampilkan.',
  },
  {
    q: 'Bagaimana cara bayar subscription?',
    a: 'Pembayaran via QRIS \u2014 bisa pakai GoPay, OVO, Dana, ShopeePay, atau mobile banking.',
  },
  {
    q: 'Bisa refund?',
    a: 'Karena harga terjangkau dan akses langsung aktif, kami tidak menyediakan refund. Coba dulu dengan preview gratis.',
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: category name lookup                                       */
/* ------------------------------------------------------------------ */
function getCategoryName(categoryId: string): string {
  const cat = mockCategories.find((c) => c.id === categoryId);
  return cat?.name ?? 'Lainnya';
}

/* ------------------------------------------------------------------ */
/*  Star renderer                                                      */
/* ------------------------------------------------------------------ */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300'
          }
        />
      ))}
    </span>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const featured = mockSuppliers.slice(0, 6);

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[320px] w-[320px] rounded-full bg-accent-light/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-28 text-center sm:pt-36 sm:pb-28">
          {/* Small pill badge */}
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <Sparkles size={14} /> Direktori Supplier #1 Indonesia
          </span>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Supplier Terkurasi untuk{' '}
            <span className="text-accent">Bisnis Kamu</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Hemat waktu riset. Semua supplier di sini sudah kami verifikasi
            kualitas dan kredibilitasnya.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/cari"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
            >
              Mulai Cari Supplier <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-7 py-3.5 text-base font-semibold text-text-primary transition hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              Lihat Cara Kerja
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-text-secondary">
            {[
              { icon: CheckCircle, label: '50+ Supplier Terkurasi' },
              { icon: Layers, label: '4 Kategori' },
              { icon: Shield, label: '100% Dikurasi Manual' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-sm font-medium"
              >
                <Icon size={18} className="text-accent" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. HOW IT WORKS                                              */}
      {/* ============================================================ */}
      <section id="how-it-works" className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">
            Semudah 1 — 2 — 3
          </h2>

          <div className="relative mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute top-16 left-[16.67%] right-[16.67%] hidden h-0.5 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 sm:block" />

            {[
              {
                num: 1,
                icon: Search,
                title: 'Cari',
                desc: 'Ketik produk yang kamu butuhkan',
              },
              {
                num: 2,
                icon: FileCheck,
                title: 'Temukan',
                desc: 'Lihat supplier yang sudah kami kurasi',
              },
              {
                num: 3,
                icon: Phone,
                title: 'Hubungi',
                desc: 'Subscribe untuk akses kontak langsung',
              },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div
                key={num}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-white shadow-lg shadow-accent/25 transition group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-accent/30">
                  {num}
                </span>

                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent/20">
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. KURASI PROCESS                                            */}
      {/* ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-20">
          {/* Left: illustration placeholder */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-72 w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 to-accent-light/10 sm:h-96">
              {/* Abstract shapes for visual interest */}
              <div className="absolute top-8 left-8 h-20 w-20 rounded-2xl bg-accent/10" />
              <div className="absolute top-20 right-10 h-16 w-16 rounded-full bg-accent/15" />
              <div className="absolute bottom-12 left-1/4 h-24 w-24 rounded-2xl bg-accent/8 rotate-12" />
              <div className="absolute bottom-8 right-8 h-14 w-14 rounded-full bg-accent-light/20" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={64} className="text-accent/30" />
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Proses Kurasi
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Bukan Sekadar Direktori
            </h2>
            <p className="mt-5 leading-relaxed text-text-secondary">
              Kami tidak hanya mengumpulkan data supplier. Setiap supplier yang
              tampil di CariBandar telah melalui proses verifikasi menyeluruh
              oleh tim kami. Kami memastikan setiap aspek diperiksa agar kamu
              bisa fokus berbisnis tanpa rasa khawatir.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-4">
              {[
                'Kualitas produk',
                'Harga kompetitif',
                'Responsivitas komunikasi',
                'Track record transaksi',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={20}
                    className="shrink-0 text-success"
                  />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* Quote */}
            <blockquote className="mt-10 flex gap-3 rounded-2xl bg-surface p-5">
              <Quote
                size={24}
                className="shrink-0 rotate-180 text-accent/40"
              />
              <p className="italic leading-relaxed text-text-secondary">
                Kamu tinggal pilih dan hubungi — risetnya sudah kami kerjakan.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. FEATURED SUPPLIERS                                        */}
      {/* ============================================================ */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
            Supplier Pilihan
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">
            Supplier Unggulan Kami
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <div
                key={s.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={s.images[0]}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-accent shadow-sm backdrop-blur">
                    {getCategoryName(s.category_ids[0])}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold leading-snug line-clamp-1 flex-1">
                      {s.name}
                    </h3>
                    <span className="shrink-0 text-xs font-semibold">
                      <span className="text-amber-500">{'$'.repeat({'budget':1,'affordable':2,'midrange':3,'premium':4,'luxury':5}[s.price_level] ?? 2)}</span>
                      <span className="text-amber-200">{'$'.repeat(5 - ({'budget':1,'affordable':2,'midrange':3,'premium':4,'luxury':5}[s.price_level] ?? 2))}</span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} className="text-accent" />
                      {s.location_city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Stars rating={s.rating} />
                      <span className="ml-0.5 font-medium text-text-primary">
                        {s.rating}
                      </span>
                    </span>
                  </div>

                  {/* Blurred contact overlay */}
                  <div className="relative mt-4 overflow-hidden rounded-xl bg-gray-50 p-3">
                    <p className="select-none text-sm text-text-secondary blur-[5px]">
                      WA: 0812-xxxx-xxxx
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm">
                      <Lock size={14} className="text-accent" />
                      <span className="text-xs font-semibold text-accent">
                        Subscribe untuk lihat kontak
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/cari"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
            >
              Lihat Semua Supplier <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. TESTIMONIALS                                              */}
      {/* ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
            Testimoni
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">
            Dipercaya UMKM Indonesia
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-surface p-6 transition hover:shadow-lg hover:-translate-y-1"
              >
                <Stars rating={t.rating} />
                <p className="mt-4 leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-text-secondary">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. PRICING                                                   */}
      {/* ============================================================ */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
            Harga
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">
            Akses Unlimited Mulai{' '}
            <span className="text-accent">Rp 15.000</span>/bulan
          </h2>

          <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* FREE card */}
            <div className="flex flex-col rounded-2xl border border-border bg-white p-8 transition hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
                Gratis
              </p>
              <p className="mt-3 text-4xl font-extrabold">
                Rp 0
                <span className="text-base font-medium text-text-secondary">
                  /bulan
                </span>
              </p>

              <ul className="mt-8 flex-1 space-y-3">
                {[
                  'Lihat 5 supplier',
                  'Info dasar saja',
                  'Tanpa kontak supplier',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-gray-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/cari"
                className="mt-8 flex items-center justify-center gap-2 rounded-xl border-2 border-border py-3 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* PRO card */}
            <div className="relative flex flex-col rounded-2xl border-2 border-accent bg-white p-8 shadow-xl shadow-accent/10 transition hover:shadow-2xl hover:shadow-accent/15">
              {/* Badge */}
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/30">
                <Crown size={12} /> Populer
              </span>

              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Pro
              </p>
              <p className="mt-3 text-4xl font-extrabold">
                Rp 15.000
                <span className="text-base font-medium text-text-secondary">
                  /bulan
                </span>
              </p>

              <ul className="mt-8 flex-1 space-y-3">
                {[
                  'Akses semua supplier',
                  'Kontak lengkap WA/telepon/alamat',
                  'Simpan favorit',
                  'Filter advanced',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/subscribe"
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
              >
                <Zap size={16} /> Berlangganan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. FAQ                                                       */}
      {/* ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">
            Pertanyaan Umum
          </h2>

          <div className="mt-14 space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition"
                  >
                    <span className="font-semibold">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-text-secondary transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 leading-relaxed text-text-secondary">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER CTA                                                   */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-accent to-accent-dark py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Siap Temukan Supplier Terbaik?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Bergabung dengan ratusan UMKM yang sudah menemukan supplier
            terpercaya lewat CariBandar.
          </p>
          <Link
            to="/cari"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-accent shadow-xl transition hover:bg-gray-50 hover:shadow-2xl active:scale-[0.98]"
          >
            Mulai Sekarang <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
