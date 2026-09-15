import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminInventory } from './AdminInventory';
import { AdminClients } from './AdminClients';
import { AdminSales } from './AdminSales';
import { AdminExpenses } from './AdminExpenses';
import { AdminProfits } from './AdminProfits';
import { AdminCustomOrders } from './AdminCustomOrders';
import { AdminSettings } from './AdminSettings';
import { Menu, ExternalLink, Bell, Shield } from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { isAdminLoggedIn, settings } = useApp();
  const [currentTab, setCurrentTab] = useState<AdminTab>('inicio');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin onBackToStore={onBackToStore} />;
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'inicio':
        return <AdminOverview />;
      case 'pedidos':
        return <AdminOrders />;
      case 'productos':
        return <AdminProducts />;
      case 'categorias':
        return <AdminCategories />;
      case 'inventario':
        return <AdminInventory />;
      case 'clientes':
        return <AdminClients />;
      case 'ventas':
        return <AdminSales />;
      case 'gastos':
        return <AdminExpenses />;
      case 'ganancias':
        return <AdminProfits />;
      case 'personalizados':
        return <AdminCustomOrders />;
      case 'configuracion':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col lg:flex-row text-stone-800 font-sans">
      {/* Sidebar navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onBackToStore={onBackToStore}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-stone-700 capitalize">
                Panel en línea • {settings.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Ir a la Tienda Pública</span>
              <span className="sm:hidden">Tienda</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
