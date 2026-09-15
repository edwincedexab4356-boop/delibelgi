import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Layers, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setEditingCat(null);
    } else {
      addCategory({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim() || undefined,
      });
    }

    setName('');
    setDescription('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string, catName: string) => {
    const productsInCat = products.filter(
      (p) => p.category.toLowerCase() === catName.toLowerCase()
    ).length;

    if (productsInCat > 0) {
      if (
        !window.confirm(
          `La categoría "${catName}" tiene ${productsInCat} productos asociados. ¿Deseas eliminarla de todas formas?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`¿Eliminar la categoría "${catName}"?`)) return;
    }

    deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Gestión de Categorías
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Organiza el catálogo de delicias belgis. Las categorías se reflejan automáticamente en la barra de filtros de la web.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add / Edit Category */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-600" />
              <span>{editingCat ? 'Editar Categoría' : 'Nueva Categoría'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cheesecakes, Galletas..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Descripción corta (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Postres fríos y horneados..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {editingCat ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>
                {editingCat && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Table: Categories List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h4 className="font-bold text-sm text-stone-900">
                Categorías Activas ({categories.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Descripción</th>
                    <th className="py-3 px-4">Productos</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                    ).length;

                    return (
                      <tr key={cat.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4 font-bold text-stone-900">{cat.name}</td>
                        <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate">
                          {cat.description || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px]">
                            {count} productos
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
