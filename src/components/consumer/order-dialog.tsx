
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

// Define the Product type locally to fix the import error.
type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  photoUrls: string[];
};

type Farmer = {
    id: string;
    address: string;
}

interface OrderDialogProps {
  product: Product;
  farmer: Farmer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DELIVERY_FEE = 33;

export function OrderDialog({ product, farmer, open, onOpenChange }: OrderDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const totalPrice = product.price * quantity + DELIVERY_FEE;

  const handleOrder = () => {
    if (!name || !phone || !address) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in your name, phone, and address.',
      });
      return;
    }

    if (!firestore || !user) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to place an order.',
        });
        return;
    }

    const ordersCollection = collection(firestore, 'orders');
    
    addDocumentNonBlocking(ordersCollection, {
        consumerId: user.uid,
        farmerId: farmer.id,
        productId: product.id,
        productName: product.name,
        productImage: product.photoUrls?.[0] || null,
        quantity: quantity,
        unit: product.unit,
        pricePerUnit: product.price,
        deliveryFee: DELIVERY_FEE,
        totalPrice: totalPrice,
        status: 'pending_confirmation',
        consumerName: name,
        consumerPhone: phone,
        deliveryAddress: address,
        pickupAddress: farmer.address,
        createdAt: serverTimestamp(),
    });

    toast({
      title: 'Order Placed!',
      description: `Your order for ${quantity} ${product.unit} of ${product.name} is confirmed. The farmer will contact you shortly.`,
      action: <CheckCircle className="text-green-500" />,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order: {product.name}</DialogTitle>
          <DialogDescription>
            Enter quantity and delivery details. A subsidized delivery fee of ₹{DELIVERY_FEE} will be applied.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">₹{product.price} / {product.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 rounded-md border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({quantity} x ₹{product.price})</span>
                <span>₹{product.price * quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
          </div>

          <div className="space-y-4">
             <h4 className="font-medium text-center border-b pb-2">Your Details</h4>
             <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Priya Sharma" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="phone">10-digit Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 9876543210" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="address">Full Delivery Address</Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Include house no, street, landmark, city, and pincode" />
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleOrder} className="w-full font-bold" size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Confirm Order (₹{totalPrice})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
