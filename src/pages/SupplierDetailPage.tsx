import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Lock, Heart, Phone, MessageCircle,
  Building2, CreditCard, ClipboardCheck, ArrowLeft,
  Copy, CheckCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { mockSuppliers, mockCategories } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

export default function SupplierDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated, isSubscribed } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState('');

  const supplier = mockSuppliers.find((s) => s.slug === slug);
  const canSeeContact = isAuthenticated && isSubscribed;

  if (!supplier) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Supplier tidak ditemukan</p>
        <Link to="/cari" className="mt-4 inline-flex items-center gap-2 text-accent hover:underline">
          <ArrowLeft size={16} /> Kembali ke pencarian
        </Link>
      </div>
    );
  }

  const category = mockCategories.find((c) => c.id === supplier.category_ids[0]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const nextImage = () => setCurrentImage((p) => (p + 1) % supplier.images.length);
  const prevImage = () => setCurrentImage((p) => (p - 1 + supplier.images.length) % supplier.images.length);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link to="/cari" className="hover:text-accent">Cari Supplier</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{supplier.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column — Gallery + Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={supplier.images[currentImage]}
                alt={supplier.name}
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
              {supplier.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:bg-white">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:bg-white">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {supplier.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {supplier.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-16 w-20 overflow-hidden rounded-xl border-2 transition ${
                    i === currentImage ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Supplier Info */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-lg bg-accent-light px-2.5 py-1 text-xs font-semibold text-accent">
                    {category?.name}
                  </span>
                  <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{supplier.name}</h1>
                  <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={16} className="text-accent" />
                      {supplier.location_city}, {supplier.location_province}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(supplier.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-1 font-medium text-text-primary">{supplier.rating}</span>
                    </span>
                  </div>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`rounded-xl border p-2.5 transition ${
                      isFavorited
                        ? 'border-error/30 bg-error/10 text-error'
                        : 'border-border text-text-secondary hover:border-error/30 hover:text-error'
                    }`}
                  >
                    <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                  </button>
                )}
              </div>

              <p className="mt-5 leading-relaxed text-text-secondary">
                {supplier.description}
              </p>

              {/* Details */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-bg p-4">
                  <Building2 size={20} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Minimum Order</p>
                    <p className="mt-0.5 text-sm font-semibold">{supplier.min_order}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-bg p-4">
                  <CreditCard size={20} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Metode Pembayaran</p>
                    <p className="mt-0.5 text-sm font-semibold">{supplier.payment_methods.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kurasi Notes */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck size={20} className="text-success" />
                <h2 className="text-lg font-bold">Catatan Kurasi</h2>
              </div>
              <p className="leading-relaxed text-text-secondary">{supplier.kurasi_notes}</p>
            </div>
          </div>

          {/* Right Column — Contact */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              {/* Contact Card */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-bold">Informasi Kontak</h2>

                {canSeeContact ? (
                  <div className="mt-5 space-y-4">
                    {/* WhatsApp */}
                    <div className="flex items-center justify-between rounded-xl bg-bg p-4">
                      <div className="flex items-center gap-3">
                        <MessageCircle size={20} className="text-success" />
                        <div>
                          <p className="text-xs text-text-secondary">WhatsApp</p>
                          <p className="text-sm font-semibold">{supplier.contact_whatsapp}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(supplier.contact_whatsapp, 'wa')}
                        className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-gray-100"
                      >
                        {copied === 'wa' ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between rounded-xl bg-bg p-4">
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-accent" />
                        <div>
                          <p className="text-xs text-text-secondary">Telepon</p>
                          <p className="text-sm font-semibold">{supplier.contact_phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(supplier.contact_phone, 'phone')}
                        className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-gray-100"
                      >
                        {copied === 'phone' ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                      </button>
                    </div>

                    {/* Address */}
                    <div className="rounded-xl bg-bg p-4">
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-error shrink-0" />
                        <div>
                          <p className="text-xs text-text-secondary">Alamat</p>
                          <p className="text-sm font-semibold">{supplier.contact_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* WA CTA */}
                    <a
                      href={`https://wa.me/${supplier.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3.5 text-sm font-semibold text-white shadow-lg shadow-success/25 transition hover:bg-green-600"
                    >
                      <MessageCircle size={18} />
                      Chat via WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="relative overflow-hidden rounded-xl bg-bg p-6">
                      {/* Blurred fake contacts */}
                      <div className="space-y-3 select-none blur-[6px]">
                        <p className="text-sm">WA: 0812-3456-7890</p>
                        <p className="text-sm">Tel: 021-12345678</p>
                        <p className="text-sm">Jl. Contoh Alamat No. 123</p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                        <Lock size={28} className="text-accent" />
                        <p className="mt-2 text-sm font-semibold text-text-primary">
                          Kontak terkunci
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          Subscribe untuk melihat kontak
                        </p>
                      </div>
                    </div>
                    <Link
                      to={isAuthenticated ? '/subscribe' : '/signup'}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                    >
                      {isAuthenticated ? 'Subscribe Sekarang' : 'Daftar & Subscribe'}
                    </Link>
                  </div>
                )}
              </div>

              {/* Related Suppliers */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-bold">Supplier Serupa</h3>
                <div className="mt-4 space-y-3">
                  {mockSuppliers
                    .filter((s) => s.id !== supplier.id && s.category_ids.some((c) => supplier.category_ids.includes(c)))
                    .slice(0, 3)
                    .map((s) => (
                      <Link
                        key={s.id}
                        to={`/supplier/${s.slug}`}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-bg"
                      >
                        <img src={s.images[0]} alt={s.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{s.name}</p>
                          <p className="text-xs text-text-secondary">{s.location_city}</p>
                        </div>
                        <span className="text-xs font-medium text-accent">{s.rating}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
