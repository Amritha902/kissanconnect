'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Bike, MapPin, Package, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function RiderDashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const availableJobsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), where('status', '==', 'ready_for_pickup'));
  }, [firestore]);

  const { data: availableJobs, isLoading } = useCollection<any>(availableJobsQuery);

  const handleAcceptJob = (orderId: string) => {
    if (!firestore || !user) return;
    const orderRef = doc(firestore, 'orders', orderId);
    updateDocumentNonBlocking(orderRef, {
      riderId: user.uid,
      status: 'out_for_delivery',
    });
    toast({
      title: 'Job Accepted!',
      description: 'The delivery has been added to your active deliveries.',
    });
  };

  return (
    <div>
      <PageHeader title="Available Deliveries" />
      <div className="container mx-auto py-4 space-y-4">
        {isLoading && (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        )}
        {!isLoading && (!availableJobs || availableJobs.length === 0) ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Bike className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No Deliveries Available</h3>
              <p className="text-muted-foreground text-sm">Check back soon for new delivery jobs.</p>
            </CardContent>
          </Card>
        ) : (
          availableJobs?.map(job => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{job.productName}</span>
                  <span className="text-primary font-bold">₹{job.deliveryFee}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Pickup From: <strong>{job.pickupAddress}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Deliver To: <strong>{job.deliveryAddress}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Order placed{' '}
                      {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleAcceptJob(job.id)}>
                  Accept Delivery
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
