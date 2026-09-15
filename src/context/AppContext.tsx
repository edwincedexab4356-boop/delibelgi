import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  CustomOrder,
  InventoryItem,
  Expense,
  BusinessSettings,
  OrderStatus,
  CustomOrderStatus,
  Review,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_ORDERS,
  INITIAL_EXPENSES,
} from '../data/initialData';

interface AppContextType {
  // Settings
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedFlavor?: string, selectedSize?: string, notes?: string) => void;
  updateCartQty: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Custom Orders
  customOrders: CustomOrder[];
  createCustomOrder: (data: Omit<CustomOrder, 'id' | 'createdAt' | 'status'>) => Promise<CustomOrder>;
  updateCustomOrderStatus: (id: string, status: CustomOrderStatus) => void;
  updateCustomOrder: (id: string, updates: Partial<CustomOrder>) => void;
  deleteCustomOrder: (id: string) => void;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  adjustInventoryStock: (id: string, delta: number) => void;
  deleteInventoryItem: (id: string) => void;
  lowStockItems: InventoryItem[];

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  isAdminLoggedIn: boolean;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;

  // Utilities
  resetToDefaults: () => void;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'db_delicias_settings_v1',
  PRODUCTS: 'db_delicias_products_v1',
  CATEGORIES: 'db_delicias_categories_v1',
  INVENTORY: 'db_delicias_inventory_v1',
  ORDERS: 'db_delicias_orders_v1',
  CUSTOM_ORDERS: 'db_delicias_custom_orders_v1',
  EXPENSES: 'db_delicias_expenses_v1',
  CART: 'db_delicias_cart_v1',
  AUTH: 'db_delicias_auth_v1',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization from localStorage with initial fallbacks
  const [settings, setSettingsState] = useState<BusinessSettings>(() =>
    getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [products, setProductsState] = useState<Product[]>(() =>
    getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [categories, setCategoriesState] = useState<Category[]>(() =>
    getStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [inventory, setInventoryState] = useState<InventoryItem[]>(() =>
    getStored(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY)
  );
  const [orders, setOrdersState] = useState<Order[]>(() =>
    getStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [customOrders, setCustomOrdersState] = useState<CustomOrder[]>(() =>
    getStored(STORAGE_KEYS.CUSTOM_ORDERS, INITIAL_CUSTOM_ORDERS)
  );
  const [expenses, setExpensesState] = useState<Expense[]>(() =>
    getStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );
  const [cart, setCartState] = useState<CartItem[]>(() =>
    getStored(STORAGE_KEYS.CART, [])
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Clear any existing stored auth so it always asks for the password
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem('db_delicias_auth_v1');
      localStorage.removeItem('db_delicias_admin_auth_v1');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Sync across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        setProductsState(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) {
        setSettingsState(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        setOrdersState(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.CATEGORIES && e.newValue) {
        setCategoriesState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Settings Actions
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  };

  // Products Actions
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    setProductsState((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProductsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  };

  const addProductReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...reviewData,
    };
    setProductsState((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [newReview, ...(p.reviews || [])];
        const avg =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: Number(avg.toFixed(1)),
        };
      })
    );
  };

  // Category Actions
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + Date.now(),
    };
    setCategoriesState((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategoriesState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategoriesState((prev) => prev.filter((c) => c.id !== id));
  };

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedFlavor?: string,
    selectedSize?: string,
    notes?: string
  ) => {
    setCartState((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedFlavor === selectedFlavor &&
          item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        if (notes) next[existingIndex].notes = notes;
        return next;
      }
      return [...prev, { product, quantity, selectedFlavor, selectedSize, notes }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (index: number, quantity: number) => {
    setCartState((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCartState((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartState([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.product.price;
    // If size specifies a price like '... ($15.00)', extract it
    if (item.selectedSize) {
      const match = item.selectedSize.match(/\$(\d+(\.\d+)?)/);
      if (match && match[1]) {
        itemPrice = parseFloat(match[1]);
      }
    }
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders Actions
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>
  ): Promise<Order> => {
    const nextNumber = 1000 + orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `DB-${nextNumber}`,
      createdAt: new Date().toISOString(),
      status: 'PENDIENTE',
    };
    setOrdersState((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrdersState((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrdersState((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Custom Orders Actions
  const createCustomOrder = async (
    data: Omit<CustomOrder, 'id' | 'createdAt' | 'status'>
  ): Promise<CustomOrder> => {
    const newCustom: CustomOrder = {
      ...data,
      id: 'cust-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'SOLICITUD RECIBIDA',
    };
    setCustomOrdersState((prev) => [newCustom, ...prev]);
    return newCustom;
  };

  const updateCustomOrderStatus = (id: string, status: CustomOrderStatus) => {
    setCustomOrdersState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const updateCustomOrder = (id: string, updates: Partial<CustomOrder>) => {
    setCustomOrdersState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomOrder = (id: string) => {
    setCustomOrdersState((prev) => prev.filter((c) => c.id !== id));
  };

  // Inventory Actions
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: 'inv-' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setInventoryState((prev) => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryState((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : inv
      )
    );
  };

  const adjustInventoryStock = (id: string, delta: number) => {
    setInventoryState((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const newQty = Math.max(0, Number((inv.quantity + delta).toFixed(2)));
          return {
            ...inv,
            quantity: newQty,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryState((prev) => prev.filter((inv) => inv.id !== id));
  };

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock);

  // Expenses Actions
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
    };
    setExpensesState((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpensesState((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Auth Actions
  const adminLogin = (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Required credentials: usuario "belgis", contraseña "belgis 2026" (also accepts "belgis2026" and mobile auto-capitals)
    const validUser = cleanUser === 'belgis';
    const validPass =
      cleanPass.toLowerCase() === 'belgis 2026' ||
      cleanPass.toLowerCase() === 'belgis2026' ||
      cleanPass === 'belgis 2026' ||
      cleanPass === 'belgis2026';

    if (validUser && validPass) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  // Utilities
  const resetToDefaults = () => {
    setSettingsState(INITIAL_SETTINGS);
    setProductsState(INITIAL_PRODUCTS);
    setCategoriesState(INITIAL_CATEGORIES);
    setInventoryState(INITIAL_INVENTORY);
    setOrdersState(INITIAL_ORDERS);
    setCustomOrdersState(INITIAL_CUSTOM_ORDERS);
    setExpensesState(INITIAL_EXPENSES);
    setCartState([]);
  };

  const exportDataJSON = () => {
    const payload = {
      settings,
      products,
      categories,
      inventory,
      orders,
      customOrders,
      expenses,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && Array.isArray(data.products)) setProductsState(data.products);
      if (data.settings) setSettingsState(data.settings);
      if (data.categories && Array.isArray(data.categories)) setCategoriesState(data.categories);
      if (data.inventory && Array.isArray(data.inventory)) setInventoryState(data.inventory);
      if (data.orders && Array.isArray(data.orders)) setOrdersState(data.orders);
      if (data.customOrders && Array.isArray(data.customOrders)) setCustomOrdersState(data.customOrders);
      if (data.expenses && Array.isArray(data.expenses)) setExpensesState(data.expenses);
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        customOrders,
        createCustomOrder,
        updateCustomOrderStatus,
        updateCustomOrder,
        deleteCustomOrder,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        adjustInventoryStock,
        deleteInventoryItem,
        lowStockItems,
        expenses,
        addExpense,
        deleteExpense,
        isAdminAuthenticated,
        isAdminLoggedIn: isAdminAuthenticated,
        adminLogin,
        adminLogout,
        resetToDefaults,
        resetAllData: resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
