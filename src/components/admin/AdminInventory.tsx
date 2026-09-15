import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { formatUSD } from '../../utils/formatters';
import {
  Boxes,
  Plus,
  AlertTriangle,
  Minus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Search,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustInventoryStock } =
    useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    quantity: 10,
    unit: 'kg',
    minStock: 5,
    supplier: '',
    costPrice: 0,
  });

  const filteredInventory = inventory.filter((item) => {
    if (filterLowStock && item.quantity > item.minStock) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSupplier = item.supplier?.toLowerCase().includes(q);
      if (!matchName && !matchSupplier) return false;
    }
    return true;
  });

  const lowStockCount = inventory.filter((i) => i.quantity <= i.minStock).length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: 10,
      unit: 'kg',
      minStock: 5,
      supplier: 'Distribuidora Colón',
      costPrice: 5.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      supplier: item.supplier || '',
      costPrice: item.costPrice || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        name: formData.name.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit.trim(),
        minStock: Number(formData.minStock),
        supplier: formData.supplier.trim() || undefined,
        costPrice: Number(formData.costPrice),
      });
    } else {
      addInventoryItem({
        name: formData.name.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit.trim(),
        minStock: Number(formData.minStock),
        supplier: formData.supplier.trim() || undefined,
        costPrice: Number(formData.costPrice),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}" del inventario?`)) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Control de Inventario & Insumos
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Supervisa harina, chocolates, frutas, lácteos y empaques con alertas automáticas de reposición.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Insumo</span>
        </button>
      </div>

      {/* Alert Banner if any stock is low */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                ¡Atención! {lowStockCount} insumo(s) están al límite o por debajo del stock mínimo.
              </p>
              <p className="text-xs text-amber-800">
                Revisa los ingredientes marcados en rojo/ámbar para reponer con los proveedores.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className="px-3 py-1.5 rounded-xl bg-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            {filterLowStock ? 'Ver todos' : 'Filtrar solo stock bajo'}
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar insumo o proveedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded"
            />
            <span>Solo insumos con stock bajo</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ingrediente / Insumo</th>
                <th className="py-3.5 px-4">Stock Actual</th>
                <th className="py-3.5 px-4">Ajuste Rápido</th>
                <th className="py-3.5 px-4">Stock Mínimo</th>
                <th className="py-3.5 px-4">Costo Aprox. (USD)</th>
                <th className="py-3.5 px-4">Proveedor</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No se encontraron insumos con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.minStock;

                  return (
                    <tr key={item.id} className={`hover:bg-stone-50/70 ${isLow ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustInventoryStock(item.id, -1)}
                            className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                            title="Restar 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => adjustInventoryStock(item.id, 1)}
                            className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                            title="Sumar 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => adjustInventoryStock(item.id, 5)}
                            className="px-1.5 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700"
                            title="Sumar 5"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-stone-800 font-semibold">
                        {item.costPrice ? formatUSD(item.costPrice) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                        {item.supplier || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" /> Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            <CheckCircle className="w-3 h-3" /> Óptimo
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-stone-900">
                {editingItem ? 'Editar Insumo' : 'Registrar Insumo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nombre del Insumo / Ingrediente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Harina de trigo especial, Chocolate Belga..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Cantidad Actual *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Unidad de Medida *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="kg, litros, unidades, gramos..."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Stock Mínimo (Alerta) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Precio de Compra ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Proveedor
                </label>
                <input
                  type="text"
                  placeholder="Ej. Distribuidora del Atlántico, Colón..."
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
