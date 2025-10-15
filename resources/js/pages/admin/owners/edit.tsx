import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Crown } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owners', href: '/admin/owners' },
    { title: 'Edit Owner', href: '#' },
];

interface Owner {
    id: number;
    name: string;
    email: string;
    subscription?: {
        plan_name: string;
        max_properties: number;
        max_rooms: number;
    };
}

interface EditOwnerProps {
    owner: Owner;
    plans: Record<string, {
        name: string;
        price: number;
        max_properties: number;
        max_rooms: number;
        features: string[];
    }>;
}

export default function EditOwner({ owner, plans }: EditOwnerProps) {
    const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: owner.name,
        email: owner.email,
        password: '',
    });

    const subscriptionForm = useForm({
        plan_name: owner.subscription?.plan_name || 'free',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/owners/${owner.id}`);
    };

    const handleChangeSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        subscriptionForm.patch(`/admin/owners/${owner.id}/change-subscription`, {
            onSuccess: () => setShowSubscriptionDialog(false),
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const selectedPlan = plans[subscriptionForm.data.plan_name];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Owner - ${owner.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/owners">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Owner</h1>
                        <p className="text-sm text-muted-foreground">
                            Update informasi owner
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Owner Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Owner</CardTitle>
                            <CardDescription>
                                Update data akun owner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Link href="/admin/owners">
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Current Subscription */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Paket Langganan</CardTitle>
                            <CardDescription>
                                Paket saat ini dan opsi untuk mengubah
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {owner.subscription ? (
                                <div className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Paket Saat Ini</span>
                                        <span className="text-lg font-bold capitalize">
                                            {owner.subscription.plan_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Max Properti</span>
                                        <span className="font-medium">{owner.subscription.max_properties}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Max Kamar</span>
                                        <span className="font-medium">{owner.subscription.max_rooms}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    Belum ada paket langganan
                                </div>
                            )}

                            <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <Crown className="mr-2 h-4 w-4" />
                                        Ubah Paket Langganan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Ubah Paket Langganan</DialogTitle>
                                        <DialogDescription>
                                            Pilih paket baru untuk owner ini
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleChangeSubscription} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="plan_name">Pilih Paket</Label>
                                            <Select
                                                value={subscriptionForm.data.plan_name}
                                                onValueChange={(value) => subscriptionForm.setData('plan_name', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(plans).map(([key, plan]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {plan.name} - {formatCurrency(plan.price)}/bulan
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Plan Details */}
                                        {selectedPlan && (
                                            <div className="rounded-lg border p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Harga</span>
                                                    <span className="text-lg font-bold">
                                                        {formatCurrency(selectedPlan.price)}
                                                        <span className="text-sm font-normal text-muted-foreground">
                                                            /bulan
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Max Properti</span>
                                                    <span className="font-medium">{selectedPlan.max_properties}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Max Kamar</span>
                                                    <span className="font-medium">{selectedPlan.max_rooms}</span>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <p className="text-sm font-medium mb-2">Fitur:</p>
                                                    <ul className="space-y-1">
                                                        {selectedPlan.features.map((feature, index) => (
                                                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                                                                <span className="mr-2">•</span>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowSubscriptionDialog(false)}
                                            >
                                                Batal
                                            </Button>
                                            <Button type="submit" disabled={subscriptionForm.processing}>
                                                {subscriptionForm.processing ? 'Menyimpan...' : 'Ubah Paket'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
