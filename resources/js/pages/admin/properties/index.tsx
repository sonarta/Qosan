import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Eye } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Properti', href: '/admin/properties' },
];

interface Property {
    id: number;
    name: string;
    address: string;
    type: string;
    status: string;
    owner: {
        name: string;
        email: string;
    };
    rooms_count: number;
    occupied_rooms: number;
}

interface PropertiesIndexProps {
    properties: {
        data: Property[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function PropertiesIndex({ properties, filters }: PropertiesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/properties',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
            },
            { preserveState: true }
        );
    };

    const getOccupancyRate = (occupied: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((occupied / total) * 100);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semua Properti" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Semua Properti</h1>
                    <p className="text-sm text-muted-foreground">
                        View semua properti dari semua owner (Read-only)
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari properti atau owner..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>Terapkan Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Kamar</TableHead>
                                    <TableHead>Occupancy</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data properti
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    properties.data.map((property) => (
                                        <TableRow key={property.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{property.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {property.address}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium">{property.owner.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {property.owner.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">{property.type}</TableCell>
                                            <TableCell>{property.rooms_count}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {property.occupied_rooms}/{property.rooms_count}
                                                    </span>
                                                    <Badge variant="outline">
                                                        {getOccupancyRate(property.occupied_rooms, property.rooms_count)}%
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {property.status === 'active' ? (
                                                    <Badge variant="default">Aktif</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Tidak Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.visit(`/admin/properties/${property.id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {properties.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {properties.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
