import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owners', href: '/admin/owners' },
    { title: 'Tambah Owner', href: '/admin/owners/create' },
];

interface CreateOwnerProps {
    plans: Record<string, {
        name: string;
        price: number;
        max_properties: number;
        max_rooms: number;
        features: string[];
    }>;
}

export default function CreateOwner({ plans }: CreateOwnerProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        plan_name: 'free',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/owners');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const selectedPlan = plans[data.plan_name];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Owner" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/owners">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Owner Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat akun owner baru dengan paket langganan
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    {/* Owner Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Owner</CardTitle>
                            <CardDescription>
                                Data akun owner yang akan dibuat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
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
                                    placeholder="email@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Paket Langganan</CardTitle>
                            <CardDescription>
                                Pilih paket untuk owner ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="plan_name">Pilih Paket</Label>
                                <Select
                                    value={data.plan_name}
                                    onValueChange={(value) => setData('plan_name', value)}
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
                                {errors.plan_name && (
                                    <p className="text-sm text-destructive">{errors.plan_name}</p>
                                )}
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
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="md:col-span-2 flex justify-end gap-2">
                        <Link href="/admin/owners">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Owner'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
