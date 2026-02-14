
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div>
      <PageHeader title="My Favorite Farmers" />
      <div className="container mx-auto py-4">
         <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Coming Soon!</h3>
                <p className="text-muted-foreground text-sm">You'll be able to save your favorite farmers here for quick access.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
