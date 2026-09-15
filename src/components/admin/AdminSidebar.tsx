import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Users,
  TrendingUp,
  Receipt,
  DollarSign,
  Cake,
  Settings,
  LogOut,
  ExternalLink,
  AlertTriangle,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'inicio'
  | 'pedidos'
  | 'productos'
  | 'categorias'
  | 'inventario'
  | 'clientes'
  | 'ventas'
  | 'gastos'
  | 'ganancias'
  | 'personalizados'
  | 'configuracion';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToStore: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onBackToStore,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { settings, orders, customOrders, lowStockItems, adminLogout } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDIENTE').length;
  const pendingCustomCount = customOrders.filter((c) => c.status === 'SOLICITUD RECIBIDA').length;

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'productos', label: 'Productos', icon: <Package className="w-4 h-4" /> },
    { id: 'categorias', label: 'Categorías', icon: <Layers className="w-4 h-4" /> },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: <Boxes className="w-4 h-4" />,
      badge: lowStockItems.length > 0 ? lowStockItems.length : undefined,
      badgeColor: 'bg-amber-500 text-stone-900',
    },
    { id: 'clientes', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'ventas', label: 'Ventas', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'gastos', label: 'Gastos', icon: <Receipt className="w-4 h-4" /> },
    { id: 'ganancias', label: 'Ganancias', icon: <DollarSign className="w-4 h-4" /> },
    {
      id: 'personalizados',
      label: 'Pedidos Personalizados',
      icon: <Cake className="w-4 h-4" />,
      badge: pendingCustomCount > 0 ? pendingCustomCount : undefined,
      badgeColor: 'bg-pink-500 text-white',
    },
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between border-r border-stone-800 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-display font-bold text-lg shadow-md shadow-rose-600/30">
                B
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-base text-white truncate capitalize">
                  {settings.name}
                </h1>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                  Panel Administrativo
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-stone-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          {/* Back to Public Store */}
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              <span>Ver Tienda Pública</span>
            </span>
            <span className="text-[10px] text-stone-500">Live</span>
          </button>

          {/* Logout */}
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
