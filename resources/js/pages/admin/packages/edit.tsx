import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Paket Langganan', href: '/admin/packages' },
    { title: 'Edit Paket', href: '#' },
];

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    max_properties: number;
    max_rooms: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
}

interface EditPackageProps {
    package: Package;
}

export default function EditPackage({ package: pkg }: EditPackageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: pkg.name,
        description: pkg.description || '',
        price: pkg.price,
        max_properties: pkg.max_properties,
        max_rooms: pkg.max_rooms,
        features: pkg.features || [''],
        is_active: pkg.is_active,
        sort_order: pkg.sort_order,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/packages/${pkg.id}`);
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Paket - ${pkg.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/packages">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Paket</h1>
                        <p className="text-sm text-muted-foreground">
                            Update paket {pkg.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Paket</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Paket</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp/bulan)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', parseFloat(e.target.value))}
                                    required
                                />
                                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_properties">Max Properti</Label>
                                <Input
                                    id="max_properties"
                                    type="number"
                                    min="1"
                                    value={data.max_properties}
                                    onChange={(e) => setData('max_properties', parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_rooms">Max Kamar</Label>
                                <Input
                                    id="max_rooms"
                                    type="number"
                                    min="1"
                                    value={data.max_rooms}
                                    onChange={(e) => setData('max_rooms', parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Urutan</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Paket Aktif
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Fitur Paket</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder={`Fitur ${index + 1}`}
                                        required
                                    />
                                    {data.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeFeature(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addFeature} className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Fitur
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="md:col-span-2 flex justify-end gap-2">
                        <Link href="/admin/packages">
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
