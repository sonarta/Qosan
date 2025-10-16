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
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    TrendingDown,
    Users,
    AlertTriangle,
    UserX,
    Clock,
    Mail,
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
    { title: 'Churn Analysis', href: '/admin/churn-analysis' },
];

interface ChurnAnalysisProps {
    ownerChurnMetrics: {
        total_owners: number;
        active_owners: number;
        churned_owners: number;
        churn_rate: number;
        suspended_owners: number;
        expired_subscriptions: number;
    };
    tenantChurnMetrics: {
        total_tenants: number;
        active_tenants: number;
        churned_tenants: number;
        churn_rate: number;
        recent_churn_30_days: number;
        avg_tenant_lifetime_days: number;
    };
    churnTrend: Array<{
        month: string;
        owner_churn: number;
        tenant_churn: number;
    }>;
    churnByPlan: Array<{
        plan: string;
        total: number;
        churned: number;
        active: number;
        churn_rate: number;
    }>;
    retentionMetrics: {
        owner_retention_rate: number;
        tenant_retention_rate: number;
        period: string;
    };
    atRiskOwners: Array<{
        id: number;
        name: string;
        email: string;
        plan: string;
        end_date: string;
        days_until_expiry: number;
    }>;
    churnedOwners: Array<{
        id: number;
        name: string;
        email: string;
        status: string;
        last_plan: string;
        joined_date: string;
    }>;
    tenantTurnoverByProperty: Array<{
        property_name: string;
        total_tenants: number;
        churned_tenants: number;
        active_tenants: number;
        turnover_rate: number;
    }>;
    churnReasons: Array<{
        reason: string;
        count: number;
        percentage: number;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ChurnAnalysis({
    ownerChurnMetrics,
    tenantChurnMetrics,
    churnTrend,
    churnByPlan,
    retentionMetrics,
    atRiskOwners,
    churnedOwners,
    tenantTurnoverByProperty,
    churnReasons,
}: ChurnAnalysisProps) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
            active: 'default',
            suspended: 'destructive',
            expired: 'secondary',
        };
        return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getDaysUntilExpiryBadge = (days: number) => {
        if (days <= 7) {
            return <Badge variant="destructive">{days} days</Badge>;
        } else if (days <= 15) {
            return <Badge variant="default">{days} days</Badge>;
        } else {
            return <Badge variant="secondary">{days} days</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Churn Analysis" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Churn Analysis</h1>
                    <p className="text-muted-foreground">
                        Monitor customer churn and retention metrics
                    </p>
                </div>

                {/* Churn Metrics Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Owner Churn Rate
                            </CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">
                                {ownerChurnMetrics.churn_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {ownerChurnMetrics.churned_owners} churned owners
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tenant Churn Rate
                            </CardTitle>
                            <UserX className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">
                                {tenantChurnMetrics.churn_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {tenantChurnMetrics.recent_churn_30_days} in last 30 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Owner Retention
                            </CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                                {retentionMetrics.owner_retention_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last {retentionMetrics.period}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg Tenant Lifetime
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tenantChurnMetrics.avg_tenant_lifetime_days}
                            </div>
                            <p className="text-xs text-muted-foreground">days</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Churn Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Churn Trend</CardTitle>
                        <CardDescription>Monthly churn over the last 12 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={churnTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="owner_churn"
                                    stroke="#ff6b6b"
                                    strokeWidth={2}
                                    name="Owner Churn"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="tenant_churn"
                                    stroke="#ffa94d"
                                    strokeWidth={2}
                                    name="Tenant Churn"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Churn by Plan & Reasons */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Churn by Subscription Plan</CardTitle>
                            <CardDescription>Churn rate across different plans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={churnByPlan}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="plan" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="active" fill="#82ca9d" name="Active" />
                                    <Bar dataKey="churned" fill="#ff6b6b" name="Churned" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Churn Reasons</CardTitle>
                            <CardDescription>Why customers are leaving</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={churnReasons}
                                        dataKey="count"
                                        nameKey="reason"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry) => `${entry.percentage}%`}
                                    >
                                        {churnReasons.map((entry, index) => (
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
                </div>

                {/* At-Risk Owners */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    At-Risk Owners
                                </CardTitle>
                                <CardDescription>
                                    Subscriptions expiring in the next 30 days
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Retention Email
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Days Left</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {atRiskOwners.map((owner) => (
                                    <TableRow key={owner.id}>
                                        <TableCell className="font-medium">
                                            {owner.name}
                                        </TableCell>
                                        <TableCell>{owner.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{owner.plan}</Badge>
                                        </TableCell>
                                        <TableCell>{owner.end_date}</TableCell>
                                        <TableCell>
                                            {getDaysUntilExpiryBadge(owner.days_until_expiry)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                Contact
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Churned Owners & Tenant Turnover */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recently Churned Owners</CardTitle>
                            <CardDescription>Owners who left the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Last Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {churnedOwners.slice(0, 5).map((owner) => (
                                        <TableRow key={owner.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{owner.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {owner.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{owner.last_plan}</Badge>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(owner.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Turnover by Property</CardTitle>
                            <CardDescription>Properties with highest turnover</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead className="text-right">Churned</TableHead>
                                        <TableHead className="text-right">Rate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenantTurnoverByProperty.slice(0, 5).map((property, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {property.property_name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {property.churned_tenants}/{property.total_tenants}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={
                                                        property.turnover_rate > 50
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {property.turnover_rate}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
