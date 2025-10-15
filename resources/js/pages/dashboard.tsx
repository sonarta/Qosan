import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Building2,
    DoorOpen,
    TrendingUp,
    Users,
    Clock,
    Home,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        totalProperties: number;
        totalRooms: number;
        activeTenants: number;
        monthlyRevenue: number;
    };
    occupancyData: {
        occupied: number;
        available: number;
        maintenance: number;
    };
    recentActivities: Array<{
        type: string;
        title: string;
        description: string;
        timestamp: string;
    }>;
    urgentBills: any[];
}

export default function Dashboard({
    stats,
    occupancyData,
    recentActivities,
    urgentBills,
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const totalRooms =
        occupancyData.occupied + occupancyData.available + occupancyData.maintenance;
    const occupancyRate =
        totalRooms > 0 ? ((occupancyData.occupied / totalRooms) * 100).toFixed(1) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Properti
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProperties}</div>
                            <p className="text-xs text-muted-foreground">
                                Properti kos terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kamar
                            </CardTitle>
                            <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalRooms}</div>
                            <p className="text-xs text-muted-foreground">
                                {occupancyData.occupied} terisi, {occupancyData.available}{' '}
                                tersedia
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Penyewa Aktif
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeTenants}</div>
                            <p className="text-xs text-muted-foreground">
                                Penyewa saat ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pendapatan Bulanan
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.monthlyRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dari kamar terisi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Occupancy Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tingkat Okupansi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{occupancyRate}%</div>
                                    <p className="text-sm text-muted-foreground">
                                        Tingkat hunian
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500" />
                                            <span className="text-sm">Terisi</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {occupancyData.occupied} kamar
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                                            <span className="text-sm">Tersedia</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {occupancyData.available} kamar
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-orange-500" />
                                            <span className="text-sm">Maintenance</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {occupancyData.maintenance} kamar
                                        </span>
                                    </div>
                                </div>

                                {/* Simple bar visualization */}
                                <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                                    <div className="flex h-full">
                                        <div
                                            className="bg-green-500"
                                            style={{
                                                width: `${(occupancyData.occupied / totalRooms) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="bg-blue-500"
                                            style={{
                                                width: `${(occupancyData.available / totalRooms) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="bg-orange-500"
                                            style={{
                                                width: `${(occupancyData.maintenance / totalRooms) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Clock className="h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Belum ada aktivitas
                                        </p>
                                    </div>
                                ) : (
                                    recentActivities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 border-b pb-3 last:border-0"
                                        >
                                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                {activity.type === 'tenant_added' ? (
                                                    <Users className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <Home className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.description}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {activity.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Urgent Bills Placeholder */}
                {urgentBills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tagihan Mendesak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Fitur tagihan akan diimplementasikan
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
