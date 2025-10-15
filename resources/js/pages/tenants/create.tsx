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
import { type BreadcrumbItem, type Room } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penyewa',
        href: '/tenants',
    },
    {
        title: 'Tambah Penyewa',
        href: '/tenants/create',
    },
];

interface TenantCreateProps {
    availableRooms: Room[];
}

export default function TenantCreate({ availableRooms }: TenantCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        room_id: '',
        name: '',
        email: '',
        phone: '',
        id_card_number: '',
        address: '',
        check_in_date: new Date().toISOString().split('T')[0],
        check_out_date: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tenants');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Penyewa" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Tambah Penyewa Baru</h1>
                    <p className="text-sm text-muted-foreground">
                        Lengkapi informasi penyewa kos
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kamar</CardTitle>
                            <CardDescription>
                                Pilih kamar yang tersedia untuk penyewa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_id">Kamar *</Label>
                                <Select
                                    value={data.room_id}
                                    onValueChange={(value) => setData('room_id', value)}
                                >
                                    <SelectTrigger id="room_id">
                                        <SelectValue placeholder="Pilih kamar tersedia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRooms.length === 0 ? (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                Tidak ada kamar tersedia
                                            </div>
                                        ) : (
                                            availableRooms.map((room) => (
                                                <SelectItem
                                                    key={room.id}
                                                    value={room.id.toString()}
                                                >
                                                    {room.name} - {room.property?.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.room_id} />
                            </div>
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
                                        placeholder="Nama lengkap penyewa"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon *</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
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
                                        placeholder="email@example.com"
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
                                        placeholder="16 digit nomor KTP"
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
                                    placeholder="Alamat lengkap penyewa..."
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
                                    <Label htmlFor="check_out_date">
                                        Tanggal Keluar (Opsional)
                                    </Label>
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
                                    placeholder="Catatan tambahan..."
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
                            {processing ? 'Menyimpan...' : 'Simpan Penyewa'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
