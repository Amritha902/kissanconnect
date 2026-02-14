
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/farmer/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FarmerProductsPage() {
  const activeProducts = mockProducts.filter(p => p.status === 'active');
  const inactiveProducts = mockProducts.filter(p => p.status === 'inactive' || p.status === 'sold_out');

  return (
    <div>
      <PageHeader title="My Products">
        <Button asChild>
          <Link href="/farmer/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto py-4">
         <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveProducts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="space-y-4 mt-4">
              {activeProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="inactive">
             <div className="space-y-4 mt-4">
              {inactiveProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
