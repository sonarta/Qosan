import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Property, type Room } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, House, MapPin, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kamar / Unit',
        href: '/rooms',
    },
];

interface RoomsIndexProps {
    rooms: PaginatedData<Room>;
    properties: Property[];
    filters: {
        search?: string;
        property_id?: string;
        status?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function RoomsIndex({
    rooms,
    properties,
    filters,
}: RoomsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [propertyId, setPropertyId] = useState(filters.property_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(
            '/rooms',
            {
                search: search || undefined,
                property_id: propertyId === 'all' ? undefined : propertyId,
                status: status === 'all' ? undefined : status,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setPropertyId('all');
        setStatus('all');
        router.get('/rooms', {}, { preserveState: true });
    };

    const handleDelete = (room: Room) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus kamar "${room.name}"?`
            )
        ) {
            router.delete(`/rooms/${room.id}`);
        }
    };

    const handleStatusChange = (roomId: number, newStatus: string) => {
        router.patch(
            `/rooms/${roomId}/status`,
            { status: newStatus },
            { preserveState: true }
        );
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
            available: { variant: 'default', label: 'Tersedia' },
            occupied: { variant: 'secondary', label: 'Terisi' },
            maintenance: { variant: 'destructive', label: 'Maintenance' },
        };
        const config = variants[status] || { variant: 'default', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Kamar / Unit" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Daftar Kamar / Unit</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kamar kos Anda
                        </p>
                    </div>
                    <Link href="/rooms/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kamar
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Pencarian</CardTitle>
                        <CardDescription>
                            Cari dan filter kamar berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama kamar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                    className="pl-8"
                                />
                            </div>

                            <Select value={propertyId} onValueChange={setPropertyId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Properti" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Properti</SelectItem>
                                    {properties.map((property) => (
                                        <SelectItem key={property.id} value={property.id.toString()}>
                                            {property.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="available">Tersedia</SelectItem>
                                    <SelectItem value="occupied">Terisi</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">
                                    Cari
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {rooms.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <House className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-sm text-muted-foreground">
                                Belum ada kamar
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {rooms.data.map((room) => (
                                <Card key={room.id} className="overflow-hidden">
                                    <div className="relative aspect-video">
                                        {room.images && room.images.length > 0 ? (
                                            <img
                                                src={room.images[0].url}
                                                alt={room.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                <House className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="absolute right-2 top-2">
                                            {getStatusBadge(room.status)}
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="line-clamp-1 text-lg">
                                            {room.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            <span className="line-clamp-1">
                                                {room.property?.name}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-2 pb-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Harga</span>
                                            <span className="font-semibold">
                                                {formatPrice(room.price)}/bulan
                                            </span>
                                        </div>
                                        {room.floor !== null && room.floor !== undefined && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Lantai</span>
                                                <span>{room.floor}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Kapasitas</span>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                <span>{room.capacity}</span>
                                            </div>
                                        </div>
                                        {room.size && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Ukuran</span>
                                                <span>{room.size} m²</span>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="flex gap-2 border-t pt-3">
                                        <Select
                                            value={room.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(room.id, value)
                                            }
                                        >
                                            <SelectTrigger className="h-8 flex-1 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Tersedia</SelectItem>
                                                <SelectItem value="occupied">Terisi</SelectItem>
                                                <SelectItem value="maintenance">
                                                    Maintenance
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Link href={`/rooms/${room.id}/edit`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(room)}
                                        >
                                            <Trash2 className="h-3 w-3 text-destructive" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {rooms.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {rooms.from} - {rooms.to} dari{' '}
                                    {rooms.total} kamar
                                </p>
                                <div className="flex gap-2">
                                    {rooms.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
