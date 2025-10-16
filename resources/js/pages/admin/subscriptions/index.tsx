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
import { Search, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Monitoring Subscription', href: '/admin/subscriptions' },
];

interface Subscription {
    id: number;
    plan_name: string;
    max_properties: number;
    max_rooms: number;
    start_date: string;
    end_date: string | null;
    status: string;
    user: {
        name: string;
        email: string;
    };
    properties_count: number;
    rooms_count: number;
}

interface SubscriptionsIndexProps {
    subscriptions: {
        data: Subscription[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: {
        total: number;
        active: number;
        expired: number;
        expiring_soon: number;
    };
    planDistribution: Array<{
        plan_name: string;
        count: number;
    }>;
    filters: {
        search?: string;
        status?: string;
        plan?: string;
    };
}

export default function SubscriptionsIndex({ subscriptions, stats, planDistribution, filters }: SubscriptionsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [plan, setPlan] = useState(filters.plan || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/subscriptions',
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
                plan: plan === 'all' ? undefined : plan,
            },
            { preserveState: true }
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getUsagePercentage = (current: number, max: number) => {
        if (max === 0) return 0;
        return Math.round((current / max) * 100);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Aktif</Badge>;
            case 'expired':
                return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Expired</Badge>;
            case 'cancelled':
                return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring Subscription" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Monitoring Subscription</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor semua subscription dan usage
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Akan Expire</CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.expiring_soon}</div>
                            <p className="text-xs text-muted-foreground">7 hari ke depan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.expired}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Plan Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Paket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {planDistribution.map((item) => (
                                <div key={item.plan_name} className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm font-medium capitalize">{item.plan_name}</span>
                                    <span className="text-2xl font-bold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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
                                    placeholder="Cari owner..."
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
                                    <SelectItem value="expiring">Akan Expire</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={plan} onValueChange={setPlan}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Paket</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
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
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Usage Properti</TableHead>
                                    <TableHead>Usage Kamar</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data subscription
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.data.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{sub.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{sub.plan_name}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {sub.properties_count}/{sub.max_properties}
                                                    </span>
                                                    <Badge 
                                                        variant={getUsagePercentage(sub.properties_count, sub.max_properties) >= 80 ? 'destructive' : 'outline'}
                                                    >
                                                        {getUsagePercentage(sub.properties_count, sub.max_properties)}%
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {sub.rooms_count}/{sub.max_rooms}
                                                    </span>
                                                    <Badge 
                                                        variant={getUsagePercentage(sub.rooms_count, sub.max_rooms) >= 80 ? 'destructive' : 'outline'}
                                                    >
                                                        {getUsagePercentage(sub.rooms_count, sub.max_rooms)}%
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(sub.start_date)}</p>
                                                    {sub.end_date && (
                                                        <p className="text-muted-foreground">- {formatDate(sub.end_date)}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {subscriptions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {subscriptions.links.map((link, index) => (
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
