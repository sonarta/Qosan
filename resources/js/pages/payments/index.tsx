import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Payment } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Riwayat Pembayaran', href: '/payments' },
];

interface PaymentsIndexProps {
    payments: PaginatedData<Payment>;
    filters: {
        search?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function PaymentsIndex({ payments, filters }: PaymentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleSearch = () => {
        router.get('/payments', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setStartDate('');
        setEndDate('');
        router.get('/payments', {}, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = `/payments/export/csv?status=${status}&start_date=${startDate}&end_date=${endDate}`;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
            pending: { variant: 'secondary', label: 'Menunggu' },
            confirmed: { variant: 'default', label: 'Dikonfirmasi' },
            rejected: { variant: 'destructive', label: 'Ditolak' },
        };
        const config = variants[status] || variants.pending;
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
            <Head title="Riwayat Pembayaran" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Semua transaksi pembayaran
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/payments/pending/list">
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Menunggu Konfirmasi
                            </Button>
                        </Link>
                        <Button onClick={handleExport} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Pencarian</CardTitle>
                        <CardDescription>Cari dan filter pembayaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-8"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Dari Tanggal"
                            />

                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Sampai Tanggal"
                            />

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">Cari</Button>
                                <Button onClick={handleReset} variant="outline" className="flex-1">Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Pembayaran</TableHead>
                                    <TableHead>Tagihan</TableHead>
                                    <TableHead>Penyewa</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <p className="text-sm text-muted-foreground">Belum ada pembayaran</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.data.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">{payment.payment_number}</TableCell>
                                            <TableCell>{payment.bill?.bill_number}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{payment.bill?.tenant?.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {payment.bill?.tenant?.room?.name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {payment.proof_image && (
                                                    <a href={`/storage/${payment.proof_image}`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {payments.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {payments.from} - {payments.to} dari {payments.total} pembayaran
                        </p>
                        <div className="flex gap-2">
                            {payments.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
