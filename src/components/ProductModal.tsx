import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatUSD } from '../utils/formatters';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, addProductReview } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Initialize selected options when product opens
  React.useEffect(() => {
    if (product) {
      setSelectedFlavor(product.flavors && product.flavors.length > 0 ? product.flavors[0] : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setQuantity(1);
      setSpecialNotes('');
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }
  }, [product]);

  if (!product) return null;

  // Calculate dynamic price based on size
  const getModalPrice = (): number => {
    if (selectedSize) {
      const match = selectedSize.match(/\$(\d+(\.\d+)?)/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    return product.price;
  };

  const currentPrice = getModalPrice();

  const handleAddToCart = () => {
    if (!product.available) return;
    addToCart(product, quantity, selectedFlavor || undefined, selectedSize || undefined, specialNotes || undefined);
    onClose();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addProductReview(product.id, {
      author: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewComment('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-stone-100 text-stone-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto">
          {/* Main Image Banner */}
          <div className="relative aspect-video w-full bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-rose-700 shadow">
                {product.category}
              </span>
              {product.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-900 shadow">
                  ★ Destacado
                </span>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header: Title, Price & Stars */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-stone-800">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({product.reviewsCount || (product.reviews ? product.reviews.length : 0)} opiniones)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-500 uppercase font-semibold block">
                  Precio unitario
                </span>
                <span className="text-3xl font-extrabold text-stone-900">
                  {formatUSD(currentPrice)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
                Descripción
              </h4>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Selectors: Flavor, Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.flavors && product.flavors.length > 0 && (
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                    Selecciona Sabor:
                  </label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                    Tamaño / Presentación:
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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

            {/* Special Instructions Note */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                Instrucciones o dedicatoria (opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. Sin sirope, con velita, etc."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Quantity and Add to Cart Section */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:bg-white transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-base text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:bg-white transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action Button */}
              <button
                id="modal-add-to-cart-button"
                type="button"
                disabled={!product.available}
                onClick={handleAddToCart}
                className={`flex-1 w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                  product.available
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 hover:shadow-rose-600/35 active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                {product.available ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>
                      Agregar al Carrito • {formatUSD(currentPrice * quantity)}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Producto No Disponible</span>
                  </>
                )}
              </button>
            </div>

            {/* Customer Reviews & 5-Star Feedback Section */}
            <div className="pt-6 border-t border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Opiniones de Clientes
                  </h3>
                </div>

                {!showReviewForm && (
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(true)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                  >
                    + Dejar mi opinión
                  </button>
                )}
              </div>

              {/* Review submission form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 mb-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">Califica este producto:</span>
                    {/* Star selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre (ej. Laura C.)"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Tu breve comentario sobre el postre..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="text-xs px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-200/60"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="text-xs px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                    >
                      Publicar Calificación
                    </button>
                  </div>

                  {reviewSubmitted && (
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ¡Gracias por tu calificación de 5 estrellas!
                    </p>
                  )}
                </form>
              )}

              {/* Review list */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-[10px]">
                            {rev.author.charAt(0)}
                          </div>
                          <span className="font-bold text-stone-900">{rev.author}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-stone-700 pl-8">{rev.comment}</p>
                      {rev.date && (
                        <p className="text-[10px] text-stone-400 pl-8">{rev.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  Aún no hay opiniones para este postre. ¡Sé el primero en calificarlo!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
