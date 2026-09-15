import React from 'react';
import { useApp } from '../context/AppContext';
import { checkIsOpenNow, createWhatsAppUrl } from '../utils/formatters';
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  ExternalLink,
  MessageCircle,
  Navigation,
  CheckCircle2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useApp();
  const status = checkIsOpenNow(settings.schedule);

  const contactWhatsAppUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `¡Hola ${settings.name}! Me gustaría consultar sobre sus productos, sabores de helado y disponibilidad para hoy.`
  );

  const daysOrder = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  return (
    <section id="contacto" className="py-16 md:py-24 bg-[#FAF7F2] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estamos para Atenderte</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Contacto & Horarios
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Visítanos en PH Bahía Limón o contáctanos directamente a nuestro WhatsApp oficial para pedidos rápidos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards & WhatsApp Direct */}
          <div className="lg:col-span-6 space-y-6">
            {/* WhatsApp Big Action Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Canal Oficial de Pedidos
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-100 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                  Atención Inmediata
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  WhatsApp: +507 {settings.whatsappNumber}
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                  Escríbenos para consultar disponibilidad de helados, coordinar entregas en Colón o cotizar pasteles especiales.
                </p>
              </div>

              <div className="pt-2">
                <a
                  id="contact-whatsapp-primary-btn"
                  href={contactWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 bg-white text-emerald-800 font-bold rounded-2xl text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-[1.01] active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                  <span>Chatear por WhatsApp Ahora</span>
                </a>
              </div>
            </div>

            {/* Address & Social Links */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Dirección del Local</h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{settings.address}</p>
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-2"
                  >
                    <span>Ver en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Síguenos en Redes:
                </span>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors text-xs font-bold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@dulzurasdebelgis</span>
                </a>

                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-bold"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Schedule & Location Map */}
          <div className="lg:col-span-6 space-y-6">
            {/* Detailed Hours Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    Horario de Atención
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    status.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {status.isOpen ? 'Abierto hoy' : 'Cerrado ahora'}
                </span>
              </div>

              {/* Schedule list */}
              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                {daysOrder.map((day) => {
                  const hours = settings.schedule[day] || '9:00 a.m. – 7:30 p.m.';
                  const isToday = status.currentDay.toLowerCase() === day.toLowerCase();
                  const isClosed = hours.toLowerCase().includes('cerrado');

                  return (
                    <div
                      key={day}
                      className={`py-2.5 flex items-center justify-between ${
                        isToday ? 'font-bold text-stone-900 bg-rose-50/70 -mx-3 px-3 rounded-lg' : 'text-stone-600'
                      }`}
                    >
                      <span className="capitalize flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                        {day}
                      </span>
                      <span className={isClosed ? 'text-rose-500 font-semibold' : ''}>
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Maps Location Preview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-rose-600" />
                  <h4 className="font-display font-bold text-base text-stone-900">
                    Ubicación en Google Maps
                  </h4>
                </div>

                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>Abrir mapa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Visual Simulated Map Display with Pin */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Mapa Ubicación Ciudad de Colón"
                  className="w-full h-full object-cover filter contrast-75 brightness-95"
                />
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl mb-2 animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-white text-sm sm:text-base drop-shadow-md">
                    delicias belgis
                  </h5>
                  <p className="text-xs text-stone-200 drop-shadow-sm max-w-xs mt-0.5">
                    Calle 2 ave. Bolivar, PH Bahía Limón, Colón
                  </p>
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-4 py-2 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-lg hover:bg-stone-50 transition-transform active:scale-95"
                  >
                    Cómo llegar con GPS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
