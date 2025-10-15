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
    { title: 'Penyewa', href: '/admin/tenants' },
];

interface Tenant {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    check_in_date: string;
    check_out_date?: string;
    room: {
        name: string;
        property: {
            name: string;
            owner: {
                name: string;
            };
        };
    };
}

interface TenantsIndexProps {
    tenants: {
        data: Tenant[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function TenantsIndex({ tenants, filters }: TenantsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/tenants',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
            },
            { preserveState: true }
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semua Penyewa" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Semua Penyewa</h1>
                    <p className="text-sm text-muted-foreground">
                        View semua penyewa dari semua owner (Read-only)
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
                                    placeholder="Cari penyewa atau properti..."
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
                                    <TableHead>Penyewa</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Kamar</TableHead>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data penyewa
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tenants.data.map((tenant) => (
                                        <TableRow key={tenant.id}>
                                            <TableCell className="font-medium">
                                                {tenant.name}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm">{tenant.email}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tenant.phone}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{tenant.room.name}</TableCell>
                                            <TableCell>{tenant.room.property.name}</TableCell>
                                            <TableCell className="text-sm">
                                                {tenant.room.property.owner.name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(tenant.check_in_date)}
                                            </TableCell>
                                            <TableCell>
                                                {tenant.status === 'active' ? (
                                                    <Badge variant="default">Aktif</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Tidak Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.visit(`/admin/tenants/${tenant.id}`)}
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
                {tenants.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {tenants.links.map((link, index) => (
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
