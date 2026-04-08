import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobile = () => setMobileOpen(false);

  /* ---- avatar helper -------------------------------------------- */
  const initials = user?.full_name?.charAt(0).toUpperCase() ?? "U";

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* ---- Logo -------------------------------------------- */}
          <Link to="/" className="flex items-center gap-0.5 shrink-0">
            <span className="text-xl font-bold tracking-tight text-text-primary">
              CariBandar
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent -translate-y-2" />
          </Link>

          {/* ---- Desktop links ----------------------------------- */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/cari"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cari Supplier
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Harga
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* ---- Desktop right section --------------------------- */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              /* Avatar + dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full hover:bg-bg transition-colors pl-1 pr-2 py-1 cursor-pointer"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold select-none">
                    {initials}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg border border-border shadow-lg py-1 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
                      >
                        <Shield size={16} />
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-bg transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* ---- Mobile hamburger -------------------------------- */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-bg transition-colors cursor-pointer"
            aria-label="Buka menu"
          >
            <Menu size={24} className="text-text-primary" />
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  Mobile drawer (slide-in from right)                          */}
      {/* ============================================================ */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-surface shadow-xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <span className="text-lg font-bold text-text-primary">Menu</span>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg hover:bg-bg transition-colors cursor-pointer"
            aria-label="Tutup menu"
          >
            <X size={20} className="text-text-primary" />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col py-4 px-4 gap-1">
          <Link
            to="/cari"
            onClick={closeMobile}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
          >
            Cari Supplier
          </Link>
          <Link
            to="/pricing"
            onClick={closeMobile}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
          >
            Harga
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={closeMobile}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={closeMobile}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto border-t border-border px-4 py-4 absolute bottom-0 inset-x-0">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white text-sm font-semibold select-none">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full rounded-lg border border-error/30 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/5 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMobile}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/signup"
                onClick={closeMobile}
                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
