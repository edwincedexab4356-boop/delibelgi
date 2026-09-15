import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Sparkles, Heart, ChefHat } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings } = useApp();

  return (
    <section id="nosotros" className="py-16 md:py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#FAF7F2]">
              <img
                src="https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=1000&q=80"
                alt="Elaboración artesanal en delicias belgis"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                    Tradición & Cariño
                  </p>
                  <p className="font-display text-xl font-bold">Ciudad de Colón, Panamá</p>
                </div>
              </div>
            </div>

            {/* Small floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-rose-600 text-white p-4 rounded-2xl shadow-xl max-w-[200px] border-2 border-white">
              <p className="text-2xl font-bold font-display leading-tight">100%</p>
              <p className="text-xs text-rose-100 font-medium">
                Pasión y dedicación en cada postre y helado
              </p>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Nuestra Historia & Compromiso</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Sobre {settings.name}
            </h2>

            {/* Editable Story */}
            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
              <p>{settings.aboutStory}</p>
              <p>{settings.aboutPhilosophy}</p>
            </div>

            {/* Core Values 3-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70">
                <ChefHat className="w-6 h-6 text-rose-600 mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">Recetas Fieles</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Texturas cremosas, bizcochos húmedos y combinaciones de sabor balanceadas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70">
                <Sparkles className="w-6 h-6 text-amber-500 mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">Frescura Diaria</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Elaboramos nuestros postres y cuidamos el helado en pequeños lotes frescos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70">
                <Award className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">Atención Personalizada</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Coordinación directa vía WhatsApp para que tu pedido llegue perfecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
