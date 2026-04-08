import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="text-2xl font-extrabold text-text-primary">
              Cari<span className="text-accent">Bandar</span>
            </Link>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h1 className="mt-5 text-2xl font-bold">Email Terkirim!</h1>
              <p className="mt-3 text-sm text-text-secondary">
                Kami sudah mengirim link reset password ke <strong>{email}</strong>.
                Cek inbox kamu dan ikuti instruksinya.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                <ArrowLeft size={16} /> Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-center text-2xl font-bold">Lupa Password?</h1>
              <p className="mt-2 text-center text-sm text-text-secondary">
                Masukkan email kamu dan kami akan kirim link untuk reset password.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark disabled:opacity-50"
                >
                  <Mail size={18} />
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-text-secondary">
                <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-accent hover:underline">
                  <ArrowLeft size={14} /> Kembali ke Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
