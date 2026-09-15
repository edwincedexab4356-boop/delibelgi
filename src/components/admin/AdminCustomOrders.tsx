import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomOrder, CustomOrderStatus } from '../../types';
import { formatUSD, formatDateTime, createWhatsAppUrl } from '../../utils/formatters';
import {
  Cake,
  Calendar,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Edit,
} from 'lucide-react';

export const AdminCustomOrders: React.FC = () => {
  const { customOrders, updateCustomOrderStatus, updateCustomOrderPricing, deleteCustomOrder, settings } =
    useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [activeModalOrder, setActiveModalOrder] = useState<CustomOrder | null>(null);

  // Pricing edit modal state
  const [editingPricingOrder, setEditingPricingOrder] = useState<CustomOrder | null>(null);
  const [quotedPrice, setQuotedPrice] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);

  const statuses: (CustomOrderStatus | 'TODOS')[] = [
    'TODOS',
    'SOLICITUD RECIBIDA',
    'COTIZACIÓN',
    'CONFIRMADO',
    'EN PREPARACIÓN',
    'LISTO',
    'ENTREGADO',
    'CANCELADO',
  ];

  const filteredOrders = customOrders.filter((order) => {
    if (selectedStatus !== 'TODOS' && order.status !== selectedStatus) return false;
    return true;
  });

  const handleOpenPricing = (order: CustomOrder) => {
    setEditingPricingOrder(order);
    setQuotedPrice(order.quotedPrice || 45);
    setDeposit(order.deposit || 20);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingOrder) return;

    updateCustomOrderPricing(editingPricingOrder.id, quotedPrice, deposit);
    setEditingPricingOrder(null);
  };

  const handleDelete = (id: string, clientName: string) => {
    if (window.confirm(`¿Eliminar solicitud de cake personalizado de "${clientName}"?`)) {
      deleteCustomOrder(id);
      if (activeModalOrder?.id === id) setActiveModalOrder(null);
    }
  };

  const openWhatsApp = (order: CustomOrder) => {
    const msg = `¡Hola ${order.customerName}! Te escribimos de *${settings.name}* respecto a tu solicitud de *${order.productType}* para el día *${order.eventDate}*. Estado actual: *${order.status}*${
      order.quotedPrice ? `. Cotización total: ${formatUSD(order.quotedPrice)} USD` : ''
    }.`;
    const url = createWhatsAppUrl(order.customerPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Pedidos de Repostería Personalizados
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Cakes para bodas, cumpleaños infantiles, mesas dulces y pedidos especiales con cotización, anticipo y saldo.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Solicitudes totales: <span className="font-bold text-stone-900">{customOrders.length}</span>
        </div>
      </div>

      {/* Filter Status Pills */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {statuses.map((st) => {
            const count =
              st === 'TODOS'
                ? customOrders.length
                : customOrders.filter((o) => o.status === st).length;
            const isSelected = selectedStatus === st;

            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{st}</span>
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

      {/* Custom Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Fecha Evento</th>
                <th className="py-3.5 px-4">Producto & Detalles</th>
                <th className="py-3.5 px-4">Cotización / Saldo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No se encontraron solicitudes personalizadas en este estado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const saldo =
                    order.quotedPrice !== undefined && order.deposit !== undefined
                      ? order.quotedPrice - order.deposit
                      : null;

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70">
                      <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                        {order.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        <button
                          onClick={() => openWhatsApp(order)}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.eventDate}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-stone-900">{order.productType}</p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {order.size} • {order.flavor}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.quotedPrice ? (
                          <div>
                            <span className="font-extrabold text-stone-900">
                              {formatUSD(order.quotedPrice)}
                            </span>
                            <p className="text-[10px] text-stone-500">
                              Anticipo: {formatUSD(order.deposit || 0)} | Saldo:{' '}
                              <span className="text-rose-600 font-bold">
                                {formatUSD(saldo || 0)}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenPricing(order)}
                            className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Definir cotización</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateCustomOrderStatus(order.id, e.target.value as any)
                          }
                          className="text-[11px] font-bold rounded-lg px-2 py-1 border bg-white shadow-sm"
                        >
                          <option value="SOLICITUD RECIBIDA">SOLICITUD RECIBIDA</option>
                          <option value="COTIZACIÓN">COTIZACIÓN</option>
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="EN PREPARACIÓN">EN PREPARACIÓN</option>
                          <option value="LISTO">LISTO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenPricing(order)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
                          title="Fijar cotización y anticipo"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveModalOrder(order)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
                          title="Ver detalles completos"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id, order.customerName)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600"
                          title="Eliminar solicitud"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing / Quote Modal */}
      {editingPricingOrder && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingPricingOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">
                Cotización de Cake Personalizado
              </h3>
              <button
                onClick={() => setEditingPricingOrder(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Cliente: <strong className="text-stone-900">{editingPricingOrder.customerName}</strong>
            </p>

            <form onSubmit={handleSavePricing} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Precio Total Cotizado ($ USD)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Anticipo / Abono Recibido ($ USD)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-xs flex justify-between font-bold">
                <span>Saldo pendiente:</span>
                <span className="text-rose-600">{formatUSD(quotedPrice - deposit)} USD</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPricingOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
                >
                  Guardar Cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {activeModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Cake className="w-5 h-5 text-rose-600" />
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Ficha de Cake Personalizado
                </h3>
              </div>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Cliente:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Teléfono:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Fecha del Evento:</span>
                <span className="font-bold text-rose-600">{activeModalOrder.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Producto:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tamaño / Porciones:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sabor del Bizcocho:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.flavor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Relleno:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.filling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Presupuesto inicial del cliente:</span>
                <span className="font-bold text-stone-900">{activeModalOrder.estimatedBudget}</span>
              </div>
            </div>

            {/* Design notes */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 block mb-1">
                Descripción del Diseño & Temática:
              </h4>
              <p className="p-3 bg-stone-50 rounded-xl text-xs text-stone-800 italic">
                "{activeModalOrder.designDescription}"
              </p>
            </div>

            {/* Reference Image */}
            {activeModalOrder.referenceImage && (
              <div>
                <h4 className="text-xs font-bold text-stone-700 block mb-1">
                  Imagen de Referencia:
                </h4>
                <a
                  href={activeModalOrder.referenceImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-stone-200 max-h-48"
                >
                  <img
                    src={activeModalOrder.referenceImage}
                    alt="Referencia de diseño"
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
            )}

            {/* WhatsApp CTA */}
            <div className="pt-2">
              <button
                onClick={() => openWhatsApp(activeModalOrder)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar al Cliente por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
