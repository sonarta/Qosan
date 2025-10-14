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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Property, type Room } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kamar / Unit',
        href: '/rooms',
    },
    {
        title: 'Edit Kamar',
        href: '#',
    },
];

interface RoomEditProps {
    room: Room;
    properties: Property[];
}

export default function RoomEdit({ room, properties }: RoomEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        property_id: room.property_id.toString(),
        name: room.name || '',
        type: room.type || '',
        floor: room.floor?.toString() || '',
        size: room.size?.toString() || '',
        capacity: room.capacity.toString(),
        price: room.price.toString(),
        status: room.status,
        description: room.description || '',
        images: [] as File[],
        delete_images: [] as number[],
        _method: 'PUT',
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState(room.images || []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentTotal = existingImages.length + data.images.length;
        const newImages = files.slice(0, 3 - currentTotal);

        if (currentTotal + files.length > 3) {
            alert('Maksimal 3 foto per kamar');
        }

        setData('images', [...data.images, ...newImages]);

        newImages.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = (imageId: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('delete_images', [...data.delete_images, imageId]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/rooms/${room.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${room.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit Kamar</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui informasi kamar {room.name}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="property_id">Properti *</Label>
                                <Select
                                    value={data.property_id}
                                    onValueChange={(value) => setData('property_id', value)}
                                >
                                    <SelectTrigger id="property_id">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.map((property) => (
                                            <SelectItem key={property.id} value={property.id.toString()}>
                                                {property.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.property_id} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Kamar *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipe Kamar</Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="floor">Lantai</Label>
                                    <Input
                                        id="floor"
                                        type="number"
                                        value={data.floor}
                                        onChange={(e) => setData('floor', e.target.value)}
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="size">Ukuran (m²)</Label>
                                    <Input
                                        id="size"
                                        type="number"
                                        value={data.size}
                                        onChange={(e) => setData('size', e.target.value)}
                                        min="1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Kapasitas *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        min="1"
                                    />
                                    <InputError message={errors.capacity} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga per Bulan *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        min="0"
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'available' | 'occupied' | 'maintenance')}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Tersedia</SelectItem>
                                            <SelectItem value="occupied">Terisi</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Foto Kamar</CardTitle>
                            <CardDescription>Upload maksimal 3 foto</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {existingImages.map((image) => (
                                    <div key={image.id} className="relative aspect-square">
                                        <img
                                            src={`/storage/${image.path}`}
                                            alt={image.filename}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -right-2 -top-2 h-6 w-6"
                                            onClick={() => removeExistingImage(image.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        {image.is_primary && (
                                            <div className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                                                Utama
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square">
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -right-2 -top-2 h-6 w-6"
                                            onClick={() => removeNewImage(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {existingImages.length + data.images.length < 3 && (
                                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed">
                                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
