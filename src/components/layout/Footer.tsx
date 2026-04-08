import { Link } from "react-router-dom";
import { Camera, Music, Mail } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const platformLinks = [
  { label: "Tentang Kami", to: "/tentang" },
  { label: "Cara Kerja", to: "/cara-kerja" },
  { label: "Harga", to: "/pricing" },
];

const kategoriLinks = [
  { label: "Bahan Pokok", to: "/cari?kategori=bahan-pokok" },
  { label: "Sembako", to: "/cari?kategori=sembako" },
  { label: "Fashion", to: "/cari?kategori=fashion" },
  { label: "Pernak-pernik", to: "/cari?kategori=pernak-pernik" },
];

const bantuanLinks = [
  { label: "FAQ", to: "/faq" },
  { label: "Kontak", to: "/kontak" },
  { label: "Syarat & Ketentuan", to: "/syarat" },
  { label: "Kebijakan Privasi", to: "/privasi" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/caribandar",
    icon: Camera,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@caribandar",
    icon: Music,
  },
  {
    label: "Email",
    href: "mailto:halo@caribandar.com",
    icon: Mail,
  },
];

/* ------------------------------------------------------------------ */

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* ---- Main grid ------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1 — Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Kategori */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Kategori
            </h4>
            <ul className="space-y-2.5">
              {kategoriLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Bantuan */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {bantuanLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Ikuti Kami */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Ikuti Kami
            </h4>
            <ul className="space-y-2.5">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <s.icon size={16} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---- Bottom bar ------------------------------------------ */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.5 shrink-0">
            <span className="text-lg font-bold tracking-tight text-text-primary">
              CariBandar
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-accent -translate-y-1.5" />
          </Link>

          <p className="text-xs text-text-secondary">
            &copy; 2026 CariBandar. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
