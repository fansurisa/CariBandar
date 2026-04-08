import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Lock, SlidersHorizontal, X } from 'lucide-react';
import { mockSuppliers, mockCategories } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

const provinces = [...new Set(mockSuppliers.map((s) => s.location_province))];

export default function SearchPage() {
  const { isAuthenticated, isSubscribed } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const FREE_LIMIT = 5;

  const filtered = useMemo(() => {
    return mockSuppliers.filter((s) => {
      if (s.status !== 'active') return false;
      const matchesQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        s.category_ids.some((cid) => selectedCategories.includes(cid));
      const matchesProvince =
        !selectedProvince || s.location_province === selectedProvince;
      return matchesQuery && matchesCategory && matchesProvince;
    });
  }, [query, selectedCategories, selectedProvince]);

  const canSeeAll = isAuthenticated && isSubscribed;
  const visibleSuppliers = canSeeAll ? filtered : filtered.slice(0, FREE_LIMIT);
  const hasMore = !canSeeAll && filtered.length > FREE_LIMIT;

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedProvince('');
  };

  const getCategoryName = (id: string) =>
    mockCategories.find((c) => c.id === id)?.name ?? '';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <h1 className="text-3xl font-extrabold">Cari Supplier</h1>
          <p className="mt-2 text-text-secondary">
            Temukan supplier terkurasi untuk kebutuhan bisnis kamu
          </p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari supplier, produk, atau kategori..."
              className="w-full rounded-xl border border-border bg-bg py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  Kategori
                </h3>
                <div className="space-y-2">
                  {mockCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded accent-accent"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  Provinsi
                </h3>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="">Semua Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              {(selectedCategories.length > 0 || selectedProvince) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-sm font-medium text-error hover:underline"
                >
                  <X size={14} /> Hapus semua filter
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm text-text-secondary">
                {filtered.length} supplier ditemukan
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium"
              >
                <SlidersHorizontal size={16} /> Filter
              </button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mb-6 rounded-xl border border-border bg-white p-4 lg:hidden">
                <h3 className="mb-3 text-sm font-semibold">Kategori</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        selectedCategories.includes(cat.id)
                          ? 'border-accent bg-accent text-white'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <h3 className="mb-2 text-sm font-semibold">Provinsi</h3>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="">Semua</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Results info (Desktop) */}
            <p className="mb-6 hidden text-sm text-text-secondary lg:block">
              Menampilkan {visibleSuppliers.length} dari {filtered.length} supplier
            </p>

            {/* Results grid */}
            {visibleSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={48} className="text-gray-300" />
                <p className="mt-4 text-lg font-semibold">Supplier tidak ditemukan</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Coba ubah kata kunci atau filter pencarian kamu
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleSuppliers.map((s) => (
                  <Link
                    key={s.id}
                    to={`/supplier/${s.slug}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <img
                        src={s.images[0]}
                        alt={s.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-accent backdrop-blur">
                        {getCategoryName(s.category_ids[0])}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold line-clamp-1">{s.name}</h3>
                      <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} className="text-accent" />
                          {s.location_city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {s.rating}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                        {s.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Paywall */}
            {hasMore && (
              <div className="relative mt-8">
                <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-bg to-transparent" />
                <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-white p-8 text-center shadow-lg">
                  <Lock size={32} className="mx-auto text-accent" />
                  <h3 className="mt-4 text-xl font-bold">
                    Masih ada {filtered.length - FREE_LIMIT} supplier lagi!
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Subscribe untuk melihat semua supplier dan akses kontak lengkap.
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    {!isAuthenticated ? (
                      <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                      >
                        Daftar & Subscribe
                      </Link>
                    ) : (
                      <Link
                        to="/subscribe"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                      >
                        Subscribe Sekarang — Rp 15.000/bulan
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
