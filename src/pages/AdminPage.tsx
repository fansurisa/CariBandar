import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Plus, Edit3, Trash2, Users, Package, BarChart3, Search,
  Eye, EyeOff, Star, MapPin, Save, X, Crown, TrendingUp, MessageSquare,
  CheckCircle, XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockSuppliers, mockCategories, mockReviews } from '../lib/mockData';
import type { Supplier, Review } from '../lib/types';
import { PRICE_LEVEL_LABELS, PRICE_LEVEL_ORDER, PRICE_LEVEL_COUNTS } from '../lib/types';
import type { PriceLevel } from '../lib/types';

type Tab = 'suppliers' | 'users' | 'analytics' | 'reviews';
type ReviewFilter = 'all' | 'pending' | 'approved' | 'rejected';

const emptySupplier: Partial<Supplier> = {
  name: '', description: '', owner_name: '', email: '',
  location_city: '', location_province: '',
  contact_whatsapp: '', contact_phone: '', contact_address: '',
  price_level: 'affordable',
  social_tiktok: '', social_instagram: '', social_facebook: '', social_wa_business: '',
  shop_shopee: '', shop_tokopedia: '', shop_lazada: '', shop_blibli: '', shop_tiktok: '',
  kurasi_notes: '', rating: 4, status: 'draft',
  category_ids: [], images: [],
};

