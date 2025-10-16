import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Property } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MapPinHouse, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Properti',
        href: '/properties',
    },
];

interface PropertiesIndexProps {
    properties: PaginatedData<Property>;
    filters: {
        search?: string;
        status?: string;
        type?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function PropertiesIndex({
    properties,
    filters,
}: PropertiesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');

    const handleSearch = () => {
        router.get(
            '/properties',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
                type: type === 'all' ? undefined : type,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setType('all');
        router.get('/properties', {}, { preserveState: true });
    };

    const handleDelete = (property: Property) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus properti "${property.name}"?`
            )
        ) {
            router.delete(`/properties/${property.id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            draft: 'secondary',
            active: 'default',
            inactive: 'destructive',
        };
        return (
            <Badge variant={variants[status] || 'default'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Properti" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Daftar Properti</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola properti kos Anda
                        </p>
                    </div>
                    <Link href="/properties/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Properti
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Pencarian</CardTitle>
                        <CardDescription>
                            Cari dan filter properti berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, kota, alamat..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                    className="pl-8"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="Kos Putra">
                                        Kos Putra
                                    </SelectItem>
                                    <SelectItem value="Kos Putri">
                                        Kos Putri
                                    </SelectItem>
                                    <SelectItem value="Kos Campur">
                                        Kos Campur
                                    </SelectItem>
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

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Jumlah Kamar</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MapPinHouse className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Belum ada properti
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    properties.data.map((property) => (
                                        <TableRow key={property.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {property.images?.[0] ? (
                                                        <img
                                                            src={property.images[0].url}
                                                            alt={property.name}
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                                                            <MapPinHouse className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">
                                                            {property.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {property.owner?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{property.address_line1}</p>
                                                    <p className="text-muted-foreground">
                                                        {property.city}
                                                        {property.state &&
                                                            `, ${property.state}`}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {property.type || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {property.rooms_count || 0}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(property.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/properties/${property.id}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/properties/${property.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(property)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {properties.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {properties.from} - {properties.to} dari{' '}
                            {properties.total} properti
                        </p>
                        <div className="flex gap-2">
                            {properties.links.map((link, index) => (
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
            </div>
        </AppLayout>
    );
}
