import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Crown, MessageCircle, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Paket Langganan', href: '/subscription' },
];

interface Subscription {
    id: number;
    plan_name: string;
    max_properties: number;
    max_rooms: number;
    start_date: string;
    end_date?: string;
    status: string;
}

interface Plan {
    name: string;
    price: number;
    max_properties: number;
    max_rooms: number;
    features: string[];
}

interface SubscriptionIndexProps {
    subscription: Subscription;
    currentUsage: {
        properties: number;
        rooms: number;
    };
    plans: Record<string, Plan>;
}

export default function SubscriptionIndex({
    subscription,
    currentUsage,
    plans,
}: SubscriptionIndexProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const currentPlan = plans[subscription.plan_name];
    const propertyUsagePercent = (currentUsage.properties / subscription.max_properties) * 100;
    const roomUsagePercent = (currentUsage.rooms / subscription.max_rooms) * 100;

    const handleContactAdmin = () => {
        // Open WhatsApp or contact form
        window.open('https://wa.me/6281234567890?text=Halo, saya ingin upgrade paket langganan', '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paket Langganan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Paket Langganan</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola paket langganan dan upgrade untuk fitur lebih lengkap
                    </p>
                </div>

                {/* Current Plan */}
                <Card className="border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-primary" />
                                    Paket Saat Ini: {currentPlan.name}
                                </CardTitle>
                                <CardDescription>
                                    Status: <Badge variant="default">Aktif</Badge>
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">
                                    {formatCurrency(currentPlan.price)}
                                </p>
                                <p className="text-sm text-muted-foreground">/bulan</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Usage Stats */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Properti</span>
                                    <span className="text-muted-foreground">
                                        {currentUsage.properties} / {subscription.max_properties}
                                    </span>
                                </div>
                                <Progress value={propertyUsagePercent} />
                                {propertyUsagePercent >= 80 && (
                                    <p className="text-xs text-orange-500">
                                        Mendekati batas! Pertimbangkan untuk upgrade.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Kamar</span>
                                    <span className="text-muted-foreground">
                                        {currentUsage.rooms} / {subscription.max_rooms}
                                    </span>
                                </div>
                                <Progress value={roomUsagePercent} />
                                {roomUsagePercent >= 80 && (
                                    <p className="text-xs text-orange-500">
                                        Mendekati batas! Pertimbangkan untuk upgrade.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Current Features */}
                        <div>
                            <h3 className="mb-3 font-semibold">Fitur Paket Anda:</h3>
                            <div className="grid gap-2 md:grid-cols-2">
                                {currentPlan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Available Plans */}
                <div>
                    <h2 className="mb-4 text-xl font-bold">Paket Tersedia</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(plans).map(([key, plan]) => {
                            const isCurrent = key === subscription.plan_name;
                            const isRecommended = key === 'premium';

                            return (
                                <Card
                                    key={key}
                                    className={`relative ${
                                        isCurrent
                                            ? 'border-primary'
                                            : isRecommended
                                              ? 'border-orange-500'
                                              : ''
                                    }`}
                                >
                                    {isRecommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-orange-500">
                                                <Sparkles className="mr-1 h-3 w-3" />
                                                Rekomendasi
                                            </Badge>
                                        </div>
                                    )}
                                    {isCurrent && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge variant="default">Paket Aktif</Badge>
                                        </div>
                                    )}

                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold">
                                                {formatCurrency(plan.price)}
                                            </span>
                                            <span className="text-muted-foreground">/bulan</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleContactAdmin}
                                            disabled={isCurrent}
                                            className="w-full"
                                            variant={isCurrent ? 'secondary' : 'default'}
                                        >
                                            {isCurrent ? (
                                                'Paket Aktif'
                                            ) : (
                                                <>
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    Hubungi Admin
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Info */}
                <Card className="bg-muted">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <h3 className="font-semibold">Butuh Bantuan?</h3>
                            <p className="text-sm text-muted-foreground">
                                Hubungi admin untuk upgrade atau pertanyaan tentang paket
                            </p>
                        </div>
                        <Button onClick={handleContactAdmin}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Hubungi Admin
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
