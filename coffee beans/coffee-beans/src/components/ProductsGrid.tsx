// ---------- ProductsGrid component ----------
import React from "react";

type Product = {
  id: string;
  name: string;
  image: string;
  priceIndividual: number;
  priceBulk: number;
  blurb?: string;
};

const ProductsGrid: React.FC<{ items: Product[] }> = ({ items }) => {
  const [forms, setForms] = React.useState<
    Record<string, { qty: string; mode: "individual" | "bulk" }>
  >(() =>
    Object.fromEntries(items.map((p) => [p.id, { qty: "1", mode: "individual" }]))
  );

  function setQty(id: string, v: string) {
    const numeric = v.replace(/[^\d]/g, "");
    const val =
      numeric === ""
        ? ""
        : String(Math.min(9999, Math.max(1, Number(numeric))));
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], qty: val } }));
  }

  function setMode(id: string, mode: "individual" | "bulk") {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], mode } }));
  }

  // NEW: increase / decrease helpers
  function changeQty(id: string, delta: number) {
    setForms((prev) => {
      const current = prev[id]?.qty ?? "1";
      const num = Math.max(1, Math.min(9999, (parseInt(current, 10) || 1) + delta));
      return { ...prev, [id]: { ...prev[id], qty: String(num) } };
    });
  }
  function incQty(id: string) { changeQty(id, +1); }
  function decQty(id: string) { changeQty(id, -1); }

  function addToCart(p: Product) {
    const f = forms[p.id];
    const qtyNum = Number(f.qty);
    if (!qtyNum || qtyNum < 1 || qtyNum > 9999) {
      alert("Quantity must be between 1 and 9999.");
      return;
    }

    const unit = f.mode === "bulk" ? p.priceBulk : p.priceIndividual;
    const total = (unit * qtyNum).toFixed(2);

    alert(
      `Added to cart:\n${p.name}\nMode: ${f.mode}\nQty: ${qtyNum}\nUnit: $${unit.toFixed(
        2
      )}\nTotal: $${total}`
    );
  }

  return (
    <div className="product-grid">
      {items.map((p) => {
        const f = forms[p.id];
        const unit = f.mode === "bulk" ? p.priceBulk : p.priceIndividual;
        return (
          <article key={p.id} className="product-card">
            <div className="product-image-wrap">
              <img src={p.image} alt={p.name} draggable={false} />
            </div>
            <div className="product-meta">
              <h3 className="product-name">{p.name}</h3>
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

                {/* NEW: qty group with - [input] + */}
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
                  Add to Cart
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
