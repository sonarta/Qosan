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
    Users,
    Building2,
    DoorOpen,
    UserCheck,
    TrendingUp,
    MapPin,
    Activity,
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
    Area,
    AreaChart,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Platform Analytics', href: '/admin/platform-analytics' },
];

interface PlatformAnalyticsProps {
    platformMetrics: {
        total_users: number;
        total_owners: number;
        active_owners: number;
        total_properties: number;
        active_properties: number;
        total_rooms: number;
        occupied_rooms: number;
        total_tenants: number;
        active_tenants: number;
        occupancy_rate: number;
    };
    userGrowthTrend: Array<{
        month: string;
        total_users: number;
        new_users: number;
    }>;
    propertyGrowthTrend: Array<{
        month: string;
        total_properties: number;
        new_properties: number;
    }>;
    subscriptionDistribution: Array<{
        plan: string;
        count: number;
    }>;
    subscriptionTrend: Array<{
        month: string;
        active_subscriptions: number;
    }>;
    activityMetrics: {
        bills_generated_this_month: number;
        payments_this_month: number;
        new_tenants_this_month: number;
        new_properties_this_month: number;
    };
    geographicDistribution: Array<{
        city: string;
        property_count: number;
        room_count: number;
    }>;
    roomTypeDistribution: Array<{
        type: string;
        count: number;
        avg_price: number;
    }>;
    averageMetrics: {
        avg_rooms_per_property: number;
        avg_price_per_room: number;
        avg_occupancy_duration: number;
    };
    paymentMetrics: {
        total_payments: number;
        confirmed_payments: number;
        pending_payments: number;
        rejected_payments: number;
        success_rate: number;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D'];

export default function PlatformAnalytics({
    platformMetrics,
    userGrowthTrend,
    propertyGrowthTrend,
    subscriptionDistribution,
    activityMetrics,
    geographicDistribution,
    roomTypeDistribution,
    averageMetrics,
    paymentMetrics,
}: PlatformAnalyticsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Analytics" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Platform Analytics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive platform performance and usage metrics
                    </p>
                </div>

                {/* Platform Overview Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {platformMetrics.total_users}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {platformMetrics.active_owners} active owners
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Properties
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {platformMetrics.total_properties}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {platformMetrics.active_properties} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Rooms
                            </CardTitle>
                            <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {platformMetrics.total_rooms}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {platformMetrics.occupied_rooms} occupied
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Occupancy Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {platformMetrics.occupancy_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {platformMetrics.active_tenants} active tenants
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Metrics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bills This Month
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activityMetrics.bills_generated_this_month}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Payments This Month
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activityMetrics.payments_this_month}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New Tenants
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activityMetrics.new_tenants_this_month}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New Properties
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activityMetrics.new_properties_this_month}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Growth Trends */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Growth Trend</CardTitle>
                            <CardDescription>Total and new users over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={userGrowthTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="total_users"
                                        stackId="1"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        name="Total Users"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="new_users"
                                        stackId="2"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                        name="New Users"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Property Growth Trend</CardTitle>
                            <CardDescription>Properties added over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={propertyGrowthTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total_properties"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Total Properties"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="new_properties"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="New Properties"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Distribution Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Distribution</CardTitle>
                            <CardDescription>Active subscriptions by plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={subscriptionDistribution}
                                        dataKey="count"
                                        nameKey="plan"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry) => `${entry.plan}: ${entry.count}`}
                                    >
                                        {subscriptionDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Room Type Distribution</CardTitle>
                            <CardDescription>Rooms by type and average price</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={roomTypeDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number, name: string) =>
                                            name === 'avg_price'
                                                ? formatCurrency(value)
                                                : value
                                        }
                                    />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Geographic Distribution & Payment Metrics */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Geographic Distribution</CardTitle>
                            <CardDescription>Top cities by property count</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>City</TableHead>
                                        <TableHead className="text-right">Properties</TableHead>
                                        <TableHead className="text-right">Rooms</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {geographicDistribution.map((city, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {city.city}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {city.property_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {city.room_count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Averages</CardTitle>
                            <CardDescription>Key average metrics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Avg Rooms per Property
                                </span>
                                <span className="text-lg font-semibold">
                                    {averageMetrics.avg_rooms_per_property}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Avg Price per Room
                                </span>
                                <span className="text-lg font-semibold">
                                    {formatCurrency(averageMetrics.avg_price_per_room)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Avg Occupancy Duration
                                </span>
                                <span className="text-lg font-semibold">
                                    {averageMetrics.avg_occupancy_duration} days
                                </span>
                            </div>
                            <div className="mt-6 space-y-2">
                                <h4 className="font-semibold">Payment Success Rate</h4>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Success Rate</span>
                                    <Badge variant="default">
                                        {paymentMetrics.success_rate}%
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Confirmed</span>
                                    <span>{paymentMetrics.confirmed_payments}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Pending</span>
                                    <span>{paymentMetrics.pending_payments}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
