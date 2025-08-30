import React, { useMemo, useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../cart/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import heroImg from "../assets/hero3.jpg";
import Header from "./Header";
import Footer from "../components/footer/footer";
import "./products.css";

// Auth session utils
const SESSION_KEY = "auth_session";
function isAuthed() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    return !!s?.userId;
  } catch {
    return false;
  }
}
function stashPendingAdd(payload: any) {
  sessionStorage.setItem("pendingAdd", JSON.stringify(payload));
}
function takePendingAdd() {
  const raw = sessionStorage.getItem("pendingAdd");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    sessionStorage.removeItem("pendingAdd");
    return parsed;
  } catch {
    sessionStorage.removeItem("pendingAdd");
    return null;
  }
}

type TabKey = "new" | "best" | "top";

function buildCollections() {
  const all = PRODUCTS as any[];

  const hasTag = (p: any, ...keys: string[]) => {
    const tags = ((p.badges || p.tags || []) as string[]).map((t) => t.toLowerCase());
    return keys.some((k) => tags.includes(k));
  };

  const newArrivals = all.filter((p) => hasTag(p, "new", "new arrival", "new-arrival"));
  const bestSellers = all.filter((p) => hasTag(p, "best", "bestseller", "best seller"));
  const topRated = all.filter((p) => hasTag(p, "top", "top rated", "top-rated"));

  const fallback = (mod: number) => all.filter((_, i) => i % 3 === mod);

  return {
    all,
    newArrivals: newArrivals.length ? newArrivals : fallback(0),
    bestSellers: bestSellers.length ? bestSellers : fallback(1),
    topRated: topRated.length ? topRated : fallback(2),
  };
}

function exactN<T extends { id: string }>(list: T[], n: number, pool: T[]) {
  if (list.length >= n) return list.slice(0, n);
  const seen = new Set(list.map((x) => x.id));
  const pad: T[] = [];
  for (const p of pool) {
    if (seen.has(p.id)) continue;
    pad.push(p);
    seen.add(p.id);
    if (list.length + pad.length >= n) break;
  }
  return [...list, ...pad].slice(0, n);
}

