import React, { createContext, useContext, useMemo } from "react";
import { BULK_DISCOUNT_PERCENT } from "./config";

export type Mode = "individual" | "bulk";

export type CartLine = {
  id: string;
  name: string;
  image: string;
  unitPriceIndividual: number;
  unitPriceBulk: number;
  qty: number;
  mode: Mode;
};

/** NEW: coupon model kept intentionally small */
export type ActiveCoupon = {
  code: string;
  description: string;
  discountPercent: number; // 0..100
  target: "subtotal" | "shipping"; // where to apply
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty"> & { qty: number }) => void;
  updateQty: (id: string, qty: number) => void;
  toggleMode: (id: string, mode: Mode) => void;
  remove: (id: string) => void;
  clear: () => void;

  /** NEW: coupon actions */
  applyCoupon: (coupon: ActiveCoupon) => void;
  clearCoupon: () => void;

  totals: {
    discountPercent: number; // your existing BULK label
    lineTotal: (l: CartLine) => number;

    /** kept for backward compat (this is sum of lineTotal, before any coupon) */
    cartTotal: number;

    /** NEW: raw subtotal == cartTotal (before coupon) */
    subtotal: number;

    /** NEW: coupon amount if it targets subtotal (0 otherwise) */
    couponAmountOnSubtotal: number;

    /** NEW: subtotal after coupon on subtotal */
    subtotalAfterCoupon: number;

    /** NEW: current coupon (or null) */
    activeCoupon: ActiveCoupon | null;
  };
};

const Ctx = createContext<CartState | null>(null);
export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [activeCoupon, setActiveCoupon] = React.useState<ActiveCoupon | null>(null);

  const add: CartState["add"] = (line) => {
    setLines((prev) => {
      const i = prev.findIndex((x) => x.id === line.id && x.mode === line.mode);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(9999, next[i].qty + line.qty) };
        return next;
      }
      return [...prev, { ...line }];
    });
  };

  const updateQty: CartState["updateQty"] = (id, qty) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, Math.min(9999, qty)) } : l))
    );
  };

  const toggleMode: CartState["toggleMode"] = (id, mode) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, mode } : l)));
  };

  const remove: CartState["remove"] = (id) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);

  /** NEW: coupon handlers */
  const applyCoupon = (coupon: ActiveCoupon) => setActiveCoupon(coupon);
  const clearCoupon = () => setActiveCoupon(null);

  const totals = useMemo(() => {
    const discountPercent = BULK_DISCOUNT_PERCENT;

    const lineTotal = (l: CartLine) => {
      const unit = l.mode === "bulk" ? l.unitPriceBulk : l.unitPriceIndividual;
      const raw = unit * l.qty;
      const discount = l.mode === "bulk" ? raw * (discountPercent / 100) : 0;
      return Math.round((raw - discount) * 100) / 100; // 2 decimals
    };

    /** before any coupon (sum of lineTotal) */
    const subtotal = Math.round(lines.reduce((s, l) => s + lineTotal(l), 0) * 100) / 100;

    /** coupon on subtotal (only when target=subtotal) */
    const couponAmountOnSubtotal =
      activeCoupon && activeCoupon.target === "subtotal" && activeCoupon.discountPercent > 0
        ? Math.round(subtotal * (activeCoupon.discountPercent / 100) * 100) / 100
        : 0;

    const subtotalAfterCoupon = Math.max(
      0,
      Math.round((subtotal - couponAmountOnSubtotal) * 100) / 100
    );

    return {
      discountPercent,
      lineTotal,
      cartTotal: subtotal, // kept for compatibility
      subtotal,
      couponAmountOnSubtotal,
      subtotalAfterCoupon,
      activeCoupon,
    };
  }, [lines, activeCoupon]);

  const value: CartState = {
    lines,
    add,
    updateQty,
    toggleMode,
    remove,
    clear,
    applyCoupon,
    clearCoupon,
    totals,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
