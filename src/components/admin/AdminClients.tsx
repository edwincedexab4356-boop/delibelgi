import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatDateTime, createWhatsAppUrl } from '../../utils/formatters';
import { Users, Search, MessageCircle, ShoppingBag, MapPin, Calendar } from 'lucide-react';

interface ClientAggregation {
  phone: string;
  name: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderId: string;
}

export const AdminClients: React.FC = () => {
  const { orders, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Group and aggregate orders by customerPhone
  const clientsList = useMemo(() => {
    const map: Record<string, ClientAggregation> = {};

    orders.forEach((order) => {
      const phone = order.customerPhone.trim();
      if (!map[phone]) {
        map[phone] = {
          phone,
          name: order.customerName,
          address: order.address || 'Retiro en Local',
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          lastOrderId: order.orderNumber,
        };
      }

      const client = map[phone];
      client.orderCount += 1;
      client.totalSpent += order.total;
      if (new Date(order.createdAt) > new Date(client.lastOrderDate)) {
        client.lastOrderDate = order.createdAt;
        client.lastOrderId = order.orderNumber;
        if (order.address) client.address = order.address;
        client.name = order.customerName; // Update with most recent spelling
      }
    });

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientsList;
    const q = searchQuery.toLowerCase();
    return clientsList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [clientsList, searchQuery]);

  const openWhatsApp = (client: ClientAggregation) => {
    const msg = `¡Hola ${client.name}! Te saludamos de *${settings.name}*. Agradecemos mucho tu preferencia. ¿Te gustaría conocer nuestros postres y helados especiales de hoy?`;
    const url = createWhatsAppUrl(client.phone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Directorio de Clientes
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Historial de compradores, pedidos acumulados y monto total consumido en dólares (USD).
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Total clientes registrados: <span className="font-bold text-stone-900">{clientsList.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Teléfono / WhatsApp</th>
                <th className="py-3.5 px-4">Dirección Habitual</th>
                <th className="py-3.5 px-4 text-center">Nº Pedidos</th>
                <th className="py-3.5 px-4">Total Gastado (USD)</th>
                <th className="py-3.5 px-4">Último Pedido</th>
                <th className="py-3.5 px-4 text-right">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No se encontraron clientes con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.phone} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                      {client.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono">
                      {client.phone}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{client.address}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px]">
                        {client.orderCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900 text-sm">
                      {formatUSD(client.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{formatDateTime(client.lastOrderDate)}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        ({client.lastOrderId})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openWhatsApp(client)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
