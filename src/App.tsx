/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedSection } from './components/FeaturedSection';
import { MenuSection } from './components/MenuSection';
import { CustomOrderSection } from './components/CustomOrderSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { createWhatsAppUrl } from './utils/formatters';
import { MessageCircle, ArrowUp, Shield } from 'lucide-react';

function MainApp() {
  const { settings } = useApp();
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Synchronize route with URL pathname & hash (/admin or #admin or ?admin)
  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const path = (window.location.pathname || '').toLowerCase();
        const hash = (window.location.hash || '').toLowerCase();
        const search = (window.location.search || '').toLowerCase();

        if (
          path.includes('/admin') ||
          hash.includes('admin') ||
          search.includes('admin')
        ) {
          setCurrentView('admin');
        } else {
          setCurrentView('public');
        }
      } catch {
        // Fallback
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToAdmin = () => {
    setCurrentView('admin');
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      // Ignored for iframe sandbox restrictions
    }
    try {
      window.location.hash = 'admin';
    } catch {
      // Ignored
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToPublic = () => {
    setCurrentView('public');
    try {
      window.history.pushState(null, '', '/');
    } catch {
      // Ignored
    }
    try {
      window.location.hash = '';
    } catch {
      // Ignored
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // If in admin view, render Admin Dashboard
  if (currentView === 'admin') {
    return <AdminDashboard onBackToStore={navigateToPublic} />;
  }

  const floatingWhatsAppUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `¡Hola ${settings.name}! Me gustaría consultar sobre sus productos y hacer un pedido.`
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Announcement Banner (Editable from Dashboard) */}
      {settings.showAnnouncement && settings.announcementBanner && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
          <span>✨</span>
          <span>{settings.announcementBanner}</span>
        </div>
      )}

      {/* Public Navbar */}
      <Navbar onNavigateToAdmin={navigateToAdmin} />

      {/* Main Page Sections */}
      <main className="flex-grow">
        <Hero />
        <FeaturedSection onOpenModal={setSelectedProduct} />
        <MenuSection onOpenModal={setSelectedProduct} />
        <CustomOrderSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Public Footer */}
      <Footer onNavigateToAdmin={navigateToAdmin} />

      {/* Interactive Modal for product details & reviews */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-out Cart Drawer with WhatsApp Order Engine */}
      <CartDrawer />

      {/* Floating Direct Admin Access Quick Switcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="floating-admin-btn"
          onClick={navigateToAdmin}
          className="group flex items-center gap-2 px-3.5 py-2.5 bg-stone-900/90 hover:bg-rose-600 text-white rounded-full shadow-xl border border-stone-700/60 text-xs font-bold backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Acceso directo al Panel Administrativo"
          aria-label="Abrir Panel Administrativo"
        >
          <Shield className="w-4 h-4 text-rose-300 group-hover:text-white" />
          <span className="hidden sm:inline">Panel Admin</span>
          <span className="sm:hidden">Admin</span>
        </button>
      </div>

      {/* Floating Direct WhatsApp Button */}
      <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-11 h-11 rounded-full bg-white/90 text-stone-700 shadow-lg border border-stone-200/80 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all hover:scale-105 active:scale-95"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <a
          id="floating-whatsapp-btn"
          href={floatingWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Contactar por WhatsApp al 67979141"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="text-xs font-bold whitespace-nowrap pr-1 group-hover:inline-block hidden sm:inline-block">
            Pedir por WhatsApp
          </span>
        </a>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
