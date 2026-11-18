'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ALL_SIZES,
  CATEGORY_TABS,
  formatUYU,
  type CategoryId,
  type OrderItem,
  type Product,
  type SizeCode,
} from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import { OrderDrawer } from '@/components/OrderDrawer';
import { BagIcon } from '@/components/Icons';

interface CatalogShellProps {
  products: readonly Product[];
}

export function CatalogShell({ products }: CatalogShellProps) {
  const [category, setCategory] = useState<CategoryId>('todas');
  const [sizeFilter, setSizeFilter] = useState<SizeCode | 'todos'>('todos');
  const [onlyLastUnit, setOnlyLastUnit] = useState<boolean>(false);
  const [bag, setBag] = useState<OrderItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (category !== 'todas' && product.category !== category) return false;
      if (onlyLastUnit && !product.lastUnit) return false;
      if (
        sizeFilter !== 'todos' &&
        !product.availableSizes.includes(sizeFilter)
      ) {
        return false;
      }
      return true;
    });
  }, [products, category, sizeFilter, onlyLastUnit]);

  const handleAddToOrder = useCallback((product: Product, size: SizeCode) => {
    setBag((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product, size, qty: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const handleUpdateQty = useCallback(
    (productId: string, size: SizeCode, delta: number) => {
      setBag((prev) => {
        const idx = prev.findIndex(
          (item) => item.product.id === productId && item.size === size
        );
        if (idx < 0) return prev;
        const nextQty = prev[idx].qty + delta;
        if (nextQty <= 0) {
          return prev.filter((_, i) => i !== idx);
        }
        const next = [...prev];
        next[idx] = { ...next[idx], qty: nextQty };
        return next;
      });
    },
    []
  );

  const handleClearBag = useCallback(() => {
    setBag([]);
  }, []);

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const featured = products[0];
  const hasActiveFilters =
    category !== 'todas' || sizeFilter !== 'todos' || onlyLastUnit;

  const handleResetFilters = useCallback(() => {
    setCategory('todas');
    setSizeFilter('todos');
    setOnlyLastUnit(false);
  }, []);

  return (
    <>
      <header className="store-header">
        <div className="container header-inner">
          <a href="#top" className="brand-link" aria-label="Fútbol en la Piel">
            <img
              src="/logos/futbolenlapiel_horizontal_transparente.png"
              alt="Fútbol en la Piel"
              className="brand-logo"
            />
          </a>

          <nav className="header-nav" aria-label="Navegación principal">
            <a href="#catalogo" className="nav-link">
              Catálogo
            </a>
            <a href="#talles" className="nav-link">
              Talles
            </a>
            <a href="#envios" className="nav-link">
              Envíos
            </a>
            <button
              type="button"
              className="bag-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Abrir pedido (${totalQty} prendas)`}
            >
              <BagIcon className="bag-icon" />
              <span>Pedido</span>
              <span className="bag-badge">{totalQty}</span>
            </button>
          </nav>
        </div>
      </header>

      <section id="top" className="hero-band">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              Stock real en Uruguay · Envíos a todo el país
            </div>
            <h1 className="hero-title">
              Camisetas retro, de colección y actuales.
            </h1>
            <p className="hero-sub">
              Prendas verificadas con medidas exactas en centímetros, fotos
              reales sin filtros y compra directa por WhatsApp.
            </p>
            <div className="hero-actions">
              <a href="#catalogo" className="btn btn-primary">
                Ver stock disponible ({products.length})
              </a>
              <button
                type="button"
                className="btn btn-retro"
                onClick={() => {
                  setCategory('retro');
                  setSizeFilter('todos');
                  setOnlyLastUnit(false);
                  document
                    .getElementById('catalogo')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Retro &amp; Colección
              </button>
            </div>
          </div>

          {featured ? (
            <div className="hero-feature">
              <div className="hero-feature-media">
                <img
                  src={featured.image}
                  alt={featured.imageAlt}
                  className="hero-feature-img"
                  loading="eager"
                  fetchPriority="high"
                />
                <span className="badge badge-primary hero-feature-badge">
                  {featured.badge}
                </span>
              </div>
              <div className="hero-feature-bar">
                <div className="hero-feature-info">
                  <div className="hero-feature-name">
                    {featured.team} {featured.kitName} ({featured.season})
                  </div>
                  <div className="hero-feature-meta">
                    {featured.brand} · Talles {featured.availableSizes.join(' / ')}
                  </div>
                </div>
                <span className="hero-feature-price">
                  {formatUYU(featured.priceUYU)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="catalogo" className="catalog-section">
        <div className="container">
          <div className="catalog-top">
            <div>
              <div className="section-kicker">Inventario verificado</div>
              <h2 className="section-heading">Catálogo Disponible</h2>
            </div>
            <div className="catalog-count-row">
              <div className="catalog-count">
                Mostrando <strong>{filteredProducts.length}</strong> de{' '}
                {products.length} prendas
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  className="filter-reset-btn"
                  onClick={handleResetFilters}
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          </div>

          <div className="filter-bar" aria-label="Filtros de catálogo">
            <div className="filter-tabs" role="tablist" aria-label="Categorías">
              {CATEGORY_TABS.map((tab) => {
                const isActive = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategory(tab.id)}
                    className={`filter-tab${isActive ? ' is-active' : ''}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="filter-right">
              <div className="size-filter-group" aria-label="Filtrar por talle">
                <span className="filter-label">Talle:</span>
                <button
                  type="button"
                  onClick={() => setSizeFilter('todos')}
                  className={`size-filter-pill${
                    sizeFilter === 'todos' ? ' is-active' : ''
                  }`}
                >
                  Todos
                </button>
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeFilter(s)}
                    className={`size-filter-pill${
                      sizeFilter === s ? ' is-active' : ''
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-pressed={onlyLastUnit}
                onClick={() => setOnlyLastUnit((prev) => !prev)}
                className={`alert-filter-btn${onlyLastUnit ? ' is-active' : ''}`}
              >
                Último talle
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No hay camisetas con esa combinación de filtros.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  activeSizeFilter={sizeFilter}
                  priority={index < 4}
                  onAddToOrder={handleAddToOrder}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <OrderDrawer
        open={drawerOpen}
        items={bag}
        onClose={() => setDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onClear={handleClearBag}
      />
    </>
  );
}
