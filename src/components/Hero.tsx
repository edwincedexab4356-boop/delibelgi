import React from 'react';
import { useApp } from '../context/AppContext';
import { createWhatsAppUrl, checkIsOpenNow } from '../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  IceCream,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings } = useApp();
  const status = checkIsOpenNow(settings.schedule);

  const heroWhatsAppUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `¡Hola ${settings.name}! Vi su página web y deseo consultar sobre sus helados y postres disponibles.`
  );

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-[#FAF7F2] via-rose-50/40 to-[#FAF7F2]"
    >
      {/* Decorative ambient background blur orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/60 text-rose-800 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Helados, Dulces & Repostería Fina en Colón</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                {settings.heroHeadline || 'Dulzura, frescura y elegancia en cada creación'}
              </h1>
              <p className="text-xl sm:text-2xl font-serif italic text-rose-600 font-medium">
                {settings.name}
              </p>
            </div>

            {/* Subtext */}
            <p className="text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
              {settings.heroSubheadline || settings.description}
            </p>

            {/* Quick value badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-700 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Ingredientes de Calidad</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Precios en USD ($)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Delivery en Colón & Retiro en Local</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                id="hero-menu-button"
                href="#menu"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-full shadow-lg shadow-stone-900/15 hover:shadow-stone-900/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <span>Ver Menú Completo</span>
                <ArrowRight className="w-4 h-4 text-pink-300" />
              </a>

              <a
                id="hero-whatsapp-button"
                href={heroWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>

            {/* Info Snippet (Location & Hours) */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-stone-900 group"
              >
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-stone-800">Ubicación</p>
                  <p className="line-clamp-2">{settings.address}</p>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-800">Horario de Atención</p>
                  <p>{status.todayText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Parallax / Floating Elements */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            {/* Main Centerpiece Image Card */}
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[4/5]">
                <img
                  src={
                    settings.heroImage ||
                    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Helados y Repostería Delicias Belgis"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />

                {/* Bottom Image Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1 text-amber-300 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-300" />
                    ))}
                    <span className="text-xs font-bold text-white ml-1">4.9 / 5.0</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Postres Artesanales de Alta Calidad
                  </h3>
                  <p className="text-xs text-stone-200 mt-0.5">
                    Preparados diariamente en Ciudad de Colón con pasión y frescura.
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Ice Cream Highlight */}
              <div
                id="hero-floating-badge-1"
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 animate-pulse"
                style={{ animationDuration: '4s' }}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <IceCream className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">Heladería Artesanal</p>
                  <p className="text-[11px] text-rose-500 font-medium">Sabores únicos y cremosos</p>
                </div>
              </div>

              {/* Floating Badge 2: Custom Cakes Badge */}
              <div
                id="hero-floating-badge-2"
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                  🎂
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">Cakes Personalizados</p>
                  <p className="text-[11px] text-stone-500 font-medium">Para tus fechas memorables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
