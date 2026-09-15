import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

interface MenuSectionProps {
  onOpenModal: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onOpenModal }) => {
  const { products, categories } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Grouped or filtered items
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'Todos') {
          // Normalize compare
          if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
        // Availability filter
        if (onlyAvailable && !product.available) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchFlavors = product.flavors?.some((fl) => fl.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchFlavors) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        // Default: featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyAvailable]);

  // Unique categories list with "Todos"
  const categoryNames = useMemo(() => {
    const list = categories.map((c) => c.name);
    return ['Todos', ...list];
  }, [categories]);

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Catálogo & Menú Completo</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Nuestras Dulces Creaciones
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Explora nuestro menú artesanal: helados cremosos, dulcería selecta, tortas, cupcakes y postres.
            Todos los precios mostrados en dólares estadounidenses (USD $).
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-stone-200/80 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-products-input"
                type="text"
                placeholder="Buscar helados, postres, sabores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Sorting & Availability options */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
                />
                <span>Solo disponibles</span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  <option value="featured">Destacados primero</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor calificados (5★)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categoryNames.map((catName) => {
              const count =
                catName === 'Todos'
                  ? products.length
                  : products.filter(
                      (p) => p.category.toLowerCase() === catName.toLowerCase()
                    ).length;

              const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();

              return (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  <span>{catName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-3">
            <Filter className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-display text-xl font-bold text-stone-800">
              No se encontraron productos
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Intenta cambiar la categoría o los términos de búsqueda para encontrar lo que buscas.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
                setOnlyAvailable(false);
              }}
              className="mt-2 text-xs font-bold text-rose-600 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={onOpenModal}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
