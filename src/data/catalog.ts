export type SizeCode = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type CategoryId = 'todas' | 'uruguay' | 'retro' | 'internacionales';

export type BadgeTone = 'primary' | 'retro';

export interface Product {
  id: string;
  sku: string;
  team: string;
  kitName: string;
  season: string;
  brand: string;
  version: string;
  category: Exclude<CategoryId, 'todas'>;
  badge: string;
  badgeTone: BadgeTone;
  priceUYU: number;
  image: string;
  imageAlt: string;
  availableSizes: readonly SizeCode[];
  lastUnit?: boolean;
  fitNote: string;
}

export const ALL_SIZES: readonly SizeCode[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const CATEGORY_TABS: readonly { id: CategoryId; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'uruguay', label: 'Uruguay & Clubes' },
  { id: 'retro', label: 'Retro & Colección' },
  { id: 'internacionales', label: 'Internacionales' },
];

export const SIZE_MEASUREMENTS_CM: Record<
  SizeCode,
  { width: number; length: number }
> = {
  S: { width: 49, length: 69 },
  M: { width: 52, length: 72 },
  L: { width: 55, length: 74 },
  XL: { width: 58, length: 77 },
  XXL: { width: 61, length: 79 },
};

export const WHATSAPP_NUMBER = '59899000000';

export const PRODUCTS: readonly Product[] = [
  {
    id: 'uruguay-away-2026-jugador',
    sku: 'FEP-URU-26A',
    team: 'Uruguay',
    kitName: 'Visitante Blanca',
    season: '2026',
    brand: 'Nike',
    version: 'Versión Jugador · Dri-FIT ADV',
    category: 'uruguay',
    badge: 'Versión Jugador',
    badgeTone: 'primary',
    priceUYU: 3290,
    image: '/camisetas/uruguay-away-2026-nike-jugador.jpeg',
    imageAlt:
      'Camiseta Uruguay Visitante 2026 Nike Versión Jugador flat-lay sobre césped',
    availableSizes: ['M', 'L', 'XL'],
    fitNote: 'Corte entallado de jugador',
  },
  {
    id: 'nacional-home-2026-umbro',
    sku: 'FEP-NAC-26H',
    team: 'Nacional',
    kitName: 'Titular Blanca',
    season: '2026',
    brand: 'Umbro',
    version: 'Estándar · Escudo bordado',
    category: 'uruguay',
    badge: '2026',
    badgeTone: 'primary',
    priceUYU: 2890,
    image: '/camisetas/nacional-home-2026-umbro-blanca.jpeg',
    imageAlt:
      'Camiseta Nacional Titular 2026 Umbro blanca flat-lay sobre césped',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fitNote: 'Calce clásico',
  },
  {
    id: 'nacional-golero-2026-bordo',
    sku: 'FEP-NAC-26G',
    team: 'Nacional',
    kitName: 'Golero Bordó',
    season: '2026',
    brand: 'Umbro',
    version: 'Golero · Manga corta',
    category: 'uruguay',
    badge: 'Golero',
    badgeTone: 'primary',
    priceUYU: 2790,
    image: '/camisetas/nacional-golero-2026-umbro-bordo.jpeg',
    imageAlt:
      'Camiseta Nacional Golero 2026 Umbro bordó flat-lay sobre césped',
    availableSizes: ['L'],
    lastUnit: true,
    fitNote: 'Calce clásico',
  },
  {
    id: 'man-utd-away-1993-1995-umbro',
    sku: 'FEP-MUN-93A',
    team: 'Manchester United',
    kitName: 'Visitante Negra',
    season: '1993–1995',
    brand: 'Umbro',
    version: 'Retro Colección · Cuello polo',
    category: 'retro',
    badge: 'Retro 93–95',
    badgeTone: 'retro',
    priceUYU: 3190,
    image: '/camisetas/manchester-united-away-1993-1995-umbro.jpeg',
    imageAlt:
      'Camiseta retro Manchester United Visitante 1993-1995 Umbro negra flat-lay',
    availableSizes: ['M', 'L', 'XL'],
    fitNote: 'Calce amplio noventoso',
  },
  {
    id: 'man-utd-coleccion',
    sku: 'FEP-MUN-COL',
    team: 'Manchester United',
    kitName: 'Edición Colección',
    season: 'Archivo',
    brand: 'Colección',
    version: 'Retro Colección · Tejido pesado',
    category: 'retro',
    badge: 'Colección',
    badgeTone: 'retro',
    priceUYU: 3090,
    image: '/camisetas/manchest3er_united.jpeg',
    imageAlt:
      'Camiseta Manchester United edición colección flat-lay sobre césped',
    availableSizes: ['M', 'XL'],
    lastUnit: true,
    fitNote: 'Calce clásico',
  },
  {
    id: 'boca-home-2026-2027-adidas',
    sku: 'FEP-BOC-26H',
    team: 'Boca Juniors',
    kitName: 'Titular Azul y Oro',
    season: '2026/27',
    brand: 'Adidas',
    version: 'Fan · AEROREADY',
    category: 'internacionales',
    badge: '2026/27',
    badgeTone: 'primary',
    priceUYU: 2790,
    image: '/camisetas/boca-juniors-home-2026-2027-adidas.jpeg',
    imageAlt:
      'Camiseta Boca Juniors Titular 2026-2027 Adidas flat-lay sobre césped',
    availableSizes: ['S', 'M', 'L', 'XL'],
    fitNote: 'Calce regular',
  },
  {
    id: 'como-1907-adidas',
    sku: 'FEP-COM-25H',
    team: 'Como 1907',
    kitName: 'Serie A Azul',
    season: '2025/26',
    brand: 'Adidas',
    version: 'Fan · Edición Europea',
    category: 'internacionales',
    badge: 'Colección',
    badgeTone: 'retro',
    priceUYU: 2890,
    image: '/camisetas/como.jpeg',
    imageAlt: 'Camiseta Como 1907 Adidas azul flat-lay sobre césped',
    availableSizes: ['M', 'L'],
    fitNote: 'Calce regular',
  },
  {
    id: 'noruega-nike',
    sku: 'FEP-NOR-25H',
    team: 'Noruega',
    kitName: 'Titular Roja',
    season: '2025/26',
    brand: 'Nike',
    version: 'Fan · Dri-FIT',
    category: 'internacionales',
    badge: 'Selección',
    badgeTone: 'primary',
    priceUYU: 2690,
    image: '/camisetas/noruega.jpeg',
    imageAlt: 'Camiseta selección Noruega Nike roja flat-lay sobre césped',
    availableSizes: ['S', 'M', 'L', 'XL'],
    fitNote: 'Calce regular',
  },
];

