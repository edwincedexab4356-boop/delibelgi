export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPhoneForWhatsApp = (rawPhone: string): string => {
  // Clean non-digits
  const digits = rawPhone.replace(/\D/g, '');
  // In Panama, phones are 8 digits starting with 6 (mobile) or 4/7 (landline).
  // If already starts with 507, keep it. If 8 digits, prepend 507.
  if (digits.startsWith('507') && digits.length === 11) {
    return digits;
  }
  if (digits.length === 8) {
    return `507${digits}`;
  }
  return digits || '50767979141';
};

export const createWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const checkIsOpenNow = (
  schedule: Record<string, string>
): { isOpen: boolean; todayText: string; currentDay: string } => {
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const now = new Date();
  const dayIndex = now.getDay();
  const currentDay = dayNames[dayIndex];
  const todaySchedule = schedule[currentDay] || '9:00 a.m. – 7:30 p.m.';

  if (todaySchedule.toLowerCase().includes('cerrado')) {
    return { isOpen: false, todayText: 'Hoy: Cerrado', currentDay };
  }

  // Approximate schedule parse: 9:00 a.m. to 7:30 p.m. (19:30)
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const openMinutes = 9 * 60; // 9:00 AM
  const closeMinutes = 19 * 60 + 30; // 7:30 PM

  const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

  return {
    isOpen,
    todayText: `Hoy (${currentDay}): ${todaySchedule}`,
    currentDay,
  };
};
