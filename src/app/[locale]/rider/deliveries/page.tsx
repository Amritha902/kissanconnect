'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Package, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function RiderDeliveriesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const deliveriesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'orders'), where('riderId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: deliveries, isLoading } = useCollection<any>(deliveriesQuery);

  const activeDeliveries = deliveries?.filter(d => d.status === 'out_for_delivery') || [];
  const completedDeliveries = deliveries?.filter(d => d.status === 'delivered') || [];
  
  const handleMarkAsDelivered = (orderId: string) => {
     if (!firestore) return;
     const orderRef = doc(firestore, 'orders', orderId);
     updateDocumentNonBlocking(orderRef, {
        status: 'delivered',
        deliveredAt: serverTimestamp()
     });
     toast({
        title: 'Delivery Completed!',
        description: 'Great job! The order has been marked as delivered.',
     });
  };

  const DeliveryCard = ({ delivery }: { delivery: any }) => (
    <Card>
      <CardHeader>
        <CardTitle>{delivery.productName}</CardTitle>
        <CardDescription>
          Order ID: {delivery.id.slice(0, 7)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm"><strong>From:</strong> {delivery.pickupAddress}</p>
        <p className="text-sm"><strong>To:</strong> {delivery.deliveryAddress}</p>
        {delivery.status === 'out_for_delivery' && (
           <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={() => handleMarkAsDelivered(delivery.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
             <Button variant="outline" className="flex-1" asChild>
                <a href={`tel:${delivery.consumerPhone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Customer
                </a>
             </Button>
           </div>
        )}
        {delivery.status === 'delivered' && delivery.deliveredAt && (
             <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Delivered on {format(delivery.deliveredAt.toDate(), 'PPp')}
            </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <PageHeader title="My Deliveries" />
      <div className="container mx-auto py-4">
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active ({activeDeliveries.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedDeliveries.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4 space-y-4">
              {activeDeliveries.length > 0 ? (
                activeDeliveries.map(d => <DeliveryCard key={d.id} delivery={d} />)
              ) : (
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-4"/>
                        <h3 className="font-semibold text-lg">No Active Deliveries</h3>
                        <p className="text-muted-foreground text-sm">Accept a job from the dashboard to get started.</p>
                    </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-4 space-y-4">
               {completedDeliveries.length > 0 ? (
                completedDeliveries.map(d => <DeliveryCard key={d.id} delivery={d} />)
              ) : (
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mb-4"/>
                        <h3 className="font-semibold text-lg">No Past Deliveries</h3>
                        <p className="text-muted-foreground text-sm">Your completed deliveries will appear here.</p>
                    </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
