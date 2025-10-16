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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    MoreVertical,
    Plus,
    Edit,
    Trash2,
    Crown,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Paket Langganan', href: '/admin/packages' },
];

interface Package {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    max_properties: number;
    max_rooms: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
}

interface PackagesIndexProps {
    packages: Package[];
}

export default function PackagesIndex({ packages }: PackagesIndexProps) {
    const handleDelete = (packageId: number) => {
        if (confirm('Yakin ingin menghapus paket ini?')) {
            router.delete(`/admin/packages/${packageId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Paket Langganan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Paket Langganan</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola paket langganan yang tersedia
                        </p>
                    </div>
                    <Link href="/admin/packages/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Paket
                        </Button>
                    </Link>
                </div>

                {/* Packages Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60' : ''}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-5 w-5 text-primary" />
                                        <CardTitle>{pkg.name}</CardTitle>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/packages/${pkg.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(pkg.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {pkg.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(pkg.price)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">/bulan</p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Max Properti</span>
                                        <span className="font-medium">{pkg.max_properties}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Max Kamar</span>
                                        <span className="font-medium">{pkg.max_rooms}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium mb-2">Fitur:</p>
                                    <ul className="space-y-1">
                                        {pkg.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                                                <span className="mr-2">•</span>
                                                {feature}
                                            </li>
                                        ))}
                                        {pkg.features.length > 3 && (
                                            <li className="text-sm text-muted-foreground">
                                                +{pkg.features.length - 3} fitur lainnya
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="pt-2">
                                    {pkg.is_active ? (
                                        <Badge variant="default">Aktif</Badge>
                                    ) : (
                                        <Badge variant="secondary">Tidak Aktif</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detailed Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Paket</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Kamar</TableHead>
                                    <TableHead>Urutan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.map((pkg) => (
                                    <TableRow key={pkg.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{pkg.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {pkg.slug}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(pkg.price)}</TableCell>
                                        <TableCell>{pkg.max_properties}</TableCell>
                                        <TableCell>{pkg.max_rooms}</TableCell>
                                        <TableCell>{pkg.sort_order}</TableCell>
                                        <TableCell>
                                            {pkg.is_active ? (
                                                <Badge variant="default">Aktif</Badge>
                                            ) : (
                                                <Badge variant="secondary">Tidak Aktif</Badge>
                                            )}
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
                                                        <Link href={`/admin/packages/${pkg.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(pkg.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
