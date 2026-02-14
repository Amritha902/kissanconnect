'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function NotificationSettingsPage() {
    
    const notificationSettings = [
        { id: 'paymentRequests', label: 'Payment Requests', description: 'When a farmer requests payment for an order.', defaultChecked: true },
        { id: 'orderUpdates', label: 'Order Updates', description: 'Get notified about your order status.', defaultChecked: true },
        { id: 'newProducts', label: 'New Products', description: 'From your favorite farmers.', defaultChecked: false },
        { id: 'communityUpdates', label: 'Community Updates', description: 'News and updates from the farmer community.', defaultChecked: true },
    ];

  return (
    <div>
      <PageHeader title="Notification Settings" />
      <div className="container mx-auto py-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage what alerts you receive on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notificationSettings.map(setting => (
                     <div key={setting.id} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor={setting.id}>{setting.label}</Label>
                            <p className="text-xs text-muted-foreground">{setting.description}</p>
                        </div>
                        <Switch
                            id={setting.id}
                            defaultChecked={setting.defaultChecked}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
