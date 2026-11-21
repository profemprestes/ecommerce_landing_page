'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from '@/webgl/heroCanvas';
import { initSpecsCanvas } from '@/webgl/specsCanvas';
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
import { SizeGuideSection } from '@/components/SizeGuideSection';
import { StoreFooter } from '@/components/StoreFooter';
import { BagIcon } from '@/components/Icons';

type HeroEditionId = 'uruguay' | 'nacional' | 'retro93';

const HERO_EDITIONS: Record<
  HeroEditionId,
  {
    label: string;
    dot: string;
    team: string;
    kitName: string;
    meta: string;
    priceUYU: number;
    src: string;
    alt: string;
  }
> = {
  uruguay: {
    label: 'Uruguay 2026',
    dot: '#72A6D8',
    team: 'Uruguay Visitante',
    kitName: '2026 Nike Jugador',
    meta: 'Dri-FIT ADV · Talles M / L / XL',
    priceUYU: 3290,
    src: '/camisetas/uruguay-away-2026-nike-jugador.jpeg',
    alt: 'Camiseta Uruguay Visitante 2026 Nike Versión Jugador flat-lay sobre césped',
  },
  nacional: {
    label: 'Nacional 2026',
    dot: '#1B3F8B',
    team: 'Nacional Titular',
    kitName: '2026 Umbro Blanca',
    meta: 'Escudo bordado · Talles S a XXL',
    priceUYU: 2890,
    src: '/camisetas/nacional-home-2026-umbro-blanca.jpeg',
    alt: 'Camiseta Nacional Titular 2026 Umbro blanca flat-lay sobre césped',
  },
  retro93: {
    label: 'Man Utd 93–95',
    dot: '#1E2022',
    team: 'Manchester United',
    kitName: 'Retro 1993–1995 Umbro',
    meta: 'Cuello polo · Colección archivo',
    priceUYU: 3190,
    src: '/camisetas/manchester-united-away-1993-1995-umbro.jpeg',
    alt: 'Camiseta retro Manchester United Visitante 1993-1995 Umbro negra flat-lay',
  },
};

const SHOWCASE_STAGES = [
  {
    src: '/camisetas/uruguay-away-2026-nike-jugador.jpeg',
    alt: 'Camiseta Uruguay Visitante 2026 Nike Versión Jugador',
    title: 'Uruguay Visitante 2026',
    sub: 'Nike Versión Jugador · Tejido Dri-FIT ADV de partido',
  },
  {
    src: '/camisetas/manchester-united-away-1993-1995-umbro.jpeg',
    alt: 'Camiseta retro Manchester United Visitante 1993-1995 Umbro',
    title: 'Manchester United 93–95',
    sub: 'Retro Colección · Cuello polo y calce noventoso',
  },
  {
    src: '/camisetas/nacional-home-2026-umbro-blanca.jpeg',
    alt: 'Camiseta Nacional Titular 2026 Umbro blanca',
    title: 'Nacional Titular 2026',
    sub: 'Umbro Estándar · Escudo bordado y stock inmediato',
  },
  {
    src: '/camisetas/boca-juniors-home-2026-2027-adidas.jpeg',
    alt: 'Camiseta Boca Juniors Titular 2026-2027 Adidas',
    title: 'Boca Juniors 2026/27',
    sub: 'Adidas Fan · Tecnología AEROREADY y envío a todo el país',
  },
];

interface FutbolLandingProps {
  products: readonly Product[];
}

