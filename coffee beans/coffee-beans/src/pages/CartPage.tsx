import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";                         // ✅ your header
import Footer from "../components/footer/footer";      // ✅ your footer

import { useCart } from "../cart/CartContext";
import {
  applyCouponApi,
  getDeliveryOptionsApi,
  validateAndPlaceOrder,
} from "../api/cart";
import type { DeliveryOption, CouponDto } from "../api/cart";

import "./cart.css";

type DeliveryMode = "delivery" | "pickup";
type TipPreset = 0 | 2 | 4 | 7;

export default function CartPage() {
  const {
    lines,
    updateQty,
    toggleMode,
    remove,
    clear,
    totals,
    applyCoupon: setActiveCoupon,
    clearCoupon,
  } = useCart();

  // --- UI state (right column) ---
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<null | { ok: boolean; text: string }>(null);

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");
  const [deliveryFee, setDeliveryFee] = useState<number>(7.9);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);

  const [tipPreset, setTipPreset] = useState<TipPreset>(0);
  const [tipCustom, setTipCustom] = useState<string>("");
  const [useCredits, setUseCredits] = useState(false);

  const SERVICE_FEE = 1.5;
  const TAX_RATE = 0.07;

  useEffect(() => {
    getDeliveryOptionsApi()
      .then((opts) => {
        if (opts?.length) {
          setDeliveryOptions(opts);
          setDeliveryFee(opts[0].fee);
        }
      })
      .catch(() => void 0);
  }, []);

  // raw subtotal BEFORE coupon (your old cartTotal)
  const subtotal = totals.subtotal;
  // subtotal AFTER a subtotal-target coupon
  const subtotalAfterCoupon = totals.subtotalAfterCoupon;

  // Tip
  const tipFromPreset = useMemo(() => {
    if (tipPreset === 0) return 0;
    return Math.round((subtotalAfterCoupon * tipPreset) / 100 * 100) / 100;
  }, [subtotalAfterCoupon, tipPreset]);

  const tipFromCustom = useMemo(() => {
    const n = Number(tipCustom);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [tipCustom]);

  const tipAmount = tipCustom ? tipFromCustom : tipFromPreset;

  // Tax: on subtotalAfterCoupon
  const tax = useMemo(
    () => Math.round(subtotalAfterCoupon * TAX_RATE * 100) / 100,
    [subtotalAfterCoupon]
  );

  const creditsValue = useMemo(
    () => (useCredits ? Math.min(8, subtotalAfterCoupon) : 0),
    [useCredits, subtotalAfterCoupon]
  );

  // Shipping coupon (when target === 'shipping')
  const shippingCouponAmount = useMemo(() => {
    const c = totals.activeCoupon;
    if (!c || c.target !== "shipping" || c.discountPercent <= 0) return 0;
    if (deliveryMode !== "delivery") return 0;
    return +((deliveryFee * c.discountPercent) / 100).toFixed(2);
  }, [totals.activeCoupon, deliveryMode, deliveryFee]);

  const deliveryFeeAfterCoupon = useMemo(() => {
    if (deliveryMode !== "delivery") return 0;
    return Math.max(0, +(deliveryFee - shippingCouponAmount).toFixed(2));
  }, [deliveryMode, deliveryFee, shippingCouponAmount]);

  const totalPayable = useMemo(() => {
    return Math.max(
      0,
      +(
        subtotalAfterCoupon +
        deliveryFeeAfterCoupon +
        tipAmount +
        SERVICE_FEE +
        tax -
        creditsValue
      ).toFixed(2)
    );
  }, [subtotalAfterCoupon, deliveryFeeAfterCoupon, tipAmount, SERVICE_FEE, tax, creditsValue]);

  // --- handlers ---
  const handleApplyCoupon = async () => {
    try {
      const dto: CouponDto = await applyCouponApi(couponInput.trim());
      if (!dto.valid) {
        setCouponMsg({ ok: false, text: "Invalid coupon code" });
        clearCoupon();
        return;
      }
      setActiveCoupon({
        code: dto.code,
        description: dto.description,
        discountPercent: dto.discountPercent ?? 0,
        target: dto.target === "shipping" ? "shipping" : "subtotal",
      });
      setCouponMsg({ ok: true, text: `Applied: ${dto.code} — ${dto.description}` });
    } catch {
      setCouponMsg({ ok: false, text: "Could not verify coupon (server down?)" });
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponInput("");
    setCouponMsg(null);
  };

  const checkout = async () => {
    try {
      await validateAndPlaceOrder({
        items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        pricing: {
          subTotal: subtotal,
          subTotalAfterCoupon: subtotalAfterCoupon,
          deliveryMode,
          deliveryFee: deliveryFeeAfterCoupon,
          tip: tipAmount,
          serviceFee: SERVICE_FEE,
          tax,
          credits: creditsValue,
          coupon: totals.activeCoupon,
          total: totalPayable,
        },
        createdAt: new Date().toISOString(),
      });

      alert("Order placed! (demo json-server).");
      clear();
      handleRemoveCoupon();
    } catch (e: any) {
      alert(e?.message || "Checkout failed. Please try again.");
    }
  };

  return (
    <>
      {/* ----- Header ----- */}
      <Header />

      {/* ----- Coffee Hero (title + breadcrumb) ----- */}
      <section className="cart-hero">
        <div className="cart-hero-inner">
          <h1 className="cart-hero-title">Shopping Cart</h1>
          <p className="cart-hero-breadcrumb">
            <Link to="/" className="crumb-link">Home</Link>
            <span>/</span>
            <span>Shopping Cart</span>
          </p>
        </div>
      </section>

      {/* ----- Main cart content ----- */}
      <main className="cart-page">
        <div className="cart-container">
          {/* ---------- Left: Items ---------- */}
          <section className="cart-left">
            <header className="cart-left-head">
              <h1 className="cart-title">
                My Cart <span className="muted">({lines.length})</span>
              </h1>
            </header>

            {lines.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="cart-card">
                <div className="cart-list">
                  {lines.map((l) => {
                    const unit = l.mode === "bulk" ? l.unitPriceBulk : l.unitPriceIndividual;
                    const raw = unit * l.qty;
                    const discount =
                      l.mode === "bulk" ? (raw * totals.discountPercent) / 100 : 0;
                    const lineTotal = totals.lineTotal(l);

                    return (
                      <article className="line" key={l.id}>
                        <div className="line-media">
                          <img src={l.image} alt={l.name} />
                        </div>

                        <div className="line-main">
                          <div className="line-top">
                            <h3 className="line-name">{l.name}</h3>
                            <button className="link remove" onClick={() => remove(l.id)}>
                              Remove
                            </button>
                          </div>

                          <div className="line-meta">
                            <span className="muted">Mode:</span>
                            <div className="mode-toggle">
                              <button
                                className={`mode-btn ${l.mode === "individual" ? "active" : ""}`}
                                onClick={() => toggleMode(l.id, "individual")}
                              >
                                Individual
                              </button>
                              <button
                                className={`mode-btn ${l.mode === "bulk" ? "active" : ""}`}
                                onClick={() => toggleMode(l.id, "bulk")}
                              >
                                Bulk
                              </button>
                            </div>
                          </div>

                          <div className="line-bottom">
                            <div className="price-pack">
                              <span className="unit">${unit.toFixed(2)}</span>
                              {discount > 0 && (
                                <span className="discount">
                                  -{totals.discountPercent}% (${discount.toFixed(2)} OFF)
                                </span>
                              )}
                            </div>

                            <div className="qty-group">
                              <button
                                className="qty-btn"
                                onClick={() => updateQty(l.id, Math.max(1, l.qty - 1))}
                                aria-label="Decrease quantity"
                              >
                                –
                              </button>
                              <input
                                className="qty-input"
                                inputMode="numeric"
                                value={String(l.qty)}
                                onChange={(e) => {
                                  const n = Math.max(
                                    1,
                                    Math.min(
                                      9999,
                                      parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 1
                                    )
                                  );
                                  updateQty(l.id, n);
                                }}
                              />
                              <button
                                className="qty-btn"
                                onClick={() => updateQty(l.id, Math.min(9999, l.qty + 1))}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className="line-total">${lineTotal.toFixed(2)}</div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="cart-left-footer">
                  <button className="btn ghost" onClick={clear}>
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ---------- Right: Sidebar ---------- */}
          <aside className="cart-right">
            {/* Coupons */}
            <section className="panel">
              <h3 className="panel-title">Coupons</h3>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn apply" onClick={handleApplyCoupon}>
                  Apply Now
                </button>
                {totals.activeCoupon && (
                  <button className="btn" onClick={handleRemoveCoupon} style={{ marginLeft: 8 }}>
                    Remove
                  </button>
                )}
              </div>
              {couponMsg && (
                <p className={`coupon-msg ${couponMsg.ok ? "ok" : "err"}`}>{couponMsg.text}</p>
              )}
            </section>

            {/* Your Order */}
            <section className="panel">
              <h3 className="panel-title">Your Order</h3>

              {/* Subtotal rows */}
              <div className="row">
                <span>
                  Subtotal ({lines.length} {lines.length === 1 ? "item" : "items"})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {totals.activeCoupon?.target === "subtotal" &&
                totals.couponAmountOnSubtotal > 0 && (
                  <div className="row">
                    <span>Coupon ({totals.activeCoupon?.code})</span>
                    <span>- ${totals.couponAmountOnSubtotal.toFixed(2)}</span>
                  </div>
                )}

              <div className="row">
                <span>Subtotal after coupon</span>
                <span>${subtotalAfterCoupon.toFixed(2)}</span>
              </div>

              {/* Delivery */}
              <div className="block">
                <div className="row row-head">Delivery</div>

                <label className="choice">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMode === "delivery"}
                    onChange={() => setDeliveryMode("delivery")}
                  />
                  <span>Delivery</span>
                  <span className="spacer" />
                  <span className="muted">${deliveryFee.toFixed(2)}</span>
                </label>

                <label className="choice">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMode === "pickup"}
                    onChange={() => setDeliveryMode("pickup")}
                  />
                  <span>Pick Up</span>
                  <span className="spacer" />
                  <span className="muted">Free</span>
                </label>

                {deliveryMode === "delivery" && (
                  <div className="select-row">
                    <select
                      className="select"
                      value={String(deliveryFee)}
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                    >
                      {(deliveryOptions.length
                        ? deliveryOptions
                        : [
                            { id: "std", label: "Standard — $7.90", fee: 7.9 },
                            { id: "exp", label: "Express — $12.50", fee: 12.5 },
                          ]
                      ).map((opt) => (
                        <option key={opt.id} value={opt.fee}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Shipping coupon row (if any) */}
              {shippingCouponAmount > 0 && (
                <div className="row">
                  <span>Shipping coupon ({totals.activeCoupon?.code})</span>
                  <span>- ${shippingCouponAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="row">
                <span>Delivery after coupon</span>
                <span>${deliveryFeeAfterCoupon.toFixed(2)}</span>
              </div>

              {/* Tip */}
              <div className="block">
                <div className="row row-head">Tip</div>

                <div className="tip-presets">
                  {[0, 2, 4, 7].map((p) => (
                    <button
                      key={p}
                      className={`pill ${tipPreset === p && !tipCustom ? "active" : ""}`}
                      onClick={() => {
                        setTipPreset(p as TipPreset);
                        setTipCustom("");
                      }}
                    >
                      {p === 0 ? "0%" : `${p}%`}
                    </button>
                  ))}
                </div>

                <div className="tip-custom">
                  <span className="muted">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="Custom tip"
                    className="input compact"
                    value={tipCustom}
                    onChange={(e) => setTipCustom(e.target.value)}
                  />
                </div>

                <div className="row">
                  <span>Tip amount</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Fees & tax */}
              <div className="row">
                <span>Service Fee</span>
                <span>${SERVICE_FEE.toFixed(2)}</span>
              </div>

              <div className="row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <label className="choice">
                <input
                  type="checkbox"
                  checked={useCredits}
                  onChange={(e) => setUseCredits(e.target.checked)}
                />
                <span>Use Bean Credits</span>
                <span className="spacer" />
                <span className="muted">-${creditsValue.toFixed(2)}</span>
              </label>

              {/* Total */}
              <div className="total-row">
                <span>Total Payable</span>
                <span className="total">${totalPayable.toFixed(2)}</span>
              </div>

              <button className="btn checkout" onClick={checkout}>
                Proceed to Checkout
              </button>
            </section>
          </aside>
        </div>

        {/* bottom features bar */}
        <div className="cart-features">
          <div className="feat">
            <div className="feat-title">Gift Cards</div>
            <p>Perfect for coffee lovers.</p>
          </div>
          <div className="feat">
            <div className="feat-title">Freshly Roasted</div>
            <p>Small-batch roasts, delivered quickly.</p>
          </div>
          <div className="feat">
            <div className="feat-title">Easy Returns</div>
            <p>No-fuss returns within 7 days.</p>
          </div>
        </div>
      </main>

      {/* ----- Footer ----- */}
      <div className="pp-footer-override">
        <Footer />
      </div>
    </>
  );
}
