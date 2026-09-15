import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Store,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Truck,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();

  const [formData, setFormData] = useState({
    name: settings.name,
    tagline: settings.tagline,
    description: settings.description,
    aboutStory: settings.aboutStory,
    aboutPhilosophy: settings.aboutPhilosophy,
    whatsappNumber: settings.whatsappNumber,
    address: settings.address,
    mapsUrl: settings.mapsUrl,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl || '',
    deliveryFee: settings.deliveryFee,
    announcementBanner: settings.announcementBanner || '',
    showAnnouncement: settings.showAnnouncement,
    // Schedule
    scheduleLunes: settings.schedule['lunes'] || '9:00 a.m. – 7:30 p.m.',
    scheduleMartes: settings.schedule['martes'] || '9:00 a.m. – 7:30 p.m.',
    scheduleMiercoles: settings.schedule['miércoles'] || '9:00 a.m. – 7:30 p.m.',
    scheduleJueves: settings.schedule['jueves'] || '9:00 a.m. – 7:30 p.m.',
    scheduleViernes: settings.schedule['viernes'] || '9:00 a.m. – 7:30 p.m.',
    scheduleSabado: settings.schedule['sábado'] || '9:00 a.m. – 7:30 p.m.',
    scheduleDomingo: settings.schedule['domingo'] || 'Cerrado',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      aboutStory: formData.aboutStory.trim(),
      aboutPhilosophy: formData.aboutPhilosophy.trim(),
      whatsappNumber: formData.whatsappNumber.trim(),
      address: formData.address.trim(),
      mapsUrl: formData.mapsUrl.trim(),
      instagramUrl: formData.instagramUrl.trim(),
      facebookUrl: formData.facebookUrl.trim() || undefined,
      deliveryFee: Number(formData.deliveryFee),
      announcementBanner: formData.announcementBanner.trim() || undefined,
      showAnnouncement: formData.showAnnouncement,
      schedule: {
        lunes: formData.scheduleLunes,
        martes: formData.scheduleMartes,
        miércoles: formData.scheduleMiercoles,
        jueves: formData.scheduleJueves,
        viernes: formData.scheduleViernes,
        sábado: formData.scheduleSabado,
        domingo: formData.scheduleDomingo,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const backup = {
      settings,
      timestamp: new Date().toISOString(),
      localStorageDump: {
        products: localStorage.getItem('db_delicias_products_v1'),
        orders: localStorage.getItem('db_delicias_orders_v1'),
        customOrders: localStorage.getItem('db_delicias_custom_orders_v1'),
        inventory: localStorage.getItem('db_delicias_inventory_v1'),
        expenses: localStorage.getItem('db_delicias_expenses_v1'),
        categories: localStorage.getItem('db_delicias_categories_v1'),
        settings: localStorage.getItem('db_delicias_settings_v1'),
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `respaldo_delicias_belgis_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (
      window.confirm(
        '¿Estás seguro de restablecer todos los datos del sistema a los valores iniciales de delicias belgis? Esta acción no se puede deshacer.'
      )
    ) {
      resetAllData();
      alert('Datos restablecidos a la configuración inicial con éxito.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Configuración del Negocio
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Cualquier cambio guardado aquí actualiza de manera inmediata la página web pública de los clientes.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>¡Configuración guardada y sincronizada!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Identidad & WhatsApp */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-rose-600" />
            <span>Identidad & Datos de Contacto</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Número de WhatsApp (507 Panamá) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Eslogan / Frase Destacada
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Costo de Delivery en Colón (USD $) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Descripción General
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
            />
          </div>
        </div>

        {/* Card 2: Dirección & Google Maps */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <span>Ubicación & Enlace de Google Maps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Dirección Física Completa *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Enlace de Google Maps *
              </label>
              <input
                type="url"
                required
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Redes Sociales */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600" />
            <span>Redes Sociales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Enlace de Instagram *
              </label>
              <input
                type="url"
                required
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Enlace de Facebook
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Horarios Semanales */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Horarios de Atención Semanal</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Lunes:</label>
              <input
                type="text"
                value={formData.scheduleLunes}
                onChange={(e) => setFormData({ ...formData, scheduleLunes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Martes:</label>
              <input
                type="text"
                value={formData.scheduleMartes}
                onChange={(e) => setFormData({ ...formData, scheduleMartes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Miércoles:</label>
              <input
                type="text"
                value={formData.scheduleMiercoles}
                onChange={(e) => setFormData({ ...formData, scheduleMiercoles: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Jueves:</label>
              <input
                type="text"
                value={formData.scheduleJueves}
                onChange={(e) => setFormData({ ...formData, scheduleJueves: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Viernes:</label>
              <input
                type="text"
                value={formData.scheduleViernes}
                onChange={(e) => setFormData({ ...formData, scheduleViernes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Sábado:</label>
              <input
                type="text"
                value={formData.scheduleSabado}
                onChange={(e) => setFormData({ ...formData, scheduleSabado: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Domingo:</label>
              <input
                type="text"
                value={formData.scheduleDomingo}
                onChange={(e) => setFormData({ ...formData, scheduleDomingo: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-bold text-rose-600"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Banner de Anuncio en Web */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Banner de Anuncios / Avisos Superiores</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
              <input
                type="checkbox"
                checked={formData.showAnnouncement}
                onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>Mostrar barra superior de anuncio en la tienda pública</span>
            </label>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Texto del Anuncio
              </label>
              <input
                type="text"
                placeholder="Ej. ¡Nuevos sabores de helado belga disponibles hoy en PH Bahía Limón! 🎉"
                value={formData.announcementBanner}
                onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            id="save-settings-button"
            type="submit"
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-98"
          >
            Guardar y Sincronizar Cambios
          </button>
        </div>
      </form>

      {/* Backup & System Reset Card */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <h3 className="font-display font-bold text-lg text-white">
          Respaldo & Mantenimiento de Base de Datos Local
        </h3>
        <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
          Descarga una copia completa de seguridad en formato JSON conteniendo todos los pedidos, productos modificados, precios, inventario y configuración.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold border border-stone-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Descargar Respaldo JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold border border-rose-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Restablecer Datos de Demostración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
