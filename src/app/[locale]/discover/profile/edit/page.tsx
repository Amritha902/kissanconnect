'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "A valid 10-digit phone number is required").max(10, "A valid 10-digit phone number is required"),
});

export default function EditConsumerProfilePage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const uid = user?.uid;
  
  const memoizedUserDocRef = useMemoFirebase(() => {
    if (!firestore || !uid) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, uid]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(memoizedUserDocRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });
  
  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile, form]);

  function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!uid || !firestore) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update your profile." });
      return;
    };
    const userRef = doc(firestore, 'users', uid);
    updateDocumentNonBlocking(userRef, {
        name: values.name,
        phone: values.phone,
    });
    toast({
      title: "Profile Updated",
      description: "Your personal details have been saved.",
      action: <CheckCircle className="text-green-500" />,
    });
  }
  
    if (isUserLoading || isProfileLoading) {
        return (
            <div>
                <PageHeader title="Edit Profile" />
                <div className="container mx-auto py-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Information</CardTitle>
                            <CardDescription>Update your name and contact number.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-11 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

  return (
    <div>
      <PageHeader title="Edit Profile" />
      <div className="container mx-auto py-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Update your name and contact number.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Priya Sharma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" size="lg" className="w-full font-bold">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
