import { PRODUCTS } from '@/data/catalog';
import { FutbolLanding } from '@/components/FutbolLanding';

export default function HomePage() {
  return <FutbolLanding products={PRODUCTS} />;
}
