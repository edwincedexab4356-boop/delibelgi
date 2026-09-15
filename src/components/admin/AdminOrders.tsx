import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatUSD, formatDateTime, createWhatsAppUrl } from '../../utils/formatters';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  Store,
  CreditCard,
  FileText,
  X,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const statuses: (OrderStatus | 'TODOS')[] = [
    'TODOS',
    'PENDIENTE',
    'CONFIRMADO',
    'EN PREPARACIÓN',
    'LISTO',
    'ENTREGADO',
    'CANCELADO',
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedStatus !== 'TODOS' && order.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchClient = order.customerName.toLowerCase().includes(q);
        const matchPhone = order.customerPhone.toLowerCase().includes(q);
        const matchProducts = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchNum && !matchClient && !matchPhone && !matchProducts) {
          return false;
        }
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  const handleDelete = (orderId: string, orderNumber: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el pedido ${orderNumber}?`)) {
      deleteOrder(orderId);
      if (activeOrderModal?.id === orderId) setActiveOrderModal(null);
    }
  };

  const openWhatsAppClient = (order: Order) => {
    const msg = `¡Hola ${order.customerName}! Te escribimos de *${settings.name}* respecto a tu pedido *${order.orderNumber}*. Tu pedido se encuentra en estado: *${order.status}*.`;
    const url = createWhatsAppUrl(order.customerPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Gestión de Pedidos
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Administra todos los pedidos de la tienda, actualiza su estado y notifica al cliente.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Total de pedidos: <span className="font-bold text-stone-900">{orders.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número, cliente o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {statuses.map((st) => {
              const count =
                st === 'TODOS' ? orders.length : orders.filter((o) => o.status === st).length;
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`text-[10px] px-1 rounded-full ${
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
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Pedido #</th>
                <th className="py-3.5 px-4">Fecha & Hora</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Productos</th>
                <th className="py-3.5 px-4">Total USD</th>
                <th className="py-3.5 px-4">Entrega</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <button
                        onClick={() => openWhatsAppClient(order)}
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-xs truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">
                      {formatUSD(order.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {order.deliveryMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${
                          order.status === 'CONFIRMADO' ||
                          order.status === 'LISTO' ||
                          order.status === 'ENTREGADO'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'EN PREPARACIÓN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'PENDIENTE'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="EN PREPARACIÓN">EN PREPARACIÓN</option>
                        <option value="LISTO">LISTO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setActiveOrderModal(order)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
                        title="Ver detalle del pedido"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id, order.orderNumber)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveOrderModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Pedido #{activeOrderModal.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client & Delivery Info */}
            <div className="bg-stone-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Cliente:</span>
                <span className="font-bold text-stone-900">{activeOrderModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Teléfono:</span>
                <span className="font-bold text-stone-900">{activeOrderModal.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Fecha & Hora:</span>
                <span className="font-bold text-stone-900">
                  {formatDateTime(activeOrderModal.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Método de Entrega:</span>
                <span className="font-bold text-stone-900">{activeOrderModal.deliveryMethod}</span>
              </div>
              {activeOrderModal.address && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Dirección:</span>
                  <span className="font-bold text-stone-900 text-right">
                    {activeOrderModal.address}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Método de Pago:</span>
                <span className="font-bold text-stone-900">{activeOrderModal.paymentMethod}</span>
              </div>
              {activeOrderModal.comments && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500 block mb-0.5">Comentarios del cliente:</span>
                  <span className="italic text-stone-800">{activeOrderModal.comments}</span>
                </div>
              )}
            </div>

            {/* Products breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                Productos del Pedido
              </h4>
              <div className="divide-y divide-stone-100">
                {activeOrderModal.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-stone-900">
                        {item.quantity}x {item.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.selectedFlavor && `Sabor: ${item.selectedFlavor} `}
                        {item.selectedSize && `• ${item.selectedSize} `}
                        {item.notes && `• "${item.notes}"`}
                      </p>
                    </div>
                    <span className="font-bold text-stone-900">
                      {formatUSD(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>{formatUSD(activeOrderModal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Costo de Delivery:</span>
                <span>{formatUSD(activeOrderModal.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total:</span>
                <span className="text-rose-600">{formatUSD(activeOrderModal.total)} USD</span>
              </div>
            </div>

            {/* State changer in modal */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-stone-700">Cambiar estado del pedido:</span>
              <select
                value={activeOrderModal.status}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus;
                  updateOrderStatus(activeOrderModal.id, newStatus);
                  setActiveOrderModal({ ...activeOrderModal, status: newStatus });
                }}
                className="text-xs font-bold rounded-xl px-3 py-2 border bg-white shadow-sm"
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CONFIRMADO">CONFIRMADO</option>
                <option value="EN PREPARACIÓN">EN PREPARACIÓN</option>
                <option value="LISTO">LISTO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
