import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  QrCode, CheckCircle, Clock, Shield, Zap, Crown, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Status = 'idle' | 'pending' | 'success';

export default function SubscribePage() {
  const { isAuthenticated, isSubscribed, subscribe } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [timer, setTimer] = useState(900); // 15 minutes

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (isSubscribed && status !== 'success') return <Navigate to="/dashboard" />;

  const handleGenerateQRIS = () => {
    setStatus('pending');
  };

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending') return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleSimulatePayment = () => {
    setStatus('success');
    subscribe();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      <div className="mx-auto max-w-xl px-5 py-12">
        {/* Back button */}
        <Link to="/pricing" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent mb-8">
          <ArrowLeft size={16} /> Kembali ke Harga
        </Link>

        {status === 'success' ? (
          /* ===== SUCCESS STATE ===== */
          <div className="rounded-2xl border border-success/30 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold">Pembayaran Berhasil! 🎉</h1>
            <p className="mt-3 text-text-secondary">
              Selamat! Kamu sekarang sudah menjadi member <strong>Pro</strong>.
              Akses semua supplier dan kontak lengkap sudah aktif.
            </p>
            <div className="mt-6 rounded-xl bg-success/5 p-4">
              <div className="flex items-center justify-center gap-2 text-success font-semibold">
                <Crown size={20} /> Pro Member — Aktif
              </div>
              <p className="mt-1 text-sm text-text-secondary">Berlaku 30 hari dari sekarang</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate('/cari')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
              >
                Mulai Cari Supplier
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
              >
                Ke Dashboard
              </button>
            </div>
          </div>
        ) : status === 'pending' ? (
          /* ===== QRIS PENDING STATE ===== */
          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
            <h1 className="text-center text-xl font-extrabold">Scan QRIS untuk Bayar</h1>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Scan kode QR di bawah dengan e-wallet atau mobile banking kamu
            </p>

            {/* Fake QRIS */}
            <div className="mx-auto mt-8 flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5">
              <div className="text-center">
                <QrCode size={120} className="mx-auto text-accent/60" />
                <p className="mt-2 text-xs text-text-secondary">QRIS Demo</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">Total Pembayaran</p>
              <p className="text-3xl font-extrabold text-accent">Rp 15.000</p>
            </div>

            {/* Timer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
              <Clock size={16} />
              <span>Berlaku {formatTime(timer)}</span>
            </div>

            {/* Payment methods */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'Mandiri'].map((m) => (
                <span key={m} className="rounded-lg bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary">
                  {m}
                </span>
              ))}
            </div>

            {/* Simulate button (demo only) */}
            <div className="mt-8 rounded-xl bg-accent-light/50 p-4 text-center">
              <p className="text-xs text-text-secondary mb-3">
                <strong>Demo Mode:</strong> Klik tombol di bawah untuk simulasi pembayaran berhasil
              </p>
              <button
                onClick={handleSimulatePayment}
                className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-success/25 transition hover:bg-green-600"
              >
                <CheckCircle size={16} /> Simulasi Pembayaran Berhasil
              </button>
            </div>
          </div>
        ) : (
          /* ===== IDLE STATE — ORDER SUMMARY ===== */
          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <Zap size={28} className="text-accent" />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold">Upgrade ke Pro</h1>
              <p className="mt-2 text-text-secondary">
                Akses semua supplier dan kontak lengkap hanya dengan Rp 15.000/bulan
              </p>
            </div>

            {/* What you get */}
            <div className="mt-8 rounded-xl bg-bg p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">
                Yang kamu dapat
              </h3>
              <ul className="space-y-3">
                {[
                  'Akses semua supplier tanpa batas',
                  'Kontak lengkap: WhatsApp, telepon, alamat',
                  'Simpan supplier ke favorit',
                  'Filter pencarian advanced',
                  'Update supplier baru setiap minggu',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle size={16} className="shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">Pro — Bulanan</p>
                <p className="text-sm text-text-secondary">Berlaku 30 hari</p>
              </div>
              <p className="text-2xl font-extrabold text-accent">Rp 15.000</p>
            </div>

            {/* Security note */}
            <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
              <Shield size={14} className="shrink-0" />
              <span>Pembayaran aman via QRIS. Bisa bayar dari semua e-wallet & mobile banking.</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerateQRIS}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
            >
              <QrCode size={18} /> Bayar dengan QRIS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
