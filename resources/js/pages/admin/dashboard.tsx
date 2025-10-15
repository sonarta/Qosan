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
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Building2,
    DoorOpen,
    DollarSign,
    Crown,
    ArrowUpRight,
} from 'lucide-react';
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
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
];

interface AdminDashboardProps {
    metrics: {
        total_owners: number;
        active_owners: number;
        total_properties: number;
        total_rooms: number;
        occupancy_rate: number;
        current_month_revenue: number;
        revenue_growth: number;
    };
    subscriptionDistribution: Array<{
        plan: string;
        count: number;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
    }>;
    userGrowth: Array<{
        month: string;
        users: number;
    }>;
    recentOwners: Array<any>;
    recentPayments: Array<any>;
    topOwners: Array<{
        name: string;
        email: string;
        total_revenue: number;
        payment_count: number;
    }>;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard({
    metrics,
    subscriptionDistribution,
    monthlyRevenue,
    userGrowth,
    recentOwners,
    recentPayments,
    topOwners,
}: AdminDashboardProps) {
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
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Platform overview dan key metrics
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Owners
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.total_owners}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.active_owners} aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Properti
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.total_properties}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all owners
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Occupancy Rate
                            </CardTitle>
                            <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.occupancy_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.total_rooms} total kamar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue Bulan Ini
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.current_month_revenue)}
                            </div>
                            <div className="flex items-center text-xs">
                                {metrics.revenue_growth >= 0 ? (
                                    <>
                                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                        <span className="text-green-500">
                                            +{metrics.revenue_growth}%
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                                        <span className="text-red-500">
                                            {metrics.revenue_growth}%
                                        </span>
                                    </>
                                )}
                                <span className="ml-1 text-muted-foreground">
                                    vs bulan lalu
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Revenue */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                            <CardDescription>
                                Total revenue 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyRevenue}>
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
                                        name="Revenue"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* User Growth */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Growth</CardTitle>
                            <CardDescription>
                                Pertumbuhan owner 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="users"
                                        fill="#3b82f6"
                                        name="Total Users"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscription Distribution & Top Owners */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Subscription Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Distribution</CardTitle>
                            <CardDescription>
                                Distribusi paket langganan aktif
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {subscriptionDistribution.map((item, index) => (
                                    <div
                                        key={item.plan}
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
                                                {item.plan}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {item.count} users
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Owners */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Owners</CardTitle>
                            <CardDescription>
                                Owner dengan revenue tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topOwners.map((owner, index) => (
                                    <div
                                        key={owner.email}
                                        className="flex items-center justify-between border-b pb-2 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {owner.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {owner.payment_count} pembayaran
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {formatCurrency(owner.total_revenue)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Owners */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Owners</CardTitle>
                            <CardDescription>
                                Owner yang baru bergabung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentOwners.map((owner) => (
                                    <div
                                        key={owner.id}
                                        className="flex items-center justify-between border-b pb-2 last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {owner.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {owner.email}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline">
                                                {owner.subscription?.plan_name || 'No Plan'}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(owner.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Payments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Payments</CardTitle>
                            <CardDescription>
                                Pembayaran terbaru yang dikonfirmasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentPayments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between border-b pb-2 last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {payment.bill?.tenant?.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {payment.bill?.tenant?.room?.property?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(payment.payment_date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
