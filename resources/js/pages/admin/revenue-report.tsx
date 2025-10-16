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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Download,
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
    { title: 'Revenue Report', href: '/admin/revenue-report' },
];

interface RevenueReportProps {
    metrics: {
        current_month_revenue: number;
        last_month_revenue: number;
        revenue_growth: number;
        year_to_date_revenue: number;
        average_revenue_per_owner: number;
    };
    revenueByPlan: Array<{
        plan_name: string;
        total_revenue: number;
        transaction_count: number;
    }>;
    monthlyRevenueTrend: Array<{
        month: string;
        revenue: number;
    }>;
    topOwners: Array<{
        id: number;
        name: string;
        email: string;
        total_revenue: number;
        payment_count: number;
        property_count: number;
    }>;
    revenueByPaymentMethod: Array<{
        method: string;
        total_revenue: number;
        transaction_count: number;
    }>;
    quarterlyComparison: Array<{
        quarter: string;
        revenue: number;
    }>;
    filters: {
        period: string;
        year: number;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function RevenueReport({
    metrics,
    revenueByPlan,
    monthlyRevenueTrend,
    topOwners,
    revenueByPaymentMethod,
    quarterlyComparison,
    filters,
}: RevenueReportProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleYearChange = (year: string) => {
        router.get('/admin/revenue-report', { year }, { preserveState: true });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue Report" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Revenue Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive revenue analysis and insights
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={filters.year.toString()}
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Current Month Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.current_month_revenue)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {metrics.revenue_growth >= 0 ? (
                                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                <span
                                    className={
                                        metrics.revenue_growth >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }
                                >
                                    {metrics.revenue_growth.toFixed(1)}%
                                </span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Year to Date Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.year_to_date_revenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total revenue in {filters.year}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg Revenue per Owner
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.average_revenue_per_owner)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Per active owner
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Last Month Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.last_month_revenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Previous month comparison
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Revenue Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue Trend</CardTitle>
                            <CardDescription>Last 12 months performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyRevenueTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Quarterly Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quarterly Comparison</CardTitle>
                            <CardDescription>Revenue by quarter in {filters.year}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={quarterlyComparison}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="quarter" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Revenue by Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Subscription Plan</CardTitle>
                            <CardDescription>Distribution across plans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={revenueByPlan}
                                        dataKey="total_revenue"
                                        nameKey="plan_name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry) => String(entry.plan_name)}
                                    >
                                        {revenueByPlan.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue by Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Payment Method</CardTitle>
                            <CardDescription>Payment channel breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByPaymentMethod}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="method" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="total_revenue"
                                        fill="#8884d8"
                                        name="Revenue"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Revenue Owners Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Revenue Generating Owners</CardTitle>
                        <CardDescription>
                            Owners with highest revenue contribution
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Properties</TableHead>
                                    <TableHead className="text-right">Payments</TableHead>
                                    <TableHead className="text-right">Total Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topOwners.map((owner) => (
                                    <TableRow key={owner.id}>
                                        <TableCell className="font-medium">
                                            {owner.name}
                                        </TableCell>
                                        <TableCell>{owner.email}</TableCell>
                                        <TableCell className="text-right">
                                            {owner.property_count}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {owner.payment_count}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(owner.total_revenue)}
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
