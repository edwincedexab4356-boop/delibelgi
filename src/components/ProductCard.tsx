import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatUSD } from '../utils/formatters';
import { Star, Plus, Eye, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { addToCart } = useApp();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavors && product.flavors.length > 0 ? product.flavors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );

  // Calculate dynamic price based on size if size has price string like "($15.00)"
  const getCurrentPrice = (): number => {
    if (selectedSize) {
      const match = selectedSize.match(/\$(\d+(\.\d+)?)/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    return product.price;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    addToCart(product, 1, selectedFlavor || undefined, selectedSize || undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const currentPrice = getCurrentPrice();

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenModal(product)}
      className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-rose-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-pink-300" /> Ver detalles & opiniones
          </span>
        </div>

        {/* Badges Top Left & Right */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-stone-900 shadow-sm">
              ★ Destacado
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
            {product.category}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5">
          {product.available ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
              Disponible
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-600 text-white shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Agotado
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-800">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-stone-400">
              ({product.reviewsCount || (product.reviews ? product.reviews.length : 0)})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Flavors or Sizes Options Selector (if applicable) */}
        {(product.flavors && product.flavors.length > 0) || (product.sizes && product.sizes.length > 0) ? (
          <div className="space-y-1.5 pt-1 border-t border-stone-100" onClick={(e) => e.stopPropagation()}>
            {product.flavors && product.flavors.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-stone-500 shrink-0">Sabor:</span>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-200 rounded-md px-1.5 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-400 w-full truncate"
                >
                  {product.flavors.map((fl) => (
                    <option key={fl} value={fl}>
                      {fl}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-stone-500 shrink-0">Tamaño:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-200 rounded-md px-1.5 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-400 w-full truncate"
                >
                  {product.sizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : null}

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
              Precio en USD
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-stone-900">
              {formatUSD(currentPrice)}
            </span>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            type="button"
            disabled={!product.available}
            onClick={handleQuickAdd}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
              !product.available
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
