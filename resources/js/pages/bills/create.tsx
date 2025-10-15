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
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Tenant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tagihan',
        href: '/bills',
    },
    {
        title: 'Generate Tagihan',
        href: '/bills/create',
    },
];

interface BillCreateProps {
    activeTenants: Tenant[];
}

interface BillItem {
    description: string;
    amount: string;
    quantity: string;
    total: string;
}

export default function BillCreate({ activeTenants }: BillCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_id: '',
        due_date: '',
        period_start: new Date().toISOString().split('T')[0],
        period_end: '',
        items: [
            { description: '', amount: '', quantity: '1', total: '' },
        ] as BillItem[],
        notes: '',
    });

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    useEffect(() => {
        if (data.tenant_id) {
            const tenant = activeTenants.find((t) => t.id.toString() === data.tenant_id);
            setSelectedTenant(tenant || null);
            
            // Auto-populate rent
            if (tenant && tenant.room) {
                const newItems = [...data.items];
                newItems[0] = {
                    description: `Sewa Kamar - ${tenant.room.name}`,
                    amount: tenant.room.price.toString(),
                    quantity: '1',
                    total: tenant.room.price.toString(),
                };
                setData('items', newItems);
            }
        }
    }, [data.tenant_id]);

    const handleItemChange = (index: number, field: keyof BillItem, value: string) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        
        // Calculate total
        if (field === 'amount' || field === 'quantity') {
            const amount = parseFloat(newItems[index].amount) || 0;
            const quantity = parseInt(newItems[index].quantity) || 1;
            newItems[index].total = (amount * quantity).toString();
        }
        
        setData('items', newItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            { description: '', amount: '', quantity: '1', total: '' },
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const calculateGrandTotal = () => {
        return data.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bills');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Tagihan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Generate Tagihan Manual</h1>
                    <p className="text-sm text-muted-foreground">
                        Buat tagihan untuk penyewa aktif
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penyewa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tenant_id">Penyewa *</Label>
                                <Select
                                    value={data.tenant_id}
                                    onValueChange={(value) => setData('tenant_id', value)}
                                >
                                    <SelectTrigger id="tenant_id">
                                        <SelectValue placeholder="Pilih penyewa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeTenants.map((tenant) => (
                                            <SelectItem key={tenant.id} value={tenant.id.toString()}>
                                                {tenant.name} - {tenant.room?.name} ({tenant.room?.property?.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tenant_id} />
                            </div>

                            {selectedTenant && (
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-sm"><strong>Kamar:</strong> {selectedTenant.room?.name}</p>
                                    <p className="text-sm"><strong>Properti:</strong> {selectedTenant.room?.property?.name}</p>
                                    <p className="text-sm"><strong>Harga Sewa:</strong> {formatCurrency(selectedTenant.room?.price || 0)}/bulan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Periode & Jatuh Tempo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="period_start">Periode Mulai *</Label>
                                    <Input
                                        id="period_start"
                                        type="date"
                                        value={data.period_start}
                                        onChange={(e) => setData('period_start', e.target.value)}
                                    />
                                    <InputError message={errors.period_start} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="period_end">Periode Akhir *</Label>
                                    <Input
                                        id="period_end"
                                        type="date"
                                        value={data.period_end}
                                        onChange={(e) => setData('period_end', e.target.value)}
                                    />
                                    <InputError message={errors.period_end} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Jatuh Tempo *</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Item Tagihan</CardTitle>
                            <CardDescription>
                                Sewa kamar dan biaya tambahan lainnya
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="rounded-lg border p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="font-medium">Item #{index + 1}</h4>
                                        {data.items.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Deskripsi *</Label>
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'description', e.target.value)
                                                }
                                                placeholder="Contoh: Listrik, Air, dll"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Harga *</Label>
                                            <Input
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'amount', e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Jumlah *</Label>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'quantity', e.target.value)
                                                }
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 text-right">
                                        <span className="text-sm font-medium">
                                            Total: {formatCurrency(parseFloat(item.total) || 0)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <Button type="button" variant="outline" onClick={addItem} className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Item
                            </Button>

                            <div className="rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold">TOTAL TAGIHAN:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatCurrency(calculateGrandTotal())}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Catatan tambahan..."
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            />
                            <InputError message={errors.notes} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Generate Tagihan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
