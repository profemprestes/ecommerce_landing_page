'use client';

import { useEffect } from 'react';
import {
  buildOrderWhatsAppUrl,
  formatUYU,
  type OrderItem,
  type SizeCode,
} from '@/data/catalog';

interface OrderDrawerProps {
  open: boolean;
  items: readonly OrderItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, size: SizeCode, delta: number) => void;
  onClear: () => void;
}

export function OrderDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onClear,
}: OrderDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const totalUYU = items.reduce(
    (sum, item) => sum + item.product.priceUYU * item.qty,
    0
  );
  const whatsappOrderUrl =
    items.length > 0 ? buildOrderWhatsAppUrl(items) : '#';

  return (
    <>
      <div
        className="drawer-backdrop"
        hidden={!open}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="order-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!open}
      >
        <div className="drawer-header">
          <div>
            <h2 id="drawer-title" className="drawer-title">
              Tu Pedido
            </h2>
            <p className="drawer-sub">
              Confirmación directa por WhatsApp · Stock real
            </p>
          </div>
          <button
            type="button"
            className="icon-close"
            aria-label="Cerrar pedido"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Todavía no agregaste camisetas a tu pedido.</p>
              <a
                href="#catalogo"
                className="btn btn-primary"
                onClick={onClose}
              >
                Ver catálogo
              </a>
            </div>
          ) : (
            <div className="drawer-list">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="drawer-item"
                >
                  <img
                    src={item.product.image}
                    alt={`${item.product.team} ${item.product.kitName}`}
                    className="drawer-thumb"
                  />
                  <div className="drawer-info">
                    <div className="drawer-item-title">
                      {item.product.team} — {item.product.kitName}
                    </div>
                    <div className="drawer-item-meta">
                      {item.product.season} · Talle {item.size} ·{' '}
                      {formatUYU(item.product.priceUYU)}
                    </div>
                    <div className="drawer-qty-row">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Restar unidad"
                        onClick={() =>
                          onUpdateQty(item.product.id, item.size, -1)
                        }
                      >
                        −
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Sumar unidad"
                        onClick={() =>
                          onUpdateQty(item.product.id, item.size, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="drawer-footer">
            <div className="drawer-total-row">
              <span>Total estimado</span>
              <span className="drawer-total">{formatUYU(totalUYU)}</span>
            </div>
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-full"
            >
              Enviar pedido por WhatsApp
            </a>
            <button
              type="button"
              className="btn btn-ghost-sm btn-full"
              onClick={onClear}
            >
              Vaciar pedido
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
