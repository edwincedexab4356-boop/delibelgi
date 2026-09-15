import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  onOpenModal: (product: Product) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onOpenModal }) => {
  const { products } = useApp();

  const featuredProducts = products.filter((p) => p.featured);

  if (featuredProducts.length === 0) return null;

  return (
    <section id="destacados" className="py-16 md:py-20 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Selección de la Casa</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Productos Destacados
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-xl">
              Nuestras creaciones favoritas y más solicitadas por las familias y amantes del dulce en Colón.
            </p>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 group"
          >
            <span>Explorar todo el menú</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
