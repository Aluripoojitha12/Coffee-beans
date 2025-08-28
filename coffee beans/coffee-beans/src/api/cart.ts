const BASE = "http://localhost:5176";



/** Types */
export type DeliveryOption = { id: string; label: string; fee: number };
export type CouponDto = {
  valid: boolean;
  code: string;
  description: string;
  discountPercent?: number;
  target?: "subtotal" | "shipping";
};

/** Coupons */
export async function applyCouponApi(code: string): Promise<CouponDto> {
  if (!code) return { valid: false, code, description: "" };
  const res = await fetch(`${BASE}/coupons/${encodeURIComponent(code.toLowerCase())}`);
  if (!res.ok) return { valid: false, code, description: "" };
  const data = await res.json();
  return {
    valid: !!data?.code,
    code: data.code,
    description: data.description,
    discountPercent: data.discountPercent ?? 0,
    target: data.target === "shipping" ? "shipping" : "subtotal",
  };
}

/** Delivery options */
export async function getDeliveryOptionsApi(): Promise<DeliveryOption[]> {
  const r = await fetch(`${BASE}/deliveryOptions`);
  if (!r.ok) return [];
  return r.json();
}

/** Checkout (simple POST) */
export async function postCheckoutApi(payload: any) {
  const r = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("failed");
  return r.json();
}

/** ===== Validation helpers (optional but recommended) ===== */

/** Minimal product shape used for stock checks */
type Product = { id: string | number; name: string; stock?: number };

async function getProduct(id: string | number): Promise<Product | null> {
  const r = await fetch(`${BASE}/products/${id}`);
  if (!r.ok) return null;
  return r.json();
}
async function patchProduct(id: string | number, patch: Partial<Product>) {
  const r = await fetch(`${BASE}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update stock");
  return r.json();
}

/** Validate stock then place order and decrement stock (best effort) */
export async function validateAndPlaceOrder(payload: {
  items: Array<{ id: string; qty: number }>;
  pricing: any;
  createdAt: string;
}) {
  // 1) validate
  for (const it of payload.items) {
    const p = await getProduct(it.id);
    if (!p) continue; // if not in json-server, treat as infinite stock
    const available = typeof p.stock === "number" ? p.stock : 999999;
    if (it.qty > available) {
      throw new Error(`Insufficient stock for "${p.name}" — only ${available} left.`);
    }
  }
  // 2) save order
  const order = await postCheckoutApi(payload);
  // 3) decrement stock
  for (const it of payload.items) {
    try {
      const p = await getProduct(it.id);
      if (p && typeof p.stock === "number") {
        await patchProduct(it.id, { stock: Math.max(0, p.stock - it.qty) });
      }
    } catch {}
  }
  return order;
}
