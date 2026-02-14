'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function BankingPage() {
    const { toast } = useToast();
    const [upiIds, setUpiIds] = useState(['ravi.kumar@upi']);
    const [newUpiId, setNewUpiId] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddUpi = () => {
        if (newUpiId && !upiIds.includes(newUpiId)) {
            setUpiIds([...upiIds, newUpiId]);
            setNewUpiId('');
            toast({ title: "Success", description: "New UPI ID added." });
            setIsDialogOpen(false);
        } else {
            toast({ variant: 'destructive', title: "Error", description: "Please enter a valid and unique UPI ID." });
        }
    };

    const handleDeleteUpi = (idToDelete: string) => {
        setUpiIds(upiIds.filter(id => id !== idToDelete));
        toast({ title: "Success", description: "UPI ID removed." });
    }

  return (
    <div>
      <PageHeader title="Banking & Payments" />
      <div className="container mx-auto py-4 space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Your UPI IDs</CardTitle>
                        <CardDescription>Receive payments directly to your bank account.</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add UPI
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New UPI ID</DialogTitle>
                                <DialogDescription>
                                    Enter your UPI ID to receive payments from customers.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="upiId" className="text-right">
                                        UPI ID
                                    </Label>
                                    <Input
                                        id="upiId"
                                        value={newUpiId}
                                        onChange={(e) => setNewUpiId(e.target.value)}
                                        className="col-span-3"
                                        placeholder="yourname@bank"
                                    />
                                </div>
                            </div>
                             <DialogFooter>
                                <Button onClick={handleAddUpi}>Save UPI ID</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {upiIds.length > 0 ? (
                    <div className="space-y-3">
                        {upiIds.map(id => (
                            <div key={id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <p className="font-mono text-sm">{id}</p>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUpi(id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-4">No UPI IDs added yet.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
