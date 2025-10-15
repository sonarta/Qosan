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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Tenant } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, LogOut, Plus, Search, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penyewa',
        href: '/tenants',
    },
];

interface TenantsIndexProps {
    tenants: PaginatedData<Tenant>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function TenantsIndex({ tenants, filters }: TenantsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.status || 'active');

    const handleSearch = () => {
        router.get(
            '/tenants',
            {
                search: search || undefined,
                status: activeTab,
            },
            { preserveState: true }
        );
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.get(
            '/tenants',
            {
                search: search || undefined,
                status: tab,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get('/tenants', { status: activeTab }, { preserveState: true });
    };

    const handleDelete = (tenant: Tenant) => {
        if (confirm(`Apakah Anda yakin ingin menghapus penyewa "${tenant.name}"?`)) {
            router.delete(`/tenants/${tenant.id}`);
        }
    };

    const handleCheckOut = (tenant: Tenant) => {
        if (confirm(`Tandai "${tenant.name}" sebagai keluar?`)) {
            router.patch(`/tenants/${tenant.id}/check-out`);
        }
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
            <Head title="Daftar Penyewa" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Daftar Penyewa</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data penyewa kos
                        </p>
                    </div>
                    <Link href="/tenants/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Penyewa
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b">
                    <button
                        onClick={() => handleTabChange('active')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'active'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <UserCheck className="h-4 w-4" />
                        Penyewa Aktif
                    </button>
                    <button
                        onClick={() => handleTabChange('inactive')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'inactive'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <UserX className="h-4 w-4" />
                        Penyewa Tidak Aktif
                    </button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Pencarian</CardTitle>
                        <CardDescription>
                            Cari penyewa berdasarkan nama, telepon, atau email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, telepon, email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                    className="pl-8"
                                />
                            </div>
                            <Button onClick={handleSearch}>Cari</Button>
                            <Button onClick={handleReset} variant="outline">
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Penyewa</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Kamar</TableHead>
                                    <TableHead>Tanggal Masuk</TableHead>
                                    {activeTab === 'inactive' && (
                                        <TableHead>Tanggal Keluar</TableHead>
                                    )}
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={activeTab === 'inactive' ? 6 : 5}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Belum ada penyewa
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tenants.data.map((tenant) => (
                                        <TableRow key={tenant.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{tenant.name}</p>
                                                    {tenant.id_card_number && (
                                                        <p className="text-xs text-muted-foreground">
                                                            KTP: {tenant.id_card_number}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{tenant.phone}</p>
                                                    {tenant.email && (
                                                        <p className="text-muted-foreground">
                                                            {tenant.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        {tenant.room?.name}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {tenant.room?.property?.name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(tenant.check_in_date)}
                                            </TableCell>
                                            {activeTab === 'inactive' && (
                                                <TableCell>
                                                    {tenant.check_out_date
                                                        ? formatDate(tenant.check_out_date)
                                                        : '-'}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {activeTab === 'active' && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleCheckOut(tenant)}
                                                            title="Tandai Keluar"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Link href={`/tenants/${tenant.id}/edit`}>
                                                        <Button variant="outline" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(tenant)}
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

                {tenants.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {tenants.from} - {tenants.to} dari {tenants.total}{' '}
                            penyewa
                        </p>
                        <div className="flex gap-2">
                            {tenants.links.map((link, index) => (
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
