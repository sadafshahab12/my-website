"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../types";
import { CartItem, SaleProduct } from "../types/saleType";
import toast from "react-hot-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | SaleProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  isCartLoaded: boolean;
}

const showStockError = (message: string) => {
  toast.error(message, {
    duration: 3000,
    style: {
      border: "1px solid #D4AF37",
      padding: "16px",
      color: "#1a1a1a",
      background: "#fff",
      borderRadius: "0px",
      fontSize: "14px",
      fontFamily: "serif",
    },
    iconTheme: {
      primary: "#D4AF37",
      secondary: "#fff",
    },
  });
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);


  useEffect(() => {
    const saveToCart = () => {
      const savedCart = localStorage.getItem("pearion_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
      setIsCartLoaded(true);
    };
    saveToCart();
  }, []);


  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("pearion_cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  
  const addToCart = (product: Product | SaleProduct, quantity: number = 1) => {
    const existing = cart.find((item) => item._id === product._id);
    const stockAvailable = (product as SaleProduct).stockQuantity ?? 999;
    const currentInCart = existing ? existing.quantity : 0;


    if (currentInCart + quantity > stockAvailable) {
      toast.dismiss();
      showStockError(`Limited Stock: Only ${stockAvailable} pieces left.`);
      return;
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      const newItem: CartItem = {
        ...product,
        _type: product._type as "product" | "sale",
        quantity: quantity,
        images: Array.isArray(product.images)
          ? product.images
          : [product.images],
        stockQuantity:
          "stockQuantity" in product ? product.stockQuantity : undefined,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {

    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }


    const targetItem = cart.find((item) => item._id === productId);
    if (!targetItem) return;

    const limit = targetItem.stockQuantity ?? 999;

    // Stock check
    if (quantity > limit) {
      toast.dismiss(); 
      showStockError(
        `We apologize, but only ${limit} pieces of this item are currently available in our collection.`,
      );
      return; 
    }

   
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );
  };
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCart([]);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const cartTotal = cart.reduce((total, item) => {

    const activePrice =
      item.discountPrice && item.discountPrice > 0
        ? item.discountPrice
        : item.originalPrice;

    return total + activePrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        toggleCart,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
