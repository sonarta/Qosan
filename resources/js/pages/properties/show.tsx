import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Property } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface PropertyShowProps {
    property: Property;
}

export default function PropertyShow({ property }: PropertyShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Properti',
            href: '/properties',
        },
        {
            title: property.name,
            href: `/properties/${property.id}`,
        },
    ];

    const getStatusVariant = (status: Property['status']) => {
        const variants: Record<Property['status'], 'default' | 'secondary' | 'destructive'> = {
            draft: 'secondary',
            active: 'default',
            inactive: 'destructive',
        };

        return variants[status] ?? 'default';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={property.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{property.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Detail informasi properti dan status pengelolaan
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(property.status)}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </Badge>
                        <Link href={`/properties/${property.id}/edit`}>
                            <Button variant="outline">Edit Properti</Button>
                        </Link>
                    </div>
                </div>

                {property.images && property.images.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {property.images.map((image) => (
                            <div key={image.id} className="relative overflow-hidden rounded-lg border">
                                <img
                                    src={image.url}
                                    alt={image.filename}
                                    className="h-48 w-full object-cover"
                                />
                                {image.is_primary && (
                                    <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                                        Foto Utama
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Properti</CardTitle>
                            <CardDescription>
                                Informasi dasar dan deskripsi properti
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">Tipe</h2>
                                <p className="text-base">{property.type || '-'}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">Total Unit</h2>
                                <p className="text-base">{property.total_units ?? '-'}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">Deskripsi</h2>
                                <p className="text-base whitespace-pre-line">
                                    {property.description || 'Belum ada deskripsi.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Alamat & Lokasi</CardTitle>
                            <CardDescription>
                                Informasi lokasi properti dan pemilik
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">Alamat</h2>
                                <p className="text-base">
                                    {property.address_line1}
                                    {property.address_line2 && (
                                        <>
                                            <br />
                                            {property.address_line2}
                                        </>
                                    )}
                                    <br />
                                    {property.city}
                                    {property.state && `, ${property.state}`}
                                    <br />
                                    {property.postal_code}
                                    <br />
                                    {property.country}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">Pemilik</h2>
                                <p className="text-base">
                                    {property.owner?.name || 'Tidak diketahui'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Link href="/properties">
                        <Button variant="ghost">Kembali</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
