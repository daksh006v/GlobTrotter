import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  Map,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Luggage,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useLanguageStore from "../store/languageStore";
import { Button } from "./ui/button";
import Logo from "./Logo";

export default function Navbar({ transparent = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const t = useLanguageStore((state) => state.t);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: t("dashboard"), href: "/dashboard", icon: Compass },
    { name: t("myTrips"), href: "/trips", icon: Luggage },
    { name: t("exploreCities"), href: "/cities", icon: Map },
    { name: "Activities", href: "/activities", icon: Sparkles },
    ...(user?.isAdmin ? [{ name: "Admin", href: "/admin", icon: ShieldCheck }] : []),
    { name: t("profile"), href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;
  const isLight = transparent && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isLight
          ? "bg-transparent border-b border-white/10 text-white"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <Logo
            size="sm"
            theme={isLight ? "light" : "dark"}
            to="/dashboard"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isLight
                      ? active
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                      : active
                      ? "bg-sky-50 text-sky-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/trips/new">
              <Button
                size="sm"
                className={`gap-1.5 rounded-full font-semibold px-4 cursor-pointer transition-colors ${
                  isLight
                    ? "bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{t("newTrip")}</span>
              </Button>
            </Link>

            <div className={`h-4 w-px mx-1 ${isLight ? "bg-white/20" : "bg-slate-200"}`} />

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className={`flex items-center gap-2 text-sm p-1 pr-2.5 rounded-full transition-colors ${
                  isLight
                    ? "text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
                title={user?.name || "User Profile"}
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user?.name || "Avatar"}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      isLight
                        ? "bg-sky-500 text-white font-bold"
                        : "bg-sky-100 text-sky-800 font-bold border border-sky-200"
                    }`}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                  </div>
                )}
                <span className="font-semibold text-xs max-w-[100px] truncate">
                  {user?.name ? user.name.split(" ")[0] : "Daksh"}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className={`h-8 w-8 rounded-full cursor-pointer ${
                  isLight
                    ? "text-white/70 hover:text-red-300 hover:bg-white/10"
                    : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                }`}
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/trips/new">
              <Button
                size="sm"
                className={`h-8 px-3 text-xs gap-1 rounded-full font-semibold ${
                  isLight ? "bg-sky-500 text-white" : "bg-slate-900 text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`h-9 w-9 rounded-full ${isLight ? "text-white hover:bg-white/10" : ""}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1 text-white">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
              </div>
              <span className="text-xs font-medium text-white/80">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-400 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
