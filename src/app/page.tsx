import { PRODUCTS } from '@/data/catalog';
import { CatalogShell } from '@/components/CatalogShell';
import { SizeGuideSection } from '@/components/SizeGuideSection';
import { StoreFooter } from '@/components/StoreFooter';

export default function HomePage() {
  return (
    <main>
      <CatalogShell products={PRODUCTS} />
      <SizeGuideSection />
      <StoreFooter />
    </main>
  );
}
