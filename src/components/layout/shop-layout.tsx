import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';

interface ShopLayoutProps {
  children: React.ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