export function formatUYU(amount: number): string {
  return `$U ${amount.toLocaleString('es-UY')}`;
}

export function buildSingleWhatsAppUrl(product: Product, size: SizeCode): string {
  const message = [
    'Hola Fútbol en la Piel! Quiero consultar disponibilidad y comprar:',
    `• ${product.team} — ${product.kitName} (${product.season})`,
    `• Marca/Versión: ${product.brand} · ${product.version}`,
    `• Talle: ${size}`,
    `• Código: ${product.sku}`,
    `• Precio: ${formatUYU(product.priceUYU)}`,
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface OrderItem {
  product: Product;
  size: SizeCode;
  qty: number;
}

export function buildOrderWhatsAppUrl(items: readonly OrderItem[]): string {
  let total = 0;
  const lines = items.map((item) => {
    const subtotal = item.product.priceUYU * item.qty;
    total += subtotal;
    return `• ${item.qty}x ${item.product.team} ${item.product.kitName} (${item.product.season}) — Talle ${item.size} [${item.product.sku}] — ${formatUYU(subtotal)}`;
  });

  const message = [
    'Hola Fútbol en la Piel! Quiero confirmar este pedido:',
    ...lines,
    '',
    `Total estimado: ${formatUYU(total)}`,
    '¿Coordinamos el envío?',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
