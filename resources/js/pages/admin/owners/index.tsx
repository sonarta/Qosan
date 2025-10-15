import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Head, Link, router } from '@inertiajs/react';
import {
    MoreVertical,
    Plus,
    Search,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Crown,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owners', href: '/admin/owners' },
];

interface Owner {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
    subscription?: {
        plan_name: string;
        status: string;
    };
    properties_count: number;
}

interface OwnersIndexProps {
    owners: {
        data: Owner[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function OwnersIndex({ owners, filters }: OwnersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/owners',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
            },
            { preserveState: true }
        );
    };

    const handleSuspend = (ownerId: number) => {
        if (confirm('Yakin ingin suspend owner ini?')) {
            router.patch(`/admin/owners/${ownerId}/suspend`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleActivate = (ownerId: number) => {
        router.patch(`/admin/owners/${ownerId}/activate`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (ownerId: number) => {
        if (confirm('Yakin ingin menghapus owner ini? Semua data terkait akan ikut terhapus.')) {
            router.delete(`/admin/owners/${ownerId}`, {
                preserveScroll: true,
            });
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
            <Head title="Manajemen Owners" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Owners</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola semua owner dan subscription mereka
                        </p>
                    </div>
                    <Link href="/admin/owners/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Owner
                        </Button>
                    </Link>
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
                                    placeholder="Cari nama atau email..."
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
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
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
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Bergabung</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {owners.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data owner
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    owners.data.map((owner) => (
                                        <TableRow key={owner.id}>
                                            <TableCell className="font-medium">
                                                {owner.name}
                                            </TableCell>
                                            <TableCell>{owner.email}</TableCell>
                                            <TableCell>
                                                {owner.subscription ? (
                                                    <Badge variant="outline">
                                                        {owner.subscription.plan_name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        No Plan
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>{owner.properties_count}</TableCell>
                                            <TableCell>
                                                {owner.status === 'active' ? (
                                                    <Badge variant="default">Aktif</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Suspended</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(owner.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/owners/${owner.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {owner.status === 'active' ? (
                                                            <DropdownMenuItem
                                                                onClick={() => handleSuspend(owner.id)}
                                                            >
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Suspend
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() => handleActivate(owner.id)}
                                                            >
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Aktivasi
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/owners/${owner.id}/edit`}>
                                                                <Crown className="mr-2 h-4 w-4" />
                                                                Ubah Paket
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(owner.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {owners.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {owners.links.map((link, index) => (
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
