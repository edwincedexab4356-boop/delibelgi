import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD } from '../../utils/formatters';
import { TrendingUp, DollarSign, Calendar, CreditCard, PieChart as PieIcon, BarChart2 } from 'lucide-react';
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
} from 'recharts';

export const AdminSales: React.FC = () => {
  const { orders } = useApp();
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes' | 'año'>('mes');

  const now = new Date();

  // Metrics calculations
  const salesDay = useMemo(() => {
    return orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const salesWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return orders
      .filter((o) => new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const salesMonth = useMemo(() => {
    return orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const salesYear = useMemo(() => {
    return orders
      .filter((o) => new Date(o.createdAt).getFullYear() === now.getFullYear())
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  // Sales by payment method
  const salesByPaymentMethod = useMemo(() => {
    const map: Record<string, number> = { Yappy: 0, Efectivo: 0, 'Transferencia Bancaria': 0 };
    orders.forEach((o) => {
      const pm = o.paymentMethod || 'Yappy';
      map[pm] = (map[pm] || 0) + o.total;
    });

    const colors: Record<string, string> = {
      Yappy: '#0284c7',
      Efectivo: '#10b981',
      'Transferencia Bancaria': '#8b5cf6',
    };

    return Object.entries(map).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      color: colors[name] || '#f43f5e',
    }));
  }, [orders]);

  // Sales by product breakdown
  const salesByProduct = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        if (!map[i.name]) map[i.name] = { count: 0, total: 0 };
        map[i.name].count += i.quantity;
        map[i.name].total += i.price * i.quantity;
      });
    });

    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Reportes de Ventas
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Análisis de ingresos por período, métodos de pago más populares y rendimiento de productos.
        </p>
      </div>

      {/* 4 Period Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500">
            Ventas del Día
          </span>
          <p className="text-2xl font-extrabold text-stone-900">{formatUSD(salesDay)}</p>
          <p className="text-[11px] text-stone-400">Total recaudado hoy</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500">
            Ventas de la Semana
          </span>
          <p className="text-2xl font-extrabold text-stone-900">{formatUSD(salesWeek)}</p>
          <p className="text-[11px] text-stone-400">Últimos 7 días</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500">
            Ventas del Mes
          </span>
          <p className="text-2xl font-extrabold text-rose-600">{formatUSD(salesMonth)}</p>
          <p className="text-[11px] text-stone-400">Mes en curso</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500">
            Ventas del Año
          </span>
          <p className="text-2xl font-extrabold text-stone-900">{formatUSD(salesYear)}</p>
          <p className="text-[11px] text-stone-400">Año {now.getFullYear()}</p>
        </div>
      </div>

      {/* Charts: Payment Methods & Products Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Methods Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-600" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Ventas por Método de Pago
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`$${v} USD`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            {salesByPaymentMethod.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-stone-700">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-stone-900">{formatUSD(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Revenue Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-600" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Rendimiento Financiero por Producto
            </h3>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-center">Unidades</th>
                  <th className="py-2.5 px-3 text-right">Recaudación (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {salesByProduct.map((p) => (
                  <tr key={p.name} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-stone-700">{p.count}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-rose-600">
                      {formatUSD(p.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
