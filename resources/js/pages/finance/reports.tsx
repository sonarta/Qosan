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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Payment, type Property } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    CheckCircle,
    BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laporan Keuangan', href: '/finance/reports' },
];

interface FinanceReportsProps {
    summary: {
        total_revenue: number;
        total_outstanding: number;
        pending_payments: number;
        collection_rate: number;
    };
    monthlyTrend: Array<{
        month: string;
        revenue: number;
        outstanding: number;
    }>;
    revenueByProperty: Array<{
        property_name: string;
        total_revenue: number;
        payment_count: number;
    }>;
    paymentStatusDistribution: Array<{
        status: string;
        count: number;
        total: number;
    }>;
    recentTransactions: Payment[];
    properties: Property[];
    filters: {
        start_date: string;
        end_date: string;
        property_id?: number;
    };
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function FinanceReports({
    summary,
    monthlyTrend,
    revenueByProperty,
    paymentStatusDistribution,
    recentTransactions,
    properties,
    filters,
}: FinanceReportsProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [propertyId, setPropertyId] = useState(
        filters.property_id?.toString() || 'all'
    );

    const handleFilter = () => {
        router.get(
            '/finance/reports',
            {
                start_date: startDate,
                end_date: endDate,
                property_id: propertyId === 'all' ? undefined : propertyId,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];

        setStartDate(startOfMonth);
        setEndDate(endOfMonth);
        setPropertyId('all');
        router.get('/finance/reports', {}, { preserveState: true });
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

    const statusLabels: Record<string, string> = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        rejected: 'Ditolak',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
                    <p className="text-sm text-muted-foreground">
                        Analisis pendapatan dan trend keuangan
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Periode</CardTitle>
                        <CardDescription>
                            Pilih periode dan properti untuk melihat laporan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Dari Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Sampai Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Properti
                                </label>
                                <Select
                                    value={propertyId}
                                    onValueChange={setPropertyId}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Properti
                                        </SelectItem>
                                        {properties.map((property) => (
                                            <SelectItem
                                                key={property.id}
                                                value={property.id.toString()}
                                            >
                                                {property.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Terapkan
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

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pendapatan
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(summary.total_revenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pembayaran terkonfirmasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tagihan Belum Lunas
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(summary.total_outstanding)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Menunggu pembayaran
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Menunggu Konfirmasi
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(summary.pending_payments)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Perlu review
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tingkat Koleksi
                            </CardTitle>
                            {summary.collection_rate >= 80 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.collection_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dari total tagihan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trend Bulanan (6 Bulan Terakhir)</CardTitle>
                            <CardDescription>
                                Perbandingan pendapatan dan tagihan belum lunas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        name="Pendapatan"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="outstanding"
                                        stroke="#ef4444"
                                        name="Belum Lunas"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue by Property */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pendapatan per Properti</CardTitle>
                            <CardDescription>
                                Total pendapatan dari setiap properti
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByProperty}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="property_name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="total_revenue"
                                        fill="#3b82f6"
                                        name="Pendapatan"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Status Distribution & Recent Transactions */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Payment Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Status Pembayaran</CardTitle>
                            <CardDescription>
                                Breakdown pembayaran berdasarkan status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paymentStatusDistribution.map((item, index) => (
                                    <div
                                        key={item.status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[index % COLORS.length],
                                                }}
                                            />
                                            <span className="text-sm font-medium">
                                                {statusLabels[item.status] ||
                                                    item.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {formatCurrency(item.total)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.count} transaksi
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaksi Terbaru</CardTitle>
                            <CardDescription>
                                10 pembayaran terakhir dalam periode ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentTransactions.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-4">
                                        Belum ada transaksi
                                    </p>
                                ) : (
                                    recentTransactions.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between border-b pb-2 last:border-0"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {payment.bill?.tenant?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payment.payment_number} •{' '}
                                                    {formatDate(payment.payment_date)}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
