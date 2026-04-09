import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Search, Heart, Crown, Settings, LogOut, Star, MapPin,
  Trash2, Calendar, Zap, ChevronRight, User, MessageSquare, Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockSuppliers, mockCategories, mockReviews } from '../lib/mockData';

type Tab = 'overview' | 'favorites' | 'reviews' | 'settings';

export default function DashboardPage() {
  const { user, isAuthenticated, isSubscribed, logout, subscribe } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [favorites] = useState(mockSuppliers.slice(0, 3).map((s) => s.id));
  // Demo: show a couple of mock reviews as "my reviews"
  const myReviews = mockReviews.slice(0, 3);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const favoriteSuppliers = mockSuppliers.filter((s) => favorites.includes(s.id));
  const getCategoryName = (id: string) => mockCategories.find((c) => c.id === id)?.name ?? '';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: User },
    { id: 'favorites' as Tab, label: 'Favorit', icon: Heart },
    { id: 'reviews' as Tab, label: 'Ulasan Saya', icon: MessageSquare },
    { id: 'settings' as Tab, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Halo, {user?.full_name || 'User'}! 👋
            </h1>
            <p className="mt-1 text-text-secondary">
              Kelola akun dan supplier favoritmu di sini.
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-error hover:text-error"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex gap-1 rounded-xl bg-white border border-border p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                activeTab === id
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <Crown size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Status Langganan</p>
                      <p className={`text-sm font-bold ${isSubscribed ? 'text-success' : 'text-warning'}`}>
                        {isSubscribed ? 'Pro (Aktif)' : 'Gratis'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10">
                      <Heart size={20} className="text-error" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Supplier Favorit</p>
                      <p className="text-sm font-bold">{favorites.length} tersimpan</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                      <Search size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Pencarian Terakhir</p>
                      <p className="text-sm font-bold">12 kali</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              {!isSubscribed ? (
                <div className="rounded-2xl border-2 border-accent bg-gradient-to-r from-accent/5 to-accent-light/10 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <Zap size={20} className="text-accent" /> Upgrade ke Pro
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        Akses semua supplier, kontak lengkap, dan fitur premium lainnya.
                      </p>
                    </div>
                    <Link
                      to="/subscribe"
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                    >
                      Subscribe Rp 15.000/bln <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
                  <div className="flex items-center gap-3">
                    <Crown size={24} className="text-success" />
                    <div>
                      <h3 className="font-bold text-success">Langganan Pro Aktif</h3>
                      <p className="text-sm text-text-secondary">
                        <Calendar size={14} className="inline mr-1" />
                        Berlaku sampai 8 Mei 2026
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Favorites Preview */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Supplier Favorit Terbaru</h3>
                  <button onClick={() => setActiveTab('favorites')} className="text-sm font-medium text-accent hover:underline">
                    Lihat Semua
                  </button>
                </div>
                {favoriteSuppliers.length === 0 ? (
                  <p className="text-sm text-text-secondary">Belum ada supplier favorit.</p>
                ) : (
                  <div className="space-y-3">
                    {favoriteSuppliers.slice(0, 3).map((s) => (
                      <Link
                        key={s.id}
                        to={`/supplier/${s.slug}`}
                        className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-bg"
                      >
                        <img src={s.images[0]} alt={s.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{s.name}</p>
                          <p className="text-xs text-text-secondary">
                            {getCategoryName(s.category_ids[0])} · {s.location_city}
                          </p>
                        </div>
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{s.rating}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== FAVORITES ===== */}
          {activeTab === 'favorites' && (
            <div>
              {favoriteSuppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Heart size={48} className="text-gray-300" />
                  <p className="mt-4 text-lg font-semibold">Belum ada favorit</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Simpan supplier favoritmu saat browsing.
                  </p>
                  <Link
                    to="/cari"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
                  >
                    Cari Supplier
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteSuppliers.map((s) => (
                    <div key={s.id} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg">
                      <Link to={`/supplier/${s.slug}`}>
                        <div className="relative h-36 overflow-hidden bg-gray-100">
                          <img src={s.images[0]} alt={s.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link to={`/supplier/${s.slug}`}>
                          <h3 className="font-bold hover:text-accent">{s.name}</h3>
                        </Link>
                        <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} className="text-accent" /> {s.location_city}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Star size={14} className="fill-amber-400 text-amber-400" /> {s.rating}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/supplier/${s.slug}`}
                            className="flex-1 rounded-lg bg-accent/10 py-2 text-center text-xs font-semibold text-accent transition hover:bg-accent/20"
                          >
                            Lihat Detail
                          </Link>
                          <button className="rounded-lg border border-border p-2 text-text-secondary transition hover:border-error hover:text-error">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== REVIEWS ===== */}
          {activeTab === 'reviews' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold">Ulasan yang Pernah Kamu Tulis</h2>
                <span className="rounded-full bg-bg px-3 py-1 text-sm font-medium text-text-secondary">
                  {myReviews.length} ulasan
                </span>
              </div>
              {myReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <MessageSquare size={48} className="text-gray-300" />
                  <p className="mt-4 text-lg font-semibold">Belum ada ulasan</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Mulai berikan ulasan untuk supplier yang sudah kamu hubungi.
                  </p>
                  <Link to="/cari" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark">
                    Cari Supplier
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((r) => {
                    const supplier = mockSuppliers.find((s) => s.id === r.supplier_id);
                    return (
                      <div key={r.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {supplier && (
                              <img src={supplier.images[0]} alt={supplier.name}
                                className="h-12 w-12 rounded-xl object-cover shrink-0" />
                            )}
                            <div>
                              <p className="font-semibold">
                                {supplier?.name ?? 'Supplier'}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[1,2,3,4,5].map((n) => (
                                  <Star key={n} size={13}
                                    className={n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            r.status === 'approved' ? 'bg-success/10 text-success' :
                            r.status === 'pending'  ? 'bg-warning/10 text-warning' :
                            'bg-error/10 text-error'
                          }`}>
                            {r.status === 'pending' && <Clock size={11} />}
                            {r.status === 'approved' ? 'Ditampilkan' : r.status === 'pending' ? 'Moderasi' : 'Ditolak'}
                          </span>
                        </div>
                        {r.review_text && (
                          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                            "{r.review_text}"
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {supplier && (
                            <Link to={`/supplier/${supplier.slug}`}
                              className="text-xs font-medium text-accent hover:underline">
                              Lihat Supplier
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === 'settings' && (
            <div className="mx-auto max-w-xl">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="text-lg font-bold">Pengaturan Akun</h3>
                <form onSubmit={handleSaveSettings} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full rounded-xl border border-border bg-gray-100 px-4 py-3 text-sm text-text-secondary"
                    />
                    <p className="mt-1 text-xs text-text-secondary">Email tidak bisa diubah</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                  >
                    {saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
                  </button>
                </form>
              </div>

              {/* Subscription management */}
              <div className="mt-6 rounded-2xl border border-border bg-white p-6">
                <h3 className="text-lg font-bold">Langganan</h3>
                <div className="mt-4">
                  {isSubscribed ? (
                    <div className="flex items-center justify-between rounded-xl bg-success/5 p-4">
                      <div>
                        <p className="font-semibold text-success">Pro — Aktif</p>
                        <p className="text-sm text-text-secondary">Berlaku sampai 8 Mei 2026</p>
                      </div>
                      <Crown size={24} className="text-success" />
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-text-secondary text-sm">Kamu belum berlangganan.</p>
                      <button
                        onClick={() => subscribe()}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                      >
                        <Zap size={16} /> Upgrade ke Pro
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
