'use client';

import { useEffect } from 'react';
import {
  buildOrderWhatsAppUrl,
  formatUYU,
  type OrderItem,
  type SizeCode,
} from '@/data/catalog';
import { CloseIcon, WhatsAppIcon } from '@/components/Icons';

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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
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
        id="drawer-backdrop"
        hidden={!open}
        onClick={onClose}
      />
      <aside
        className="bag-drawer"
        id="bag-drawer"
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
            className="icon-btn"
            id="drawer-close"
            aria-label="Cerrar pedido"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="drawer-body" id="drawer-body">
          <div className="drawer-empty" id="drawer-empty" hidden={items.length > 0}>
            <p>Todavía no agregaste camisetas a tu pedido.</p>
            <a
              href="#catalogo"
              className="btn btn-primary btn-sm"
              id="drawer-empty-cta"
              onClick={onClose}
            >
              Ver catálogo
            </a>
          </div>

          <div className="drawer-items" id="drawer-items" hidden={items.length === 0}>
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="bag-item"
              >
                <img
                  src={item.product.image}
                  alt={`${item.product.team} ${item.product.kitName}`}
                  className="bag-item-thumb"
                />
                <div className="bag-item-info">
                  <div className="bag-item-name">
                    {item.product.team} — {item.product.kitName}
                  </div>
                  <div className="bag-item-meta">
                    {item.product.season} · Talle {item.size} ·{' '}
                    {formatUYU(item.product.priceUYU)}
                  </div>
                  <div className="bag-qty-row">
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
                    <span className="bag-qty">{item.qty}</span>
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
        </div>

        <div className="drawer-footer" id="drawer-footer" hidden={items.length === 0}>
          <div className="drawer-total-row">
            <span>Total estimado</span>
            <span className="drawer-total" id="drawer-total">
              {formatUYU(totalUYU)}
            </span>
          </div>
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-full"
          >
            <WhatsAppIcon />
            <span>Enviar pedido por WhatsApp</span>
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-full"
            onClick={onClear}
          >
            Vaciar pedido
          </button>
        </div>
      </aside>
    </>
  );
}
