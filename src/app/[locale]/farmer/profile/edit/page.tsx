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
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  aadhar: z.string().optional(),
});

export default function EditFarmerProfilePage() {
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
      firstName: '',
      lastName: '',
      aadhar: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      const [firstName, ...lastNameParts] = (userProfile.name || '').split(' ');
      const lastName = lastNameParts.join(' ');
      form.reset({
        firstName: firstName || '',
        lastName: lastName || '',
        aadhar: userProfile.hashedAadhaar || '',
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
      name: `${values.firstName} ${values.lastName}`.trim(),
      hashedAadhaar: values.aadhar,
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
            <PageHeader title="Edit Personal Details" />
            <div className="container mx-auto py-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Keep your personal details up to date.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
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
      <PageHeader title="Edit Personal Details" />
      <div className="container mx-auto py-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Keep your personal details up to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Ravi" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Kumar" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="aadhar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="XXXX XXXX XXXX" 
                          {...field}
                          onChange={(e) => {
                            const formatted = e.target.value
                              .replace(/\D/g, '') // Remove non-digits
                              .slice(0, 12) // Limit to 12 digits
                              .replace(/(.{4})/g, '$1 ') // Add a space every 4 digits
                              .trim(); // Remove trailing space
                            field.onChange(formatted);
                          }}
                        />
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