export default function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('suppliers');
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isAuthenticated || !isAdmin) return <Navigate to="/" />;

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  const getCategoryName = (id: string) => mockCategories.find((c) => c.id === id)?.name ?? '';
  const getSupplierName = (id: string) => suppliers.find((s) => s.id === id)?.name ?? id;

  const handleToggleStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus supplier ini?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveSupplier = () => {
    if (!editingSupplier?.name) return;
    if (isAdding) {
      const newSupplier: Supplier = {
        ...emptySupplier,
        ...editingSupplier,
        id: crypto.randomUUID(),
        slug: editingSupplier.name!.toLowerCase().replace(/\s+/g, '-'),
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'],
        review_count: 0,
        created_at: new Date().toISOString(),
      } as Supplier;
      setSuppliers((prev) => [newSupplier, ...prev]);
    } else {
      setSuppliers((prev) =>
        prev.map((s) => s.id === editingSupplier.id ? { ...s, ...editingSupplier } : s)
      );
    }
    setEditingSupplier(null);
    setIsAdding(false);
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: 'approved', moderated_at: new Date().toISOString() } : r)
    );
  };

  const handleRejectReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: 'rejected', moderated_at: new Date().toISOString() } : r)
    );
  };

  const tabs = [
    { id: 'suppliers' as Tab, label: 'Supplier', icon: Package, count: suppliers.length },
    { id: 'users' as Tab, label: 'Users', icon: Users, count: 47 },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'reviews' as Tab, label: 'Reviews', icon: MessageSquare, count: pendingReviewsCount, countWarning: true },
  ];

  // Mock users
  const mockUsers = [
    { id: '1', name: 'Rina Wulandari', email: 'rina@email.com', status: 'active', type: 'reseller', joined: '2026-03-15' },
    { id: '2', name: 'Budi Santoso', email: 'budi@email.com', status: 'active', type: 'umkm', joined: '2026-03-18' },
    { id: '3', name: 'Dewi Anggraini', email: 'dewi@email.com', status: 'expired', type: 'fnb', joined: '2026-03-20' },
    { id: '4', name: 'Ahmad Faisal', email: 'ahmad@email.com', status: 'free', type: 'reseller', joined: '2026-03-25' },
    { id: '5', name: 'Siti Nurhaliza', email: 'siti@email.com', status: 'active', type: 'umkm', joined: '2026-04-01' },
    { id: '6', name: 'Joko Widodo', email: 'joko@email.com', status: 'free', type: 'other', joined: '2026-04-05' },
  ];

  const inputCls = 'w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Admin Panel</h1>
            <p className="mt-1 text-text-secondary">Kelola supplier, user, dan pantau statistik.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-white border border-border p-1">
          {tabs.map(({ id, label, icon: Icon, count, countWarning }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                activeTab === id ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} /> {label}
              {count !== undefined && count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === id
                    ? 'bg-white/20'
                    : countWarning
                    ? 'bg-error/10 text-error font-semibold'
                    : 'bg-bg'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {/* ===== SUPPLIERS TAB ===== */}
          {activeTab === 'suppliers' && (
            <>
              {/* Supplier Editor Modal */}
              {editingSupplier && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 overflow-y-auto">
                  <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl mb-16">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold">
                        {isAdding ? 'Tambah Supplier Baru' : 'Edit Supplier'}
                      </h2>
                      <button onClick={() => { setEditingSupplier(null); setIsAdding(false); }} className="rounded-lg p-1.5 hover:bg-bg">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Row: Nama Supplier + Kategori */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Nama Supplier *</label>
                          <input
                            value={editingSupplier.name || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Kategori</label>
                          <select
                            value={editingSupplier.category_ids?.[0] || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, category_ids: [e.target.value] })}
                            className={inputCls}
                          >
                            <option value="">Pilih Kategori</option>
                            {mockCategories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row: Nama Pemilik + Email */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Nama Pemilik</label>
                          <input
                            value={editingSupplier.owner_name || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, owner_name: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Email Supplier</label>
                          <input
                            type="email"
                            value={editingSupplier.email || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Deskripsi */}
                      <div>
                        <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                        <textarea
                          rows={3}
                          value={editingSupplier.description || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, description: e.target.value })}
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      {/* Row: Kota + Provinsi */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Kota</label>
                          <input
                            value={editingSupplier.location_city || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, location_city: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Provinsi</label>
                          <input
                            value={editingSupplier.location_province || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, location_province: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Row: WA + Telepon + Price Level */}
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium">WhatsApp</label>
                          <input
                            value={editingSupplier.contact_whatsapp || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_whatsapp: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Telepon</label>
                          <input
                            value={editingSupplier.contact_phone || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_phone: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Price Level</label>
                          <select
                            value={editingSupplier.price_level || 'affordable'}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, price_level: e.target.value as PriceLevel })}
                            className={inputCls}
                          >
                            {PRICE_LEVEL_ORDER.map((pl) => (
                              <option key={pl} value={pl}>{PRICE_LEVEL_LABELS[pl]}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Alamat */}
                      <div>
                        <label className="mb-1 block text-sm font-medium">Alamat</label>
                        <input
                          value={editingSupplier.contact_address || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_address: e.target.value })}
                          className={inputCls}
                        />
                      </div>

                      {/* Social Media */}
                      <div>
                        <p className="mb-2 text-sm font-semibold text-text-secondary uppercase tracking-wide">Social Media</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium">TikTok URL</label>
                            <input
                              value={editingSupplier.social_tiktok || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, social_tiktok: e.target.value })}
                              placeholder="https://tiktok.com/@..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">Instagram URL</label>
                            <input
                              value={editingSupplier.social_instagram || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, social_instagram: e.target.value })}
                              placeholder="https://instagram.com/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">Facebook URL</label>
                            <input
                              value={editingSupplier.social_facebook || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, social_facebook: e.target.value })}
                              placeholder="https://facebook.com/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">WA Business URL</label>
                            <input
                              value={editingSupplier.social_wa_business || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, social_wa_business: e.target.value })}
                              placeholder="https://wa.me/..."
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Online Shops */}
                      <div>
                        <p className="mb-2 text-sm font-semibold text-text-secondary uppercase tracking-wide">Online Shop</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="mb-1 block text-sm font-medium">Shopee URL</label>
                            <input
                              value={editingSupplier.shop_shopee || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, shop_shopee: e.target.value })}
                              placeholder="https://shopee.co.id/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">Tokopedia URL</label>
                            <input
                              value={editingSupplier.shop_tokopedia || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, shop_tokopedia: e.target.value })}
                              placeholder="https://tokopedia.com/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">Lazada URL</label>
                            <input
                              value={editingSupplier.shop_lazada || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, shop_lazada: e.target.value })}
                              placeholder="https://lazada.co.id/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">BliBli URL</label>
                            <input
                              value={editingSupplier.shop_blibli || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, shop_blibli: e.target.value })}
                              placeholder="https://blibli.com/..."
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">TikTok Shop URL</label>
                            <input
                              value={editingSupplier.shop_tiktok || ''}
                              onChange={(e) => setEditingSupplier({ ...editingSupplier, shop_tiktok: e.target.value })}
                              placeholder="https://tiktokshop.com/..."
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Catatan Kurasi */}
                      <div>
                        <label className="mb-1 block text-sm font-medium">Catatan Kurasi</label>
                        <textarea
                          rows={3}
                          value={editingSupplier.kurasi_notes || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, kurasi_notes: e.target.value })}
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      {/* Row: Rating + Status */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Rating (1-5)</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            step={0.1}
                            value={editingSupplier.rating || 4}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, rating: parseFloat(e.target.value) })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Status</label>
                          <select
                            value={editingSupplier.status || 'draft'}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, status: e.target.value as Supplier['status'] })}
                            className={inputCls}
                          >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                      <button
                        onClick={() => { setEditingSupplier(null); setIsAdding(false); }}
                        className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-bg"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveSupplier}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                      >
                        <Save size={16} /> Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari supplier..."
                    className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
                  />
                </div>
                <button
                  onClick={() => { setIsAdding(true); setEditingSupplier({ ...emptySupplier }); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                >
                  <Plus size={16} /> Tambah Supplier
                </button>
              </div>

              {/* Supplier Table */}
              <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg/50">
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Supplier</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Kategori</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary hidden md:table-cell">Lokasi</th>
                      <th className="px-4 py-3 text-center font-semibold text-text-secondary hidden lg:table-cell">Harga</th>
                      <th className="px-4 py-3 text-center font-semibold text-text-secondary hidden md:table-cell">Rating</th>
                      <th className="px-4 py-3 text-center font-semibold text-text-secondary">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-text-secondary">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSuppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-bg/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={s.images[0]} alt={s.name} className="h-10 w-10 rounded-lg object-cover" />
                            <div>
                              <span className="font-medium truncate max-w-[180px] block">{s.name}</span>
                              {s.owner_name && (
                                <span className="text-xs text-text-secondary">{s.owner_name}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                          {getCategoryName(s.category_ids[0])}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-text-secondary">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} /> {s.location_city}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden lg:table-cell">
                          <span className="font-medium text-accent tracking-tight">
                            {'$'.repeat(PRICE_LEVEL_COUNTS[s.price_level])}
                            <span className="text-border">{'$'.repeat(5 - PRICE_LEVEL_COUNTS[s.price_level])}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <span className="inline-flex items-center gap-1">
                            <Star size={14} className="fill-amber-400 text-amber-400" /> {s.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            s.status === 'active' ? 'bg-success/10 text-success' :
                            s.status === 'draft' ? 'bg-warning/10 text-warning' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleStatus(s.id)}
                              className="rounded-lg p-2 text-text-secondary transition hover:bg-bg hover:text-text-primary"
                              title={s.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              {s.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              onClick={() => setEditingSupplier(s)}
                              className="rounded-lg p-2 text-text-secondary transition hover:bg-bg hover:text-accent"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="rounded-lg p-2 text-text-secondary transition hover:bg-bg hover:text-error"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ===== USERS TAB ===== */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg/50">
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 text-center font-semibold text-text-secondary hidden md:table-cell">Jenis Bisnis</th>
                    <th className="px-4 py-3 text-center font-semibold text-text-secondary">Langganan</th>
                    <th className="px-4 py-3 text-right font-semibold text-text-secondary hidden md:table-cell">Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-bg/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{u.email}</td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="capitalize text-text-secondary">{u.type}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.status === 'active' ? 'bg-success/10 text-success' :
                          u.status === 'expired' ? 'bg-error/10 text-error' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {u.status === 'active' && <Crown size={12} />}
                          {u.status === 'active' ? 'Pro' : u.status === 'expired' ? 'Expired' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary hidden md:table-cell">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== ANALYTICS TAB ===== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Users', value: '47', change: '+12%', icon: Users, color: 'text-accent' },
                  { label: 'Subscribers', value: '8', change: '+33%', icon: Crown, color: 'text-success' },
                  { label: 'Total Supplier', value: String(suppliers.length), change: '+5', icon: Package, color: 'text-warning' },
                  { label: 'MRR', value: 'Rp 120.000', change: '+25%', icon: TrendingUp, color: 'text-success' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-white p-6">
                    <div className="flex items-center justify-between">
                      <stat.icon size={20} className={stat.color} />
                      <span className="text-xs font-semibold text-success">{stat.change}</span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold">{stat.value}</p>
                    <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Popular Categories */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-bold mb-4">Kategori Populer</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Bahan Pokok', searches: 156, pct: 85 },
                    { name: 'Fashion & Tekstil', searches: 98, pct: 53 },
                    { name: 'Sembako & Grocery', searches: 87, pct: 47 },
                    { name: 'Pernak-pernik & Aksesoris', searches: 64, pct: 35 },
                  ].map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-text-secondary">{cat.searches} pencarian</span>
                      </div>
                      <div className="h-2 rounded-full bg-bg overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-bold mb-4">Pencarian Terpopuler</h3>
                <div className="flex flex-wrap gap-2">
                  {['bawang merah', 'beras murah', 'supplier hijab', 'cabai rawit', 'minyak goreng', 'kain katun', 'aksesoris hp', 'telur ayam', 'gula pasir', 'pakaian anak'].map((q) => (
                    <span key={q} className="rounded-lg bg-bg px-3 py-1.5 text-sm text-text-secondary">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REVIEWS TAB ===== */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Filter tabs */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as ReviewFilter[]).map((f) => {
                  const filterCount = f === 'all'
                    ? reviews.length
                    : reviews.filter((r) => r.status === f).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setReviewFilter(f)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                        reviewFilter === f
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-white border border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : f === 'approved' ? 'Disetujui' : 'Ditolak'}
                      <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                        reviewFilter === f ? 'bg-white/20' : 'bg-bg'
                      }`}>
                        {filterCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Reviews Table */}
              <div className="overflow-x-auto rounded-2xl border border-border bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg/50">
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Reviewer</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Supplier</th>
                      <th className="px-4 py-3 text-center font-semibold text-text-secondary">Rating</th>
                      <th className="px-4 py-3 text-center font-semibold text-text-secondary">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary hidden lg:table-cell">Ulasan</th>
                      <th className="px-4 py-3 text-right font-semibold text-text-secondary hidden md:table-cell">Tanggal</th>
                      <th className="px-4 py-3 text-right font-semibold text-text-secondary">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-bg/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                              {r.reviewer_name.charAt(0)}
                            </div>
                            <span className="font-medium whitespace-nowrap">{r.reviewer_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-text-secondary max-w-[160px]">
                          <span className="truncate block">{getSupplierName(r.supplier_id)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                              />
                            ))}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            r.status === 'approved' ? 'bg-success/10 text-success' :
                            r.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-error/10 text-error'
                          }`}>
                            {r.status === 'approved' ? 'Disetujui' : r.status === 'pending' ? 'Pending' : 'Ditolak'}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-text-secondary max-w-[250px]">
                          <span className="truncate block text-xs">{r.review_text || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-text-secondary hidden md:table-cell whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {r.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveReview(r.id)}
                                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-success transition hover:bg-success/10"
                                  title="Setujui"
                                >
                                  <CheckCircle size={14} /> Setuju
                                </button>
                                <button
                                  onClick={() => handleRejectReview(r.id)}
                                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-error transition hover:bg-error/10"
                                  title="Tolak"
                                >
                                  <XCircle size={14} /> Tolak
                                </button>
                              </>
                            )}
                            {r.status !== 'pending' && (
                              <span className="text-xs text-text-secondary italic">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReviews.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-text-secondary">
                          Tidak ada ulasan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
