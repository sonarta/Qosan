import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Tenant } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penyewa',
        href: '/tenants',
    },
    {
        title: 'Edit Penyewa',
        href: '#',
    },
];

interface TenantEditProps {
    tenant: Tenant;
}

export default function TenantEdit({ tenant }: TenantEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        id_card_number: tenant.id_card_number || '',
        address: tenant.address || '',
        check_in_date: tenant.check_in_date || '',
        check_out_date: tenant.check_out_date || '',
        notes: tenant.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tenants/${tenant.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${tenant.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Penyewa</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui informasi penyewa {tenant.name}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kamar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="text-sm font-medium">{tenant.room?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {tenant.room?.property?.name}
                                </p>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Kamar tidak dapat diubah. Untuk pindah kamar, buat penyewa baru.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Penyewa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon *</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_card_number">Nomor KTP</Label>
                                    <Input
                                        id="id_card_number"
                                        value={data.id_card_number}
                                        onChange={(e) =>
                                            setData('id_card_number', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.id_card_number} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                />
                                <InputError message={errors.address} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Sewa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="check_in_date">Tanggal Masuk *</Label>
                                    <Input
                                        id="check_in_date"
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={(e) =>
                                            setData('check_in_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.check_in_date} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="check_out_date">Tanggal Keluar</Label>
                                    <Input
                                        id="check_out_date"
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={(e) =>
                                            setData('check_out_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.check_out_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                />
                                <InputError message={errors.notes} />
                            </div>
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
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
