import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createWhatsAppUrl } from '../utils/formatters';
import {
  Sparkles,
  Calendar,
  Cake,
  MessageCircle,
  Upload,
  CheckCircle2,
  DollarSign,
  Heart,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomOrderSection: React.FC = () => {
  const { settings, createCustomOrder } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [productType, setProductType] = useState('Cake de cumpleaños');
  const [size, setSize] = useState('20 a 25 porciones');
  const [flavor, setFlavor] = useState('Vainilla con chispas de chocolate');
  const [filling, setFilling] = useState('Dulce de leche y crema pastelera');
  const [designDescription, setDesignDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedBudget, setEstimatedBudget] = useState('$50 - $70 USD');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !eventDate) {
      alert('Por favor completa tu nombre, teléfono y la fecha del evento.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to state & database
      await createCustomOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        eventDate,
        productType,
        size,
        flavor,
        filling,
        designDescription: designDescription.trim() || 'Sin detalles específicos',
        quantity,
        estimatedBudget,
        referenceImage: referenceImageUrl.trim() || undefined,
        comments: comments.trim() || undefined,
      });

      // 2. Format WhatsApp message
      const waMessage = `¡Hola *${settings.name}*! 🎂 Deseo cotizar un *PEDIDO PERSONALIZADO*:

👤 *Cliente:* ${customerName.trim()}
📱 *Teléfono:* ${customerPhone.trim()}
📅 *Fecha del Evento:* ${eventDate}
🍰 *Tipo de Producto:* ${productType}
📏 *Tamaño / Porciones:* ${size}
🧁 *Sabor del Bizcocho:* ${flavor}
🍓 *Relleno deseado:* ${filling}
🔢 *Cantidad:* ${quantity}
🎨 *Descripción del Diseño:* ${designDescription.trim() || 'Ver imagen adjunta o acordar por chat'}
💰 *Presupuesto Estimado:* ${estimatedBudget}
${referenceImageUrl.trim() ? `🖼️ *Imagen de Referencia:* ${referenceImageUrl.trim()}\n` : ''}${
        comments.trim() ? `📝 *Comentarios:* ${comments.trim()}\n` : ''
      }
¿Podrían confirmarme disponibilidad y cotización formal? ¡Muchas gracias!`;

      // 3. Confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSubmitted(true);

      // 4. Open WhatsApp
      const waUrl = createWhatsAppUrl(settings.whatsappNumber, waMessage);
      window.open(waUrl, '_blank');

      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="personalizados" className="py-16 md:py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual info & tips */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide uppercase">
              <Cake className="w-3.5 h-3.5 text-rose-600" />
              <span>Repostería Fina para Eventos</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Cakes & Postres Personalizados
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Diseñamos la torta o mesa dulce de tus sueños para cumpleaños, bodas, aniversarios,
              bautizos, baby showers o eventos corporativos en Colón. Cuéntanos tu idea y crearemos
              una obra de arte comestible.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
                <Palette className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Diseños 100% a Medida</h4>
                  <p className="text-xs text-stone-600">
                    Fondant, buttercream, flores naturales, toppers de acrílico y temáticas infantiles o elegantes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Tiempo de Anticipación</h4>
                  <p className="text-xs text-stone-600">
                    Recomendamos realizar tu solicitud con 3 a 7 días de anticipación para asegurar tu cupo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
                <Heart className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Ingredientes Premium</h4>
                  <p className="text-xs text-stone-600">
                    Bizcochos húmedos y aromáticos rellenos de auténtico chocolate belga, frutas frescas o dulce de leche.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Order Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-md">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                    Solicitud de Cotización
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Rellena este formulario y te responderemos de inmediato por WhatsApp con la cotización exacta.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-200/80 text-rose-700 flex items-center justify-center font-bold text-lg">
                  🎂
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-stone-900">
                    ¡Solicitud Enviada con Éxito!
                  </h4>
                  <p className="text-sm text-stone-600 max-w-md mx-auto">
                    Hemos registrado tu pedido personalizado en nuestro sistema y abierto WhatsApp
                    para que podamos coordinar los detalles de diseño, fecha y cotización final.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                  >
                    Cotizar otro producto
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carmen Rodríguez"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Número de Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 67979141"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  {/* Row 2: Event Date and Product Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Fecha del Evento *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Tipo de Producto
                      </label>
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      >
                        <option value="Cake de cumpleaños">Cake de cumpleaños</option>
                        <option value="Cake temático / infantil">Cake temático / infantil</option>
                        <option value="Cake elegante 2 o más pisos">Cake elegante 2 o más pisos (Boda / XV)</option>
                        <option value="Cupcakes personalizados">Cupcakes personalizados (Docena o más)</option>
                        <option value="Mesa dulce para evento">Mesa dulce para evento</option>
                        <option value="Postres especiales en vasitos">Postres especiales en vasitos</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Size and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Tamaño / Porciones aproximadas
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. 15-20 porciones (o 2 pisos)"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Presupuesto aproximado (USD $)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. $45 - $60 USD"
                        value={estimatedBudget}
                        onChange={(e) => setEstimatedBudget(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  {/* Row 4: Flavor and Filling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Sabor del Bizcocho
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Red Velvet, Chocolate Belga, Vainilla..."
                        value={flavor}
                        onChange={(e) => setFlavor(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Relleno deseado
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Ganache de chocolate, Arequipe, Fresas..."
                        value={filling}
                        onChange={(e) => setFilling(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  {/* Design Description */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Descripción del Diseño & Temática
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Colores, dedicatoria, temática, detalles especiales..."
                      value={designDescription}
                      onChange={(e) => setDesignDescription(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                    />
                  </div>

                  {/* Reference Image link or upload */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Enlace de Imagen de Referencia (opcional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/foto-de-referencia.jpg"
                        value={referenceImageUrl}
                        onChange={(e) => setReferenceImageUrl(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      También podrás adjuntar tu fotografía o captura directamente en el chat de WhatsApp al enviar la solicitud.
                    </p>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Comentarios adicionales
                    </label>
                    <input
                      type="text"
                      placeholder="Hora del evento, entrega o detalles de interés..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="submit-custom-order-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <MessageCircle className="w-5 h-5 fill-white/20" />
                      <span>
                        {isSubmitting ? 'Procesando...' : 'Enviar Solicitud Personalizada por WhatsApp'}
                      </span>
                    </button>
                    <p className="text-[10px] text-center text-stone-500 mt-2">
                      Recibiremos tu solicitud en nuestro panel y te responderemos inmediatamente a través de WhatsApp ({settings.whatsappNumber}).
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
