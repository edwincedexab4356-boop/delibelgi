import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { checkIsOpenNow, formatUSD } from '../utils/formatters';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  onNavigateToAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToAdmin }) => {
  const { settings, cartCount, cartSubtotal, setIsCartOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const status = checkIsOpenNow(settings.schedule);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Menú & Postres', href: '#menu' },
    { label: 'Destacados', href: '#destacados' },
    { label: 'Personalizados', href: '#personalizados' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto & Ubicación', href: '#contacto' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div
          id="announcement-bar"
          className="bg-stone-900 text-amber-200 text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2"
        >
          <span>{settings.announcement}</span>
          <span className="hidden md:inline-block text-stone-500">•</span>
          <a
            href={`https://wa.me/507${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-white hover:underline text-xs"
          >
            <Phone className="w-3 h-3 text-emerald-400" /> WhatsApp: {settings.whatsappNumber}
          </a>
        </div>
      )}

      {/* Main Navbar */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100 py-3'
            : 'bg-[#FAF7F2]/90 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <a
              href="#inicio"
              id="brand-logo-link"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-display font-bold text-xl sm:text-2xl leading-none">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-stone-900 capitalize group-hover:text-rose-600 transition-colors">
                  {settings.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-rose-500 uppercase -mt-1 flex items-center gap-1">
                  Helados • Dulcería • Repostería
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Action Items */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Open / Closed Live Indicator */}
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  status.isOpen
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}
                title={status.todayText}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{status.isOpen ? 'Abierto hoy' : 'Cerrado ahora'}</span>
              </div>

              {/* Shopping Cart Button */}
              <button
                id="navbar-cart-button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:shadow active:scale-95"
                aria-label="Abrir carrito"
              >
                <ShoppingBag className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Carrito</span>
                {cartCount > 0 ? (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-rose-500 text-white rounded-full text-xs font-bold animate-bounce">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-xs text-stone-300">0</span>
                )}
                {cartCount > 0 && (
                  <span className="hidden md:inline text-xs text-rose-200 font-semibold pl-1 border-l border-stone-700">
                    {formatUSD(cartSubtotal)}
                  </span>
                )}
              </button>

              {/* Visible Admin Portal Button for all screens */}
              <button
                id="navbar-admin-button"
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title="Acceso al Panel Administrativo"
                aria-label="Abrir Panel Administrativo"
              >
                <Shield className="w-3.5 h-3.5 text-rose-300" />
                <span className="hidden xs:inline">Panel Admin</span>
                <span className="xs:hidden">Admin</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                id="navbar-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg focus:outline-none"
                aria-label="Alternar menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden fixed inset-x-0 top-[65px] bg-white border-b border-stone-200 shadow-xl p-6 transition-all duration-200 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              {/* Status info */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-medium">Estado del local</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    status.isOpen
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {status.todayText}
                </span>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-base font-medium text-stone-800 hover:text-rose-600"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </a>
              ))}

              <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                <a
                  href={`https://wa.me/507${settings.whatsappNumber}?text=Hola%20delicias%20belgis,%20deseo%20hacer%20una%20consulta`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm shadow-sm"
                >
                  <Phone className="w-4 h-4" /> Escribir a WhatsApp ({settings.whatsappNumber})
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToAdmin();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-stone-100 text-stone-700 rounded-xl font-medium text-sm hover:bg-stone-200"
                >
                  <Shield className="w-4 h-4 text-stone-500" /> Panel Administrativo
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
