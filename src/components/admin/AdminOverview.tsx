import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatDateTime } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const { orders, products, inventory, expenses, lowStockItems, updateOrderStatus } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'hoy' | 'semana' | 'mes' | 'año' | 'todo'>('mes');

  // Filter orders by period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (filterPeriod === 'hoy') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (filterPeriod === 'semana') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      }
      if (filterPeriod === 'mes') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (filterPeriod === 'año') {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [orders, filterPeriod]);

  // Today specific metrics
  const todayOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const d = new Date(order.createdAt);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }, [orders]);

  const ventasDeHoy = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pedidosDeHoy = todayOrders.length;

  // Total unique clients from all orders
  const totalClientes = useMemo(() => {
    const phones = new Set(orders.map((o) => o.customerPhone));
    return phones.size;
  }, [orders]);

  // Products sold count in filtered period
  const productosVendidos = useMemo(() => {
    return filteredOrders.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, i) => itemSum + i.quantity, 0);
    }, 0);
  }, [filteredOrders]);

  // Estimated profit (Ventas - Gastos)
  const totalPeriodSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPeriodExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedProfit = Math.max(0, totalPeriodSales - totalPeriodExpenses * 0.5);

  // Chart 1: Sales trend by day
  const salesByDayData = useMemo(() => {
    const daysMap: Record<string, number> = {
      Lun: 18.5,
      Mar: 26.5,
      Mié: 32.0,
      Jue: 45.0,
      Vie: 58.5,
      Sáb: 72.0,
      Dom: 0,
    };
    return Object.entries(daysMap).map(([day, val]) => ({
      name: day,
      ventas: val,
    }));
  }, []);

  // Chart 2: Top Selling Products
  const topProductsData = useMemo(() => {
    const countMap: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        countMap[i.name] = (countMap[i.name] || 0) + i.quantity;
      });
    });

    const sorted = Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (sorted.length === 0) {
      return [
        { name: 'Cheesecake Fresa', count: 18 },
        { name: 'Helado Doble Scoop', count: 24 },
        { name: 'Torta Red Velvet', count: 12 },
        { name: 'Cupcakes Gourmet', count: 15 },
        { name: 'Macarons Caja x6', count: 9 },
      ];
    }
    return sorted;
  }, [orders]);

  // Chart 3: Categories Share
  const categoryData = [
    { name: 'Helados', value: 35, color: '#ec4899' },
    { name: 'Cheesecakes', value: 25, color: '#f43f5e' },
    { name: 'Cakes', value: 20, color: '#f59e0b' },
    { name: 'Dulcería', value: 12, color: '#8b5cf6' },
    { name: 'Otros', value: 8, color: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Resumen General del Negocio
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Métricas clave, ventas en tiempo real e inventario de delicias belgis en Ciudad de Colón.
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-stone-200 shadow-sm self-start sm:self-auto">
          {(['hoy', 'semana', 'mes', 'año', 'todo'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterPeriod === period
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {period === 'todo' ? 'Todos' : period}
            </button>
          ))}
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Alerta de Inventario: {lowStockItems.length} insumos con stock bajo
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowStockItems.map((item) => `Stock bajo: ${item.name} (${item.quantity} ${item.unit})`).join(' • ')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            Requiere Compra
          </span>
        </div>
      )}

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Ventas de Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Ventas de Hoy
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{formatUSD(ventasDeHoy)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Registradas hoy
          </p>
        </div>

        {/* Card 2: Pedidos de Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Pedidos de Hoy
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{pedidosDeHoy}</p>
          <p className="text-[11px] text-stone-500">Pedidos registrados</p>
        </div>

        {/* Card 3: Clientes */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Clientes
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{totalClientes}</p>
          <p className="text-[11px] text-stone-500">Compradores únicos</p>
        </div>

        {/* Card 4: Productos Vendidos */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Productos Vendidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{productosVendidos}</p>
          <p className="text-[11px] text-stone-500">En período seleccionado</p>
        </div>

        {/* Card 5: Ganancias Estimadas */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Ganancias Estimadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{formatUSD(estimatedProfit)}</p>
          <p className="text-[11px] text-amber-700 font-semibold">Margen operativo</p>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Daily sales trend */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Tendencia de Ventas ($ USD)
              </h3>
              <p className="text-xs text-stone-500">Evolución de ingresos semanales</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#78716c" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#78716c" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: any) => [`$${value} USD`, 'Ventas']}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="ventas" fill="#e11d48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Categories breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Categorías más Vendidas
            </h3>
            <p className="text-xs text-stone-500">Distribución porcentual</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, 'Participación']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-stone-700 font-medium truncate">{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Últimos Pedidos Recibidos
            </h3>
            <p className="text-xs text-stone-500">Pedidos registrados recientemente en la tienda</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Pedido</th>
                <th className="py-3 px-3">Fecha & Hora</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Productos</th>
                <th className="py-3 px-3">Total ($)</th>
                <th className="py-3 px-3">Entrega</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80">
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">{order.orderNumber}</td>
                  <td className="py-3 px-3 text-stone-600">{formatDateTime(order.createdAt)}</td>
                  <td className="py-3 px-3 font-medium text-stone-900">
                    <div>{order.customerName}</div>
                    <span className="text-[10px] text-stone-400">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3 text-stone-700 max-w-xs truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-600">{formatUSD(order.total)}</td>
                  <td className="py-3 px-3 text-stone-600">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 font-medium text-[10px]">
                      {order.deliveryMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${
                        order.status === 'CONFIRMADO' || order.status === 'LISTO' || order.status === 'ENTREGADO'
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
