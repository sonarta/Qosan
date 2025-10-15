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
import { type BreadcrumbItem, type PaginatedData, type Bill, type Property } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye, FileText, Plus, Receipt, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tagihan',
        href: '/bills',
    },
];

interface BillsIndexProps {
    bills: PaginatedData<Bill>;
    properties: Property[];
    filters: {
        search?: string;
        status?: string;
        property_id?: string;
        period?: string;
    };
}

export default function BillsIndex({ bills, properties, filters }: BillsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [propertyId, setPropertyId] = useState(filters.property_id || 'all');
    const [period, setPeriod] = useState(filters.period || '');

    const handleSearch = () => {
        router.get(
            '/bills',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
                property_id: propertyId === 'all' ? undefined : propertyId,
                period: period || undefined,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setPropertyId('all');
        setPeriod('');
        router.get('/bills', {}, { preserveState: true });
    };

    const handleMarkAsPaid = (billId: number) => {
        if (confirm('Tandai tagihan ini sebagai lunas?')) {
            router.patch(`/bills/${billId}/mark-paid`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
            unpaid: { variant: 'secondary', label: 'Belum Lunas' },
            paid: { variant: 'default', label: 'Lunas' },
            overdue: { variant: 'destructive', label: 'Jatuh Tempo' },
            cancelled: { variant: 'outline', label: 'Dibatalkan' },
        };
        const config = variants[status] || variants.unpaid;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
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
            <Head title="Semua Tagihan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Semua Tagihan</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola tagihan sewa dan pembayaran
                        </p>
                    </div>
                    <Link href="/bills/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Generate Tagihan
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Pencarian</CardTitle>
                        <CardDescription>
                            Cari dan filter tagihan berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nomor/penyewa..."
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
                                    <SelectItem value="unpaid">Belum Lunas</SelectItem>
                                    <SelectItem value="paid">Lunas</SelectItem>
                                    <SelectItem value="overdue">Jatuh Tempo</SelectItem>
                                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>

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

                            <Input
                                type="month"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                placeholder="Periode"
                            />

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">
                                    Cari
                                </Button>
                                <Button onClick={handleReset} variant="outline" className="flex-1">
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
                                    <TableHead>No. Tagihan</TableHead>
                                    <TableHead>Penyewa</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Jatuh Tempo</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bills.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Receipt className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Belum ada tagihan
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bills.data.map((bill) => (
                                        <TableRow key={bill.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{bill.bill_number}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{bill.tenant?.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {bill.tenant?.room?.name} - {bill.tenant?.room?.property?.name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDate(bill.period_start)} - {formatDate(bill.period_end)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(bill.due_date)}</TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(bill.total)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(bill.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/bills/${bill.id}`}>
                                                        <Button variant="outline" size="icon" title="Lihat Detail">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <a href={`/bills/${bill.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="icon" title="Download PDF">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                    {bill.status === 'unpaid' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleMarkAsPaid(bill.id)}
                                                        >
                                                            Tandai Lunas
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {bills.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {bills.from} - {bills.to} dari {bills.total} tagihan
                        </p>
                        <div className="flex gap-2">
                            {bills.links.map((link, index) => (
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
