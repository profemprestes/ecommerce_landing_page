'use client';

import { memo, useMemo, useState } from 'react';
import {
  ALL_SIZES,
  buildSingleWhatsAppUrl,
  formatUYU,
  SIZE_MEASUREMENTS_CM,
  type Product,
  type SizeCode,
} from '@/data/catalog';
import { BagIcon, WhatsAppIcon } from '@/components/Icons';

interface ProductCardProps {
  product: Product;
  activeSizeFilter: SizeCode | 'todos';
  priority?: boolean;
  onAddToOrder: (product: Product, size: SizeCode) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  activeSizeFilter,
  priority = false,
  onAddToOrder,
}: ProductCardProps) {
  const availableSet = useMemo(
    () => new Set<SizeCode>(product.availableSizes),
    [product.availableSizes]
  );

  const [manualSize, setManualSize] = useState<SizeCode>(
    product.availableSizes[0] ?? 'M'
  );

  const selectedSize: SizeCode =
    activeSizeFilter !== 'todos' && availableSet.has(activeSizeFilter)
      ? activeSizeFilter
      : availableSet.has(manualSize)
        ? manualSize
        : (product.availableSizes[0] ?? 'M');

  const measurements = SIZE_MEASUREMENTS_CM[selectedSize];
  const whatsappHref = buildSingleWhatsAppUrl(product, selectedSize);

  return (
    <article className="product-card" data-sku={product.sku}>
      <div className="product-media">
        <img
          src={product.image}
          alt={product.imageAlt}
          className="product-img"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
        <div className="product-badges">
          <span
            className={`badge ${
              product.badgeTone === 'retro' ? 'badge-retro' : 'badge-primary'
            }`}
          >
            {product.badge}
          </span>
          {product.lastUnit ? (
            <span className="badge badge-alert">Último talle</span>
          ) : null}
        </div>
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span>
            {product.brand} · {product.season}
          </span>
          <span className="product-sku">{product.sku}</span>
        </div>

        <h3 className="product-title">
          {product.team} — {product.kitName}
        </h3>
        <p className="product-version">{product.version}</p>

        <div className="product-price-row">
          <span className="product-price">{formatUYU(product.priceUYU)}</span>
          <span className="product-fit">{product.fitNote}</span>
        </div>

        <div className="size-block">
          <div className="size-header">
            <span className="size-label">Talles disponibles</span>
            <span className="size-cm">
              {selectedSize}: {measurements.width} × {measurements.length} cm
            </span>
          </div>

          <div
            className="size-grid"
            role="radiogroup"
            aria-label={`Seleccionar talle para ${product.team} ${product.kitName}`}
          >
            {ALL_SIZES.map((size) => {
              const inStock = availableSet.has(size);
              const isSelected = inStock && selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={!inStock}
                  onClick={() => setManualSize(size)}
                  className={`size-pill${isSelected ? ' is-selected' : ''}${
                    !inStock ? ' is-out' : ''
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-actions">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-wa"
          >
            <WhatsAppIcon />
            <span>Pedir por WhatsApp</span>
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-add"
            onClick={() => onAddToOrder(product, selectedSize)}
            aria-label={`Agregar ${product.team} talle ${selectedSize} al pedido`}
          >
            <BagIcon />
            <span>+ Pedido</span>
          </button>
        </div>
      </div>
    </article>
  );
});
