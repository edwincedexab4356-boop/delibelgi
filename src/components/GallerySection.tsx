import React, { useState } from 'react';
import { Camera, X, ZoomIn, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Cakes' | 'Helados' | 'Cupcakes' | 'Dulces' | 'Local' | 'Eventos' | 'Productos terminados';
  title: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'Cakes',
    title: 'Torta de Bodas en Fondant con Flores Naturales',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-2',
    category: 'Helados',
    title: 'Copas de Helado Artesanal con Frutas del Bosque',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-3',
    category: 'Cupcakes',
    title: 'Cupcakes Temáticos con Toppers Personalizados',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-4',
    category: 'Cakes',
    title: 'Pastel de Cumpleaños Dripping de Chocolate & Macarons',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-5',
    category: 'Dulces',
    title: 'Torre de Macarons Franceses Variados',
    image: 'https://images.unsplash.com/photo-1569864321318-64446924a974?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-6',
    category: 'Eventos',
    title: 'Mesa Dulce Montada para Celebración en Colón',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-7',
    category: 'Productos terminados',
    title: 'Cheesecake de Frutas Tropicales y Fresa Fresca',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-8',
    category: 'Helados',
    title: 'Waffle Caliente con Helado y Sirope Artesanal',
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-9',
    category: 'Local',
    title: 'Nuestro Espacio Acogedor en PH Bahía Limón',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  },
];

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    'Todos',
    'Cakes',
    'Helados',
    'Cupcakes',
    'Dulces',
    'Local',
    'Eventos',
    'Productos terminados',
  ];

  const filteredItems =
    selectedCategory === 'Todos'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="galeria" className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold tracking-wide uppercase">
            <Camera className="w-3.5 h-3.5 text-pink-600" />
            <span>Nuestras Obras & Momentos</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Galería Fotográfica
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Un vistazo a nuestras creaciones reales: pasteles para celebraciones, copas de helado,
            mesas de postres y nuestro cálido rincón en Ciudad de Colón.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-stone-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                <div className="flex justify-end">
                  <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block">
                    {item.category}
                  </span>
                  <h4 className="font-display text-base font-bold text-white leading-snug mt-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
            aria-label="Cerrar imagen"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="max-h-[75vh] w-auto mx-auto object-contain"
            />
            <div className="p-4 bg-stone-900 text-white text-center">
              <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">
                {activeImage.category}
              </span>
              <h3 className="font-display text-lg font-bold mt-0.5">{activeImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
