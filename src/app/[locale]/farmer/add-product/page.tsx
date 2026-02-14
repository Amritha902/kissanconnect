'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Mic, Upload, CheckCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { farmerVoiceProductListing, FarmerVoiceProductListingOutput } from '@/ai/flows/farmer-voice-product-listing';

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  availableQuantity: z.coerce.number().min(0, "Quantity must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  expiresAt: z.date().optional(),
  isOrganic: z.boolean().default(false),
  description: z.string().optional(),
});

export default function AddProductPage() {
  const t = useTranslations('AddProductPage');
  const locale = useLocale();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      availableQuantity: 0,
      unit: 'kg',
      price: 0,
      isOrganic: false,
      description: '',
      expiresAt: undefined,
    },
  });

  const startVoiceListing = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser doesn't support voice recognition. Please use Chrome or Safari.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = locale;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({ title: "Listening...", description: "Speak your product details clearly." });
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      toast({ title: "Processing...", description: "Analyzing your speech." });
      setIsProcessing(true);
      try {
        const result = await farmerVoiceProductListing({ transcribedText: transcript });
        
        // Use a type guard to ensure result is not null
        if (result) {
            form.setValue('name', result.productName);
            form.setValue('category', result.category);
            form.setValue('availableQuantity', result.quantity);
            form.setValue('unit', result.unit);
            form.setValue('price', result.price);
            toast({
                title: "Details Filled!",
                description: "Product details have been populated from your voice input.",
                action: <CheckCircle className="text-green-500" />,
            });
        } else {
            throw new Error("Could not parse speech.");
        }

      } catch (error) {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not understand the product details. Please try again or fill the form manually.",
        });
        console.error("AI processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        toast({ variant: "destructive", title: "Couldn't hear you", description: "Please make sure your microphone is enabled and try again." });
      } else if (event.error === 'not-allowed') {
         toast({ variant: "destructive", title: "Permission Denied", description: "Please grant microphone access to use this feature." });
      } else {
        toast({ variant: "destructive", title: "An error occurred", description: "Please try again." });
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  function onSubmit(values: z.infer<typeof productSchema>) {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to add a product.",
        });
        return;
    }

    const productsCollection = collection(firestore, 'products');
    const productImage = PlaceHolderImages.find(p => p.id === 'product_upload');

    addDocumentNonBlocking(productsCollection, {
        ...values,
        farmerId: user.uid,
        farmerName: user.displayName || 'Anonymous Farmer',
        status: 'active',
        viewsCount: 0,
        callsCount: 0,
        listedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        photoUrls: productImage ? [productImage.imageUrl] : [],
    });

    toast({
      title: "Product Listed!",
      description: "Your product is now live for consumers to see.",
      action: <CheckCircle className="text-green-500" />,
    });

    router.push('/farmer/products');
  }
  
  const productImage = PlaceHolderImages.find(p => p.id === 'product_upload');

  return (
    <div className="bg-muted/30 min-h-screen">
      <PageHeader title="Add New Product" />
      <div className="container mx-auto py-4 space-y-6">
        
        <Card>
            <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload a clear photo of your produce.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-muted">
                    {productImage && <Image src={productImage.imageUrl} alt="Product" layout="fill" objectFit="cover" data-ai-hint={productImage.imageHint} />}
                </div>
                <div className="flex w-full gap-4">
                    <Button variant="outline" className="flex-1"><Camera className="mr-2 h-4 w-4"/> Take Photo</Button>
                    <Button variant="outline" className="flex-1"><Upload className="mr-2 h-4 w-4"/> From Gallery</Button>
                </div>
            </CardContent>
        </Card>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-muted/30 px-2 text-muted-foreground">
              OR
            </span>
          </div>
        </div>
        
        <Card>
             <CardHeader>
                <CardTitle>Voice Listing</CardTitle>
                <CardDescription>For low-literacy farmers, speak to list your product.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    variant={isRecording ? "destructive" : "secondary"}
                    size="lg" 
                    className="w-full h-auto whitespace-normal text-center"
                    onClick={startVoiceListing}
                    disabled={isRecording || isProcessing}
                >
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                    ) : (
                        <Mic className="mr-2 h-5 w-5"/>
                    )}
                    
                    {isRecording ? "Listening..." : (isProcessing ? "Processing..." : t('voiceListingButton'))}
                </Button>
            </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in the details for your product listing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fresh Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Fruits">Fruits</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Eggs">Eggs</SelectItem>
                          <SelectItem value="Honey">Honey</SelectItem>
                          <SelectItem value="Pickles">Pickles</SelectItem>
                           <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="availableQuantity"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Available Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="piece">piece</SelectItem>
                                    <SelectItem value="dozen">dozen</SelectItem>
                                    <SelectItem value="liter">liter</SelectItem>
                                </SelectContent>
                            </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (per unit)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input type="number" placeholder="20" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Stays Fresh Until (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isOrganic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Organic / Pesticide-free</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Harvested this morning, completely organic..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" size="lg" className="w-full font-bold">List Product</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// @ts-ignore
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}
