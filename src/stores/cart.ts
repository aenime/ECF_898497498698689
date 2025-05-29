import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types';

interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y_free';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  buyQuantity?: number; // For "Buy X Get Y Free" offers
  getQuantity?: number;
}

interface CartStore extends Cart {
  // Additional state
  selectedItems: CartItem[];
  promoCode?: PromoCode;
  promoDiscount: number;
  
  // Actions
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemKey: (productId: string, size?: string, color?: string) => string;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  toggleItemSelection: (productId: string, size?: string, color?: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
}

const calculateTotals = (items: CartItem[], promoCode?: PromoCode) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let promoDiscount = 0;
  
  // Calculate promo discount
  if (promoCode && promoCode.isActive) {
    if (promoCode.type === 'percentage') {
      promoDiscount = subtotal * (promoCode.value / 100);
      if (promoCode.maxDiscount) {
        promoDiscount = Math.min(promoDiscount, promoCode.maxDiscount);
      }
    } else if (promoCode.type === 'fixed') {
      promoDiscount = promoCode.value;
    } else if (promoCode.type === 'buy_x_get_y_free') {
      // "Buy 2 Get 1 Free" logic from legacy code
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const groupSize = (promoCode.buyQuantity || 2) + (promoCode.getQuantity || 1);
      const freeItems = Math.floor(totalQuantity / groupSize) * (promoCode.getQuantity || 1);
      
      // Sort items by price (descending) to give discount on cheapest items
      const sortedItems = [...items].sort((a, b) => b.price - a.price);
      let remainingFreeItems = freeItems;
      
      for (const item of sortedItems) {
        if (remainingFreeItems <= 0) break;
        const itemsToDiscount = Math.min(remainingFreeItems, item.quantity);
        promoDiscount += item.price * itemsToDiscount;
        remainingFreeItems -= itemsToDiscount;
      }
    }
  }
  
  const tax = (subtotal - promoDiscount) * 0.18; // 18% GST on discounted amount
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const total = subtotal + tax + shipping - promoDiscount;

  return { subtotal, tax, shipping, discount: promoDiscount, total, promoDiscount };
};

// Mock promo codes - in real app, these would come from API
const PROMO_CODES: Record<string, PromoCode> = {
  'SAVE10': {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    maxDiscount: 500,
    isActive: true,
  },
  'FLAT100': {
    code: 'FLAT100',
    type: 'fixed',
    value: 100,
    minAmount: 1000,
    isActive: true,
  },
  'BUY2GET1': {
    code: 'BUY2GET1',
    type: 'buy_x_get_y_free',
    value: 0,
    buyQuantity: 2,
    getQuantity: 1,
    isActive: true,
  },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      promoCode: undefined,
      promoDiscount: 0,

      getItemKey: (productId: string, size?: string, color?: string) => {
        return `${productId}-${size || ''}-${color || ''}`;
      },

      addItem: (product: Product, quantity = 1, size?: string, color?: string) => {
        set((state) => {
          const itemKey = state.getItemKey(product._id, size, color);
          const existingItemIndex = state.items.findIndex(
            (item) => state.getItemKey(item.productId, item.size, item.color) === itemKey
          );

          let newItems: CartItem[];

          if (existingItemIndex >= 0) {
            // Update existing item
            newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
          } else {
            // Add new item
            const newItem: CartItem = {
              productId: product._id,
              product,
              quantity,
              size,
              color,
              price: product.originalPrice || product.price,
            };
            newItems = [...state.items, newItem];
          }

          const totals = calculateTotals(newItems, state.promoCode);

          return {
            ...state,
            items: newItems,
            ...totals,
          };
        });
      },

      removeItem: (productId: string, size?: string, color?: string) => {
        set((state) => {
          const itemKey = state.getItemKey(productId, size, color);
          const newItems = state.items.filter(
            (item) => state.getItemKey(item.productId, item.size, item.color) !== itemKey
          );

          // Remove from selected items too
          const newSelectedItems = state.selectedItems.filter(
            (item) => state.getItemKey(item.productId, item.size, item.color) !== itemKey
          );

          const totals = calculateTotals(newItems, state.promoCode);

          return {
            ...state,
            items: newItems,
            selectedItems: newSelectedItems,
            ...totals,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => {
          const itemKey = state.getItemKey(productId, size, color);
          const newItems = state.items.map((item) => {
            if (state.getItemKey(item.productId, item.size, item.color) === itemKey) {
              return { ...item, quantity };
            }
            return item;
          });

          // Update selected items too
          const newSelectedItems = state.selectedItems.map((item) => {
            if (state.getItemKey(item.productId, item.size, item.color) === itemKey) {
              return { ...item, quantity };
            }
            return item;
          });

          const totals = calculateTotals(newItems, state.promoCode);

          return {
            ...state,
            items: newItems,
            selectedItems: newSelectedItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          selectedItems: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          promoCode: undefined,
          promoDiscount: 0,
        });
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().subtotal;
      },

      getTotalItems: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyPromoCode: async (code: string) => {
        // Mock API call - in real app, validate with backend
        const promoCode = PROMO_CODES[code.toUpperCase()];
        
        if (!promoCode || !promoCode.isActive) {
          return false;
        }

        const currentState = get();
        if (promoCode.minAmount && currentState.subtotal < promoCode.minAmount) {
          return false;
        }

        set((state) => {
          const totals = calculateTotals(state.items, promoCode);
          return {
            ...state,
            promoCode,
            ...totals,
          };
        });

        return true;
      },

      removePromoCode: () => {
        set((state) => {
          const totals = calculateTotals(state.items);
          return {
            ...state,
            promoCode: undefined,
            ...totals,
          };
        });
      },

      toggleItemSelection: (productId: string, size?: string, color?: string) => {
        set((state) => {
          const itemKey = state.getItemKey(productId, size, color);
          const item = state.items.find(
            (item) => state.getItemKey(item.productId, item.size, item.color) === itemKey
          );

          if (!item) return state;

          const isSelected = state.selectedItems.some(
            (selectedItem) => state.getItemKey(selectedItem.productId, selectedItem.size, selectedItem.color) === itemKey
          );

          let newSelectedItems: CartItem[];
          if (isSelected) {
            newSelectedItems = state.selectedItems.filter(
              (selectedItem) => state.getItemKey(selectedItem.productId, selectedItem.size, selectedItem.color) !== itemKey
            );
          } else {
            newSelectedItems = [...state.selectedItems, item];
          }

          return {
            ...state,
            selectedItems: newSelectedItems,
          };
        });
      },

      selectAllItems: () => {
        set((state) => ({
          ...state,
          selectedItems: [...state.items],
        }));
      },

      deselectAllItems: () => {
        set((state) => ({
          ...state,
          selectedItems: [],
        }));
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
