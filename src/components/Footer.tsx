import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, Clock, Instagram, Facebook, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const { settings } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center shadow font-display font-bold text-xl">
                B
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight capitalize">
                {settings.name}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.description}
            </p>
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                Moneda Oficial
              </span>
              <p className="text-xs text-stone-400">
                Todos los precios de nuestros productos se expresan en Dólares Estadounidenses (USD $).
              </p>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-white">Contacto Directo</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-stone-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-200">WhatsApp Oficial:</p>
                  <a
                    href={`https://wa.me/507${settings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +507 {settings.whatsappNumber}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5 text-stone-400">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-200">Dirección:</p>
                  <p className="line-clamp-2">{settings.address}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-white">Horarios Principales</h4>
            <div className="text-xs space-y-1.5 text-stone-400">
              <p className="flex justify-between">
                <span>Lunes a Sábado:</span>
                <span className="text-stone-200 font-medium">9:00 a.m. – 7:30 p.m.</span>
              </p>
              <p className="flex justify-between">
                <span>Domingos:</span>
                <span className="text-rose-400 font-medium">Cerrado</span>
              </p>
            </div>
            <div className="pt-3">
              <a
                href="#contacto"
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
              >
                Ver horario semanal completo
              </a>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-white">Navegación & Redes</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  • Menú de Helados & Postres
                </a>
              </li>
              <li>
                <a href="#destacados" className="hover:text-white transition-colors">
                  • Productos Destacados
                </a>
              </li>
              <li>
                <a href="#personalizados" className="hover:text-white transition-colors">
                  • Cakes Personalizados
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  • Galería de Fotos
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">
                  • Sobre Nosotros
                </a>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-pink-400 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-blue-400 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin access link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} <span className="capitalize">{settings.name}</span>. Todos los derechos reservados.
            Ciudad de Colón, Panamá.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              Hecho con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para Colón
            </span>
            <span className="text-stone-700">•</span>
            {/* Direct link to admin dashboard */}
            <button
              id="footer-admin-link"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acceso Administrador (/admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
