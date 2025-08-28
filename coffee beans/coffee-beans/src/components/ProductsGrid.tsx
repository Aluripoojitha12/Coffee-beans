// ---------- ProductsGrid component ----------
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../cart/CartContext";

type Product = {
  id: string;
  name: string;
  image: string;
  priceIndividual: number;
  priceBulk: number;
  blurb?: string;
  rating?: number; // 0..5
};

type Mode = "individual" | "bulk";

const ProductsGrid: React.FC<{ items: Product[] }> = ({ items }) => {
  const navigate = useNavigate();
  const { add } = useCart(); // expects Omit<CartLine,"qty"> & { qty: number }

  const [forms, setForms] = React.useState<
    Record<string, { qty: string; mode: Mode }>
  >(() =>
    Object.fromEntries(items.map((p) => [p.id, { qty: "1", mode: "individual" as Mode }]))
  );

  function setQty(id: string, v: string) {
    const numeric = v.replace(/[^\d]/g, "");
    const val =
      numeric === "" ? "" : String(Math.min(9999, Math.max(1, Number(numeric))));
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], qty: val } }));
  }

  function setMode(id: string, mode: Mode) {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], mode } }));
  }

  function changeQty(id: string, delta: number) {
    setForms((prev) => {
      const current = prev[id]?.qty ?? "1";
      const num = Math.max(1, Math.min(9999, (parseInt(current, 10) || 1) + delta));
      return { ...prev, [id]: { ...prev[id], qty: String(num) } };
    });
  }
  const incQty = (id: string) => changeQty(id, +1);
  const decQty = (id: string) => changeQty(id, -1);

  function addToCart(p: Product) {
    const f = forms[p.id];
    const qtyNum = Number(f.qty);
    if (!qtyNum || qtyNum < 1 || qtyNum > 9999) {
      alert("Quantity must be between 1 and 9999.");
      return;
    }

    add({
      id: p.id,
      name: p.name,
      image: p.image,
      unitPriceIndividual: p.priceIndividual,
      unitPriceBulk: p.priceBulk,
      mode: f.mode,
      qty: qtyNum,
    });

    navigate("/cart");
  }

  return (
    <div className="product-grid">
      {items.map((p) => {
        const f = forms[p.id];
        const unit = f.mode === "bulk" ? p.priceBulk : p.priceIndividual;
        const rating = Math.max(0, Math.min(5, p.rating ?? 5));
        const filled = "★".repeat(rating);
        const empty = "☆".repeat(5 - rating);

        return (
          <article key={p.id} className="product-card">
            <div className="product-image-wrap">
              <img src={p.image} alt={p.name} draggable={false} />
            </div>

            <div className="product-meta">
              <h3 className="product-name">{p.name}</h3>

              {/* Rating */}
              <div className="product-rating" aria-label={`Rating ${rating} out of 5`}>
                <span className="stars stars-filled">{filled}</span>
                <span className="stars stars-empty">{empty}</span>
              </div>

              {p.blurb && <p className="product-blurb">{p.blurb}</p>}

              <div className="product-price">Price: ${unit.toFixed(2)}</div>

              <div className="product-form">
                <div className="mode-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${f.mode === "individual" ? "active" : ""}`}
                    onClick={() => setMode(p.id, "individual")}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${f.mode === "bulk" ? "active" : ""}`}
                    onClick={() => setMode(p.id, "bulk")}
                  >
                    Bulk
                  </button>
                </div>

                <label htmlFor={`qty-${p.id}`} className="qty-label">
                  Qty
                </label>

                {/* - [input] + */}
                <div className="qty-group">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label={`Decrease ${p.name} quantity`}
                    onClick={() => decQty(p.id)}
                  >
                    –
                  </button>

                  <input
                    id={`qty-${p.id}`}
                    className="qty-input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={f.qty}
                    onChange={(e) => setQty(p.id, e.target.value)}
                  />

                  <button
                    type="button"
                    className="qty-btn"
                    aria-label={`Increase ${p.name} quantity`}
                    onClick={() => incQty(p.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addToCart(p)}
                >
                  <ShoppingCart className="add-btn-icon" size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
