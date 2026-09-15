import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatUSD, createWhatsAppUrl } from '../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Truck,
  Store,
  CreditCard,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    updateCartQty,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    settings,
    createOrder,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'Retiro en Local' | 'Delivery a Domicilio'>(
    'Retiro en Local'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comments, setComments] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Yappy' | 'Efectivo' | 'Transferencia Bancaria'>(
    'Yappy'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isCartOpen) return null;

  const deliveryFee = deliveryMethod === 'Delivery a Domicilio' ? settings.deliveryFee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckoutWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono.');
      return;
    }

    if (deliveryMethod === 'Delivery a Domicilio' && !deliveryAddress.trim()) {
      alert('Por favor ingresa tu dirección para el delivery en Colón.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Register order in database
      const orderItems = cart.map((item) => {
        let price = item.product.price;
        if (item.selectedSize) {
          const match = item.selectedSize.match(/\$(\d+(\.\d+)?)/);
          if (match && match[1]) price = parseFloat(match[1]);
        }
        return {
          productId: item.product.id,
          name: item.product.name,
          price,
          quantity: item.quantity,
          selectedFlavor: item.selectedFlavor,
          selectedSize: item.selectedSize,
          notes: item.notes,
        };
      });

      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee,
        total: grandTotal,
        deliveryMethod,
        address: deliveryMethod === 'Delivery a Domicilio' ? deliveryAddress.trim() : undefined,
        comments: comments.trim() || undefined,
        paymentMethod,
      });

      // 2. Build structured WhatsApp message
      const productLines = cart
        .map((item) => {
          let price = item.product.price;
          if (item.selectedSize) {
            const match = item.selectedSize.match(/\$(\d+(\.\d+)?)/);
            if (match && match[1]) price = parseFloat(match[1]);
          }
          const itemTotal = formatUSD(price * item.quantity);
          let extra = '';
          if (item.selectedFlavor) extra += ` | Sabor: ${item.selectedFlavor}`;
          if (item.selectedSize) extra += ` | Tamaño: ${item.selectedSize}`;
          if (item.notes) extra += ` | Nota: ${item.notes}`;
          return `• ${item.quantity}x ${item.product.name} (${itemTotal})${extra}`;
        })
        .join('\n');

      const waMessage = `¡Hola *${settings.name}*! 👋 Deseo realizar el siguiente pedido:

📋 *Número de Pedido:* ${newOrder.orderNumber}
👤 *Cliente:* ${customerName.trim()}
📱 *Teléfono:* ${customerPhone.trim()}
📍 *Método de Entrega:* ${deliveryMethod}
${
  deliveryMethod === 'Delivery a Domicilio'
    ? `🏠 *Dirección de entrega:* ${deliveryAddress.trim()}\n`
    : `🏬 *Retiro en:* ${settings.address}\n`
}💳 *Método de Pago:* ${paymentMethod}

🍰 *PRODUCTOS SOLICITADOS:*
${productLines}

💰 *Subtotal:* ${formatUSD(cartSubtotal)}
🛵 *Delivery:* ${formatUSD(deliveryFee)}
✨ *TOTAL A PAGAR:* ${formatUSD(grandTotal)} USD
${comments.trim() ? `\n📝 *Comentarios adicionales:* ${comments.trim()}` : ''}

¡Quedo a la espera de su confirmación! Muchas gracias.`;

      // 3. Trigger confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setOrderSuccess(true);

      // 4. Open WhatsApp
      const waUrl = createWhatsAppUrl(settings.whatsappNumber, waMessage);
      window.open(waUrl, '_blank');

      // Clear cart
      setTimeout(() => {
        clearCart();
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="shopping-cart-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-rose-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-stone-900">
                Tu Carrito de Delicias
              </h2>
              <p className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-stone-200/70 text-stone-500 flex items-center justify-center transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {orderSuccess ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900">
                ¡Pedido Enviado a WhatsApp!
              </h3>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                Tu pedido ha sido registrado con éxito en nuestro sistema y transferido a WhatsApp
                para que nuestro equipo empiece a prepararlo de inmediato.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(false);
                  setIsCartOpen(false);
                }}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800"
              >
                Seguir navegando
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-800">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explora nuestros deliciosos helados, cheesecakes, cupcakes y brownies para comenzar.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-700 underline"
              >
                Ver menú disponible
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item, index) => {
                  let price = item.product.price;
                  if (item.selectedSize) {
                    const match = item.selectedSize.match(/\$(\d+(\.\d+)?)/);
                    if (match && match[1]) price = parseFloat(match[1]);
                  }
                  return (
                    <div
                      key={`${item.product.id}-${index}`}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 space-y-0.5">
                          {item.selectedFlavor && <p>Sabor: {item.selectedFlavor}</p>}
                          {item.selectedSize && <p>Presentación: {item.selectedSize}</p>}
                          {item.notes && <p className="italic">"{item.notes}"</p>}
                        </div>
                        <p className="text-xs font-bold text-rose-600 mt-1">
                          {formatUSD(price * item.quantity)}{' '}
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({formatUSD(price)} c/u)
                          </span>
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQty(index, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(index, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Form */}
              <form onSubmit={handleCheckoutWhatsApp} className="space-y-4 pt-2 border-t border-stone-200">
                <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500">
                  Datos de Entrega & Cliente
                </h4>

                {/* Delivery Method Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Retiro en Local')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      deliveryMethod === 'Retiro en Local'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retiro en Local (Gratis)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Delivery a Domicilio')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      deliveryMethod === 'Delivery a Domicilio'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Delivery Colón ({formatUSD(settings.deliveryFee)})</span>
                  </button>
                </div>

                {/* Inputs: Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ana Morales"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      WhatsApp / Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 67979141"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Address (If delivery) */}
                {deliveryMethod === 'Delivery a Domicilio' && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Dirección exacta en Colón *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número de casa, punto de referencia..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Método de Pago Preferido:
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Yappy">Yappy (Banco General)</option>
                    <option value="Efectivo">Efectivo al recibir / retirar</option>
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  </select>
                </div>

                {/* Comments / Notes */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Comentarios o especificaciones (opcional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Hora aproximada de entrega, alergias, dedicatoria..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                  />
                </div>

                {/* Bill Summary */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal de productos:</span>
                    <span className="font-semibold text-stone-800">{formatUSD(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Costo de envío:</span>
                    <span className="font-semibold text-stone-800">
                      {deliveryFee === 0 ? 'Gratis' : formatUSD(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total a Pagar:</span>
                    <span className="text-rose-600">{formatUSD(grandTotal)} USD</span>
                  </div>
                </div>

                {/* Submit to WhatsApp Button */}
                <button
                  id="checkout-whatsapp-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-98 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                  <span>
                    {isSubmitting ? 'Generando Pedido...' : 'Enviar Pedido por WhatsApp'}
                  </span>
                </button>

                <p className="text-[10px] text-center text-stone-400">
                  Al pulsar, se abrirá WhatsApp con el resumen de tu pedido preformateado y se
                  guardará en nuestro sistema.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
