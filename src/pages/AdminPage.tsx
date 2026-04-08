import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Plus, Edit3, Trash2, Users, Package, BarChart3, Search,
  Eye, EyeOff, Star, MapPin, Save, X, Crown, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockSuppliers, mockCategories } from '../lib/mockData';
import type { Supplier } from '../lib/types';

type Tab = 'suppliers' | 'users' | 'analytics';

const emptySupplier: Partial<Supplier> = {
  name: '', description: '', location_city: '', location_province: '',
  contact_whatsapp: '', contact_phone: '', contact_address: '',
  min_order: '', kurasi_notes: '', rating: 4, status: 'draft',
  category_ids: [], payment_methods: [], images: [],
};

export default function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('suppliers');
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isAuthenticated || !isAdmin) return <Navigate to="/" />;

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (id: string) => mockCategories.find((c) => c.id === id)?.name ?? '';

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

  const tabs = [
    { id: 'suppliers' as Tab, label: 'Supplier', icon: Package, count: suppliers.length },
    { id: 'users' as Tab, label: 'Users', icon: Users, count: 47 },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
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
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                activeTab === id ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} /> {label}
              {count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === id ? 'bg-white/20' : 'bg-bg'
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
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 overflow-y-auto">
                  <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold">
                        {isAdding ? 'Tambah Supplier Baru' : 'Edit Supplier'}
                      </h2>
                      <button onClick={() => { setEditingSupplier(null); setIsAdding(false); }} className="rounded-lg p-1.5 hover:bg-bg">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Nama Supplier *</label>
                          <input
                            value={editingSupplier.name || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Kategori</label>
                          <select
                            value={editingSupplier.category_ids?.[0] || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, category_ids: [e.target.value] })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          >
                            <option value="">Pilih Kategori</option>
                            {mockCategories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                        <textarea
                          rows={3}
                          value={editingSupplier.description || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, description: e.target.value })}
                          className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent resize-none"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Kota</label>
                          <input
                            value={editingSupplier.location_city || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, location_city: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Provinsi</label>
                          <input
                            value={editingSupplier.location_province || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, location_province: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium">WhatsApp</label>
                          <input
                            value={editingSupplier.contact_whatsapp || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_whatsapp: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Telepon</label>
                          <input
                            value={editingSupplier.contact_phone || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_phone: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Min. Order</label>
                          <input
                            value={editingSupplier.min_order || ''}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, min_order: e.target.value })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Alamat</label>
                        <input
                          value={editingSupplier.contact_address || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_address: e.target.value })}
                          className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Catatan Kurasi</label>
                        <textarea
                          rows={3}
                          value={editingSupplier.kurasi_notes || ''}
                          onChange={(e) => setEditingSupplier({ ...editingSupplier, kurasi_notes: e.target.value })}
                          className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent resize-none"
                        />
                      </div>
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
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Status</label>
                          <select
                            value={editingSupplier.status || 'draft'}
                            onChange={(e) => setEditingSupplier({ ...editingSupplier, status: e.target.value as Supplier['status'] })}
                            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
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
                            <span className="font-medium truncate max-w-[200px]">{s.name}</span>
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
        </div>
      </div>
    </div>
  );
}
