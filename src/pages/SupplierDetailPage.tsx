import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MapPin, Star, Heart, ChevronLeft, Lock, Copy, Check,
  MessageCircle, Phone, Shield, ArrowRight, User, Mail,
  ExternalLink, Send, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockSuppliers, mockCategories, mockReviews } from '../lib/mockData';
import { PRICE_LEVEL_LABELS, PRICE_LEVEL_COUNTS } from '../lib/types';
import type { PriceLevel } from '../lib/types';

function PriceLevelBadge({ level }: { level: PriceLevel }) {
  const count = PRICE_LEVEL_COUNTS[level];
  const label = PRICE_LEVEL_LABELS[level];
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold">
      <span className="text-amber-500">{'$'.repeat(count)}</span>
      <span className="text-amber-200">{'$'.repeat(5 - count)}</span>
      <span className="ml-0.5 text-amber-700">{label}</span>
    </span>
  );
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star size={26} className={n <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
        </button>
      ))}
    </div>
  );
}

const SOCIAL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  tiktok:     { label: 'TikTok',       color: 'text-gray-800', bg: 'bg-gray-100 hover:bg-gray-200' },
  instagram:  { label: 'Instagram',    color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-100' },
  facebook:   { label: 'Facebook',     color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
  wa_business:{ label: 'WA Business',  color: 'text-green-600',bg: 'bg-green-50 hover:bg-green-100' },
};
const SHOP_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  shopee:    { label: 'Shopee',      color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100' },
  tokopedia: { label: 'Tokopedia',   color: 'text-green-700',  bg: 'bg-green-50 hover:bg-green-100' },
  lazada:    { label: 'Lazada',      color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' },
  blibli:    { label: 'BliBli',      color: 'text-blue-600',   bg: 'bg-blue-50 hover:bg-blue-100' },
  tiktok:    { label: 'TikTok Shop', color: 'text-gray-800',   bg: 'bg-gray-100 hover:bg-gray-200' },
};

function ExternalBadge({ label, url, color, bg }: { label: string; url: string; color: string; bg: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${bg} ${color}`}>
      <ExternalLink size={11} /> {label}
    </a>
  );
}

export default function SupplierDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isSubscribed, isAuthenticated } = useAuth();
  const [activeImg, setActiveImg] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const supplier = mockSuppliers.find((s) => s.slug === slug);
  if (!supplier) return <Navigate to="/cari" />;

  const category = mockCategories.find((c) => c.id === supplier.category_ids[0]);
  const relatedSuppliers = mockSuppliers
    .filter((s) => s.id !== supplier.id && s.category_ids.some((c) => supplier.category_ids.includes(c)))
    .slice(0, 3);
  const approvedReviews = mockReviews.filter((r) => r.supplier_id === supplier.id && r.status === 'approved');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const socialLinks = [
    supplier.social_tiktok    && { platform: 'tiktok',      url: supplier.social_tiktok },
    supplier.social_instagram && { platform: 'instagram',   url: supplier.social_instagram },
    supplier.social_facebook  && { platform: 'facebook',    url: supplier.social_facebook },
    supplier.social_wa_business && { platform: 'wa_business', url: supplier.social_wa_business },
  ].filter(Boolean) as { platform: string; url: string }[];

  const shopLinks = [
    supplier.shop_shopee    && { platform: 'shopee',    url: supplier.shop_shopee },
    supplier.shop_tokopedia && { platform: 'tokopedia', url: supplier.shop_tokopedia },
    supplier.shop_lazada    && { platform: 'lazada',    url: supplier.shop_lazada },
    supplier.shop_blibli    && { platform: 'blibli',    url: supplier.shop_blibli },
    supplier.shop_tiktok    && { platform: 'tiktok',    url: supplier.shop_tiktok },
  ].filter(Boolean) as { platform: string; url: string }[];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link to="/cari" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent mb-6">
          <ChevronLeft size={18} /> Kembali ke Pencarian
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ── LEFT ── */}
          <div className="space-y-6">
            {/* Gallery */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative aspect-[16/9] bg-gray-100">
                <img src={supplier.images[activeImg]} alt={supplier.name} className="h-full w-full object-cover" />
              </div>
              {supplier.images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {supplier.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${activeImg === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {category && <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">{category.name}</span>}
                <PriceLevelBadge level={supplier.price_level} />
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <h1 className="text-2xl font-extrabold lg:text-3xl">{supplier.name}</h1>
                <button onClick={() => setIsFavorited(!isFavorited)}
                  className={`shrink-0 rounded-xl p-2.5 transition ${isFavorited ? 'bg-red-50 text-red-500' : 'border border-border text-text-secondary hover:text-red-500'}`}>
                  <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Owner + Email */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5"><User size={14} /> {supplier.owner_name}</span>
                {isSubscribed ? (
                  <a href={`mailto:${supplier.email}`} className="flex items-center gap-1.5 text-accent hover:underline">
                    <Mail size={14} /> {supplier.email}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} />
                    <span className="blur-sm select-none">email@supplier.com</span>
                    <Lock size={12} className="text-warning" />
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-accent" />{supplier.location_city}, {supplier.location_province}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <strong className="text-text-primary">{supplier.rating}</strong>
                  <span>({supplier.review_count} ulasan)</span>
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{supplier.description}</p>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Media Sosial</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((s) => {
                      const cfg = SOCIAL_CONFIG[s.platform] ?? { label: s.platform, color: 'text-gray-600', bg: 'bg-gray-100' };
                      return <ExternalBadge key={s.platform} label={cfg.label} url={s.url} color={cfg.color} bg={cfg.bg} />;
                    })}
                  </div>
                </div>
              )}

              {/* Online Shops */}
              {shopLinks.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Toko Online</p>
                  <div className="flex flex-wrap gap-2">
                    {shopLinks.map((s) => {
                      const cfg = SHOP_CONFIG[s.platform] ?? { label: s.platform, color: 'text-gray-600', bg: 'bg-gray-100' };
                      return <ExternalBadge key={s.platform} label={cfg.label} url={s.url} color={cfg.color} bg={cfg.bg} />;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Kurasi */}
            <div className="rounded-2xl border border-accent/20 bg-accent-light/30 p-6">
              <div className="flex items-center gap-2 font-semibold text-accent mb-3">
                <Shield size={18} /> Catatan Kurasi CariBandar
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">{supplier.kurasi_notes}</p>
            </div>

            {/* Reviews */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Ulasan Pengguna</h2>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold">{supplier.rating}</span>
                  <span className="text-sm text-text-secondary">({supplier.review_count})</span>
                </div>
              </div>

              {approvedReviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {approvedReviews.map((r) => (
                    <div key={r.id} className="rounded-xl bg-bg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                            {r.reviewer_name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold">{r.reviewer_name}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((n) => (
                            <Star key={n} size={12} className={n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      {r.review_text && <p className="text-sm text-text-secondary">{r.review_text}</p>}
                      <p className="mt-1.5 text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary mb-8">Belum ada ulasan. Jadilah yang pertama!</p>
              )}

              {/* Write Review */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Tulis Ulasan</h3>
                {!isAuthenticated ? (
                  <div className="rounded-xl bg-bg p-4 text-center">
                    <p className="text-sm text-text-secondary mb-3">Login untuk menulis ulasan.</p>
                    <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-dark">
                      Masuk untuk Ulasan
                    </Link>
                  </div>
                ) : reviewSubmitted ? (
                  <div className="flex items-center gap-3 rounded-xl bg-success/10 p-4 text-success">
                    <Check size={20} />
                    <div>
                      <p className="font-semibold">Ulasan terkirim!</p>
                      <p className="text-sm opacity-80">Ulasanmu akan tampil setelah moderasi (1×24 jam).</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if (myRating > 0) setReviewSubmitted(true); }} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Rating *</label>
                      <StarRatingInput value={myRating} onChange={setMyRating} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Ulasan (opsional, maks 500 karakter)</label>
                      <textarea rows={3} maxLength={500} value={myReview} onChange={(e) => setMyReview(e.target.value)}
                        placeholder="Bagikan pengalamanmu dengan supplier ini..."
                        className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
                      <p className="mt-1 text-right text-xs text-text-secondary">{myReview.length}/500</p>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      Nama ditampilkan sebagai "Nama I." Ulasan melalui moderasi sebelum ditampilkan.
                    </div>
                    <button type="submit" disabled={myRating === 0}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50">
                      <Send size={16} /> Kirim Ulasan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div>
            <div className="sticky top-24 space-y-5">
              {/* Contact */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <h3 className="font-bold mb-4">Informasi Kontak</h3>
                {isSubscribed ? (
                  <div className="space-y-3">
                    {[
                      { key: 'wa', label: 'WhatsApp', value: supplier.contact_whatsapp },
                      { key: 'phone', label: 'Telepon', value: supplier.contact_phone },
                      { key: 'email', label: 'Email', value: supplier.email },
                    ].map(({ key, label, value }) => (
                      <div key={key} className="rounded-xl border border-border p-3">
                        <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold truncate">{value}</span>
                          <button onClick={() => handleCopy(value, key)} className="shrink-0 rounded-lg p-1.5 text-text-secondary hover:text-accent transition">
                            {copied === key ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="rounded-xl border border-border p-3">
                      <p className="text-xs font-medium text-text-secondary mb-1">Alamat</p>
                      <p className="text-sm">{supplier.contact_address}</p>
                    </div>
                    <a href={`https://wa.me/${supplier.contact_whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-success py-3 text-sm font-semibold text-white shadow-lg shadow-success/25 hover:bg-green-600 transition">
                      <MessageCircle size={18} /> Chat via WhatsApp
                    </a>
                    <a href={`tel:${supplier.contact_phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-border py-3 text-sm font-semibold hover:border-accent hover:text-accent transition">
                      <Phone size={18} /> Telepon
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['WhatsApp', 'Telepon', 'Email', 'Alamat'].map((label) => (
                      <div key={label} className="rounded-xl border border-border p-3">
                        <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm blur-sm select-none">
                            {label === 'WhatsApp' ? '628123xxxxxxx' : label === 'Telepon' ? '021xxxxxxxx' : label === 'Email' ? 'email@supplier.com' : 'Jl. Contoh No. 1, Kota'}
                          </span>
                          <Lock size={12} className="shrink-0 text-warning" />
                        </div>
                      </div>
                    ))}
                    <div className="rounded-xl bg-amber-50 p-3 text-center">
                      <Lock size={20} className="mx-auto text-warning mb-1.5" />
                      <p className="text-xs font-semibold text-amber-800">Kontak hanya untuk member Pro</p>
                    </div>
                    <Link to={isAuthenticated ? '/subscribe' : '/signup'}
                      className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-dark transition">
                      {isAuthenticated ? 'Subscribe Rp 15.000/bln' : 'Daftar & Subscribe'} <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Related */}
              {relatedSuppliers.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <h3 className="font-bold mb-4">Supplier Serupa</h3>
                  <div className="space-y-3">
                    {relatedSuppliers.map((s) => (
                      <Link key={s.id} to={`/supplier/${s.slug}`}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-bg">
                        <img src={s.images[0]} alt={s.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{s.name}</p>
                          <p className="text-xs text-text-secondary">{s.location_city}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{s.rating}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
