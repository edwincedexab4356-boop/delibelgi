export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string; // e.g., 'Helados', 'Dulcería', 'Cakes', 'Cupcakes', 'Cheesecakes', 'Brownies', 'Galletas', 'Postres'
  price: number; // in USD
  description: string;
  image: string;
  available: boolean;
  featured: boolean;
  flavors?: string[];
  sizes?: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor?: string;
  selectedSize?: string;
  notes?: string;
}

export type OrderStatus =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN PREPARACIÓN'
  | 'LISTO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type DeliveryMethod = 'Retiro en Local' | 'Delivery a Domicilio';
export type PaymentMethod = 'Yappy' | 'Efectivo' | 'Transferencia Bancaria';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedFlavor?: string;
  selectedSize?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  address?: string;
  comments?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

export type CustomOrderStatus =
  | 'SOLICITUD RECIBIDA'
  | 'COTIZACIÓN'
  | 'CONFIRMADO'
  | 'EN PREPARACIÓN'
  | 'LISTO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface CustomOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  productType: string; // e.g. 'Cake de cumpleaños', 'Mesa dulce', etc.
  size: string; // e.g. '20 porciones (2 pisos)'
  flavor: string;
  filling: string;
  designDescription: string;
  quantity: number;
  estimatedBudget: string;
  referenceImage?: string;
  comments?: string;
  quotedPrice?: number;
  deposit?: number;
  balance?: number;
  status: CustomOrderStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // 'kg', 'litros', 'unidades', 'paquetes'
  minStock: number;
  supplier?: string;
  purchasePrice?: number; // in USD
  costPrice?: number; // in USD
  lastUpdated: string;
}

export interface Expense {
  id: string;
  date: string;
  category:
    | 'Ingredientes'
    | 'Empaques'
    | 'Servicios'
    | 'Delivery'
    | 'Publicidad'
    | 'Equipos'
    | 'Otros gastos';
  description: string;
  amount: number; // in USD
}

export interface DaySchedule {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface BusinessSettings {
  name: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  mapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  schedule: Record<string, string>; // e.g., { 'lunes': '9 a.m.–7:30 p.m.', ... }
  description: string;
  aboutStory: string;
  aboutPhilosophy: string;
  logoUrl: string;
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcement: string;
  deliveryFee: number;
  minOrderAmount: number;
}