export default function ProductsPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { add } = useCart();
  const { all, newArrivals, bestSellers, topRated } = useMemo(buildCollections, []);
  const [tab, setTab] = useState<TabKey>("best");

  const nineNew = useMemo(() => exactN(newArrivals, 9, all), [newArrivals, all]);
  const nineBest = useMemo(() => exactN(bestSellers, 9, all), [bestSellers, all]);
  const nineTop = useMemo(() => exactN(topRated, 9, all), [topRated, all]);

  const list = tab === "new" ? nineNew : tab === "best" ? nineBest : nineTop;

  // resume pending add
  useEffect(() => {
    const pending = takePendingAdd();
    if (pending && isAuthed() && pending.source === "products-page") {
      const l = pending.line;
      add({
        id: l.id,
        name: l.name,
        image: l.image,
        unitPriceIndividual: l.unitPriceIndividual,
        unitPriceBulk: l.unitPriceBulk,
        qty: l.qty,
        mode: l.mode,
      });
      nav("/cart");
    }
  }, [add, nav]);

  // guard add-to-cart
  const guardAdd = (line: {
    id: string;
    name: string;
    image: string;
    unitPriceIndividual: number;
    unitPriceBulk: number;
    qty: number;
    mode: "individual" | "bulk";
  }) => {
    if (isAuthed()) {
      add(line);
      nav("/cart");
      return;
    }
    stashPendingAdd({
      line,
      returnTo: loc.pathname + loc.search,
      source: "products-page",
    });
    nav(`/auth?next=${encodeURIComponent(loc.pathname + loc.search)}`);
  };

  return (
    <>
      <Header />

      <div className="pp-header-spacer" aria-hidden />

      <main className="pp-page">
        {/* HERO */}
        <section className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-hero-grid">
              <div className="pp-hero-copy">
                <p className="pp-eyebrow">hand-picked lots</p>
                <h1 className="pp-title">Beans, Blends & Bulk</h1>
                <p className="pp-sub">
                  Explore single-origin highlights and crowd-pleasing blends. Toggle
                  <span className="pp-chip">Individual</span>/<span className="pp-chip">Bulk</span>, set quantity, and add—fast.
                </p>
                <div className="pp-cta">
                  <a
                    href="#pp-catalog"
                    className="pp-btn pp-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("pp-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Browse Catalog
                  </a>
                  <button className="pp-btn pp-btn-ghost" onClick={() => nav("/cart")}>
                    Go to Cart
                  </button>
                </div>
              </div>

              <div className="pp-hero-art">
                <div className="pp-hero-card">
                  <img src={heroImg} alt="Assorted specialty coffee beans" draggable={false} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <header className="pp-head">
          <h2 className="pp-head-title">Our Best Seller</h2>
          <nav className="pp-tabbar" aria-label="Catalog filters">
            <button className={`pp-tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>
              New Arrivals
            </button>
            <button className={`pp-tab ${tab === "best" ? "active" : ""}`} onClick={() => setTab("best")}>
              Best Sellers
            </button>
            <button className={`pp-tab ${tab === "top" ? "active" : ""}`} onClick={() => setTab("top")}>
              Top Rated
            </button>
          </nav>
        </header>

        {/* Catalog */}
        <section id="pp-catalog" className="pp-catalog">
          <div className="pp-grid">
            {list.map((p: any) => {
  // 👇 If tab is "new", mark everything new
  const isNewTagged =
    tab === "new" ||
    ((p.badges || p.tags || []) as string[])
      .map((t) => String(t).toLowerCase())
      .some((t) => t === "new" || t === "new arrival" || t === "new-arrival");

  return (
    <CatalogCard
      key={p.id}
      id={p.id}
      name={p.name}
      image={p.image}
      priceIndividual={p.priceIndividual}
      priceBulk={p.priceBulk}
      blurb={p.blurb}
      isNew={isNewTagged}   // 👈 every product in New Arrivals tab will show NEW ribbon
      onAdd={(qty, mode) => {
        const line = {
          id: p.id,
          name: p.name,
          image: p.image,
          unitPriceIndividual: p.priceIndividual,
          unitPriceBulk: p.priceBulk,
          qty,
          mode,
        };
        guardAdd(line);
      }}
    />
  );
})}

          </div>
        </section>
      </main>

      <div className="pp-footer-override">
        <Footer />
      </div>
    </>
  );
}

/* ===== Card ===== */
function CatalogCard(props: {
  id: string;
  name: string;
  image: string;
  priceIndividual: number;
  priceBulk: number;
  blurb?: string;
  isNew?: boolean;
  onAdd: (qty: number, mode: "individual" | "bulk") => void;
}) {
  const [qty, setQty] = React.useState<number>(1);
  const [mode, setMode] = React.useState<"individual" | "bulk">("individual");
  const unit = mode === "bulk" ? props.priceBulk : props.priceIndividual;

  return (
    <article className="pp-card">
      {props.isNew && <div className="pp-ribbon">NEW</div>}

      <div className="pp-card-media">
        <img src={props.image} alt={props.name} draggable={false} />
      </div>

      <div className="pp-card-pod">
        <button className="pp-qty-btn" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          –
        </button>
        <span className="pp-qty">{qty}</span>
        <button className="pp-qty-btn" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9999, q + 1))}>
          +
        </button>

        <button className="pp-cart-btn" aria-label="Add to Cart" onClick={() => props.onAdd(qty, mode)} title="Add to cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1.994 1.994 0 0 0 10 19h9v-2h-8.42c-.14 0-.25-.11-.25-.25l.03-.12L11.1 14h5.45a2 2 0 0 0 1.8-1.11l3.58-7.16A1 1 0 0 0 21 4H7z" />
          </svg>
        </button>
      </div>

      <div className="pp-card-body">
        <h3 className="pp-card-name">{props.name}</h3>
        {props.blurb && <p className="pp-card-blurb">{props.blurb}</p>}
        <div className="pp-mode">
          <button className={`pp-pill ${mode === "individual" ? "active" : ""}`} onClick={() => setMode("individual")}>
            Individual
          </button>
          <button className={`pp-pill ${mode === "bulk" ? "active" : ""}`} onClick={() => setMode("bulk")}>
            Bulk
          </button>
        </div>
        <div className="pp-price">${unit.toFixed(2)}</div>
      </div>
    </article>
  );
}