export function FutbolLanding({ products }: FutbolLandingProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [heroEdition, setHeroEdition] = useState<HeroEditionId>('uruguay');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);

  const [category, setCategory] = useState<CategoryId>('todas');
  const [sizeFilter, setSizeFilter] = useState<SizeCode | 'todos'>('todos');
  const [onlyLastUnit, setOnlyLastUnit] = useState<boolean>(false);
  const [bag, setBag] = useState<OrderItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(heroCanvasRef.current);
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 12;
      targetRotX = -ny * 9;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    });

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 110);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

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

  const handleResetFilters = useCallback(() => {
    setCategory('todas');
    setSizeFilter('todos');
    setOnlyLastUnit(false);
  }, []);

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const hasActiveFilters =
    category !== 'todas' || sizeFilter !== 'todos' || onlyLastUnit;
  const activeHero = HERO_EDITIONS[heroEdition];

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a
            href="#hero"
            className="brand-lockup"
            aria-label="Fútbol en la Piel Inicio"
          >
            <img
              src="/logos/futbolenlapiel_horizontal_transparente.png"
              alt="Fútbol en la Piel"
              className="brand-logo"
            />
          </a>

          <nav className="header-nav" aria-label="Navegación principal">
            <a href="#showcase" className="nav-link">
              Colección
            </a>
            <a href="#comparativa" className="nav-link">
              Versiones
            </a>
            <a href="#catalogo" className="nav-link">
              Catálogo
            </a>
            <a href="#talles" className="nav-link">
              Talles
            </a>
            <button
              type="button"
              className="icon-btn theme-toggle"
              id="theme-toggle"
              aria-label="Cambiar tema claro u oscuro"
              title="Cambiar tema"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <svg
                id="theme-icon-sun"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="18" />
                <line x1="128" y1="24" x2="128" y2="44" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="212" x2="128" y2="232" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="24" y1="128" x2="44" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="212" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="54" x2="68" y2="68" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="188" x2="202" y2="202" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="202" x2="68" y2="188" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="68" x2="202" y2="54" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
              </svg>
              <svg
                id="theme-icon-moon"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M210.69 158.18A96.78 96.78 0 0 1 192 160 96.11 96.11 0 0 1 96 64a96.78 96.78 0 0 1 1.82-18.69A96.04 96.04 0 1 0 210.69 158.18Z"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn bag-trigger"
              id="bag-trigger"
              aria-label={`Abrir pedido (${totalQty} prendas)`}
              onClick={() => setDrawerOpen(true)}
            >
              <BagIcon />
              <span className="bag-count" id="bag-count">
                {totalQty}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* SECTION 1: Asymmetric Split Hero */}
        <section id="hero" className="hero">
          <canvas
            ref={heroCanvasRef}
            id="hero-gl-canvas"
            className="hero-canvas"
            aria-hidden="true"
          />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="section-kicker">
                Stock real en Uruguay · Envíos a todo el país
              </div>
              <h1 className="hero-title">Fútbol en la piel.</h1>
              <p className="hero-sub">
                Camisetas retro, de colección y actuales con stock físico en
                Montevideo, medidas verificadas en centímetros y compra directa
                por WhatsApp.
              </p>

              <div className="hero-actions">
                <a href="#catalogo" className="btn btn-primary magnetic-btn">
                  Ver Catálogo ({products.length})
                </a>
                <a href="#showcase" className="btn btn-ghost">
                  Explorar
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="64"
                      y1="64"
                      x2="192"
                      y2="192"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="88 192 192 192 192 88"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hero-stage" ref={heroStageRef} id="hero-stage">
              <div
                className="flask-tilt-wrap"
                ref={tiltWrapRef}
                id="flask-tilt-wrap"
              >
                <div className="hero-jersey-frame">
                  <img
                    src={activeHero.src}
                    alt={activeHero.alt}
                    className="hero-jersey-img"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="hero-jersey-caption">
                    <div>
                      <div className="hero-jersey-name">
                        {activeHero.team} · {activeHero.kitName}
                      </div>
                      <div className="hero-jersey-meta">{activeHero.meta}</div>
                    </div>
                    <span className="hero-jersey-price">
                      {formatUYU(activeHero.priceUYU)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flask-shadow" ref={shadowRef} aria-hidden="true" />

              <div
                className="hero-swatches"
                role="radiogroup"
                aria-label="Seleccionar camiseta destacada"
              >
                {(Object.keys(HERO_EDITIONS) as HeroEditionId[]).map((key) => {
                  const meta = HERO_EDITIONS[key];
                  const isActive = heroEdition === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      className={`swatch-btn${isActive ? ' is-active' : ''}`}
                      aria-checked={isActive}
                      onClick={() => setHeroEdition(key)}
                    >
                      <span
                        className="swatch-dot"
                        style={{ background: meta.dot }}
                      />
                      <span className="swatch-label">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Pinned 4-Stage Environmental Showcase */}
        <section id="showcase" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.src}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                >
                  <img
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="Camisetas destacadas"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`Ver ${stage.title}`}
                    onClick={() => selectStage(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Version Comparison Slider */}
        <section id="comparativa" className="thermal-section">
          <div className="container thermal-grid">
            <div
              className="comparison-wrap"
              ref={compWrapRef}
              id="comparison-wrap"
              onPointerDown={handleCompPointerDown}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerCancel={handleCompPointerUp}
            >
              <div className="comparison-layer comparison-hot">
                <img
                  src="/camisetas/uruguay-away-2026-nike-jugador.jpeg"
                  alt="Camiseta Uruguay Visitante 2026 Nike Versión Jugador"
                  className="comparison-img"
                />
              </div>

              <div
                className="comparison-layer comparison-cold"
                id="comparison-cold"
                style={{
                  clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  transition: splitAnimate
                    ? 'clip-path 380ms var(--ease-out)'
                    : 'none',
                }}
              >
                <img
                  src="/camisetas/manchester-united-away-1993-1995-umbro.jpeg"
                  alt="Camiseta retro Manchester United 1993-1995 Umbro"
                  className="comparison-img"
                />
              </div>

              <div
                className={`comparison-handle${
                  splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
                }`}
                id="comparison-handle"
                role="slider"
                tabIndex={0}
                aria-label="Comparar edición Retro 93-95 y Versión Jugador 2026"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(splitPct)}
                style={{
                  left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                  transition: splitAnimate
                    ? 'left 380ms var(--ease-out)'
                    : 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                  if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
                }}
              >
                <div className="handle-line" />
                <div className="handle-knob">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points="176 144 208 176 176 208"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="48"
                      y1="176"
                      x2="208"
                      y2="176"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="80 112 48 80 80 48"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="208"
                      y1="80"
                      x2="48"
                      y2="80"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="thermal-copy">
              <div className="section-kicker">Curaduría de Tejidos</div>
              <h2 className="section-title">Retro clásico o versión jugador.</h2>
              <p className="section-sub">
                Desde el punto jacquard pesado y cuellos polo de los 90 hasta
                el calce entallado Dri-FIT ADV de cancha. Fotos reales sin
                filtros sobre cada prenda en stock.
              </p>

              <div
                className="segmented-control"
                role="tablist"
                aria-label="Comparar ediciones"
              >
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct >= 98 ? ' is-active' : ''}`}
                  aria-selected={splitPct >= 98}
                  onClick={() => updateSplit(100, true)}
                >
                  Retro 93–95
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct <= 2 ? ' is-active' : ''}`}
                  aria-selected={splitPct <= 2}
                  onClick={() => updateSplit(0, true)}
                >
                  Jugador 2026
                </button>
              </div>

              <div className="thermal-metrics">
                <div className="metric-item">
                  <span className="metric-value">100%</span>
                  <span className="metric-label">Stock físico en Uruguay</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">24h</span>
                  <span className="metric-label">Despacho en Montevideo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Asymmetric 3-Tile Editorial Bento */}
        <section id="detalles" className="bento-section">
          <div className="container">
            <div className="section-header-stack">
              <div className="section-kicker">Archivo &amp; Calidad</div>
              <h2 className="section-title">Cada detalle verificado.</h2>
            </div>

            <div className="bento-grid" ref={bentoGridRef}>
              <article className="bento-tile bento-tall reveal-tile">
                <img
                  src="/camisetas/nacional-golero-2026-umbro-bordo.jpeg"
                  alt="Camiseta Nacional Golero 2026 Umbro bordó flat-lay"
                  className="bento-img"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Nacional Golero Bordó</h3>
                  <p className="bento-sub">
                    Edición 2026 Umbro · Último talle L disponible
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-top reveal-tile">
                <img
                  src="/camisetas/como.jpeg"
                  alt="Camiseta Como 1907 Adidas Serie A azul"
                  className="bento-img"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Como 1907 · Serie A</h3>
                  <p className="bento-sub">
                    Edición Europea Adidas con calce regular
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-bottom reveal-tile">
                <canvas
                  ref={specsCanvasRef}
                  id="specs-gl-canvas"
                  className="specs-canvas"
                  aria-hidden="true"
                />
                <div className="bento-footer bento-footer-specs">
                  <div>
                    <h3 className="bento-title">S a XXL</h3>
                    <p className="bento-sub">Medidas reales en cm</p>
                  </div>
                  <span className="spec-badge">Stock Uruguay</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Catalog */}
        <section id="catalogo" className="catalog-section">
          <div className="container">
            <div className="catalog-top">
              <div>
                <div className="section-kicker">Inventario verificado</div>
                <h2 className="section-title">Catálogo Disponible</h2>
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

        <SizeGuideSection />
      </main>

      <StoreFooter />

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
