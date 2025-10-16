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
import { Search, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment History', href: '/admin/payments' },
];

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    status: string;
    proof_image: string | null;
    bill: {
        tenant: {
            name: string;
            room: {
                name: string;
                property: {
                    name: string;
                    owner: {
                        name: string;
                        email: string;
                    };
                };
            };
        };
    };
}

interface PaymentsIndexProps {
    payments: {
        data: Payment[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: {
        total_payments: number;
        confirmed: number;
        pending: number;
        rejected: number;
        total_amount: number;
    };
    filters: {
        search?: string;
        status?: string;
        payment_method?: string;
    };
}

export default function PaymentsIndex({ payments, stats, filters }: PaymentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/payments',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
                payment_method: paymentMethod === 'all' ? undefined : paymentMethod,
            },
            { preserveState: true }
        );
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Confirmed</Badge>;
            case 'pending':
                return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment History" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Payment History</h1>
                    <p className="text-sm text-muted-foreground">
                        Riwayat semua pembayaran dari semua owner
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_payments}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.confirmed}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_amount)}</div>
                            <p className="text-xs text-muted-foreground">Confirmed only</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari penyewa atau owner..."
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
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Metode</SelectItem>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
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
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Penyewa</TableHead>
                                    <TableHead>Properti</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data payment
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.data.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="text-sm">
                                                {formatDate(payment.payment_date)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{payment.bill.tenant.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {payment.bill.tenant.room.name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {payment.bill.tenant.room.property.name}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {payment.bill.tenant.room.property.owner.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {payment.bill.tenant.room.property.owner.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-sm">
                                                {payment.payment_method}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {payments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {payments.links.map((link, index) => (
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
