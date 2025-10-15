import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type BillingSetting } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan', href: '/settings' },
    { title: 'Tagihan', href: '/settings/billing' },
];

interface BillingSettingsProps {
    settings: BillingSetting;
}

export default function BillingSettings({ settings }: BillingSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        auto_generate_enabled: settings.auto_generate_enabled,
        generation_day: settings.generation_day.toString(),
        due_days: settings.due_days.toString(),
        send_email_notification: settings.send_email_notification,
        send_sms_notification: settings.send_sms_notification,
        email_template: settings.email_template || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/billing');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Tagihan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Pengaturan Tagihan</h1>
                    <p className="text-sm text-muted-foreground">
                        Konfigurasi auto-generate tagihan dan notifikasi
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Auto-Generate Tagihan</CardTitle>
                            <CardDescription>
                                Pengaturan untuk pembuatan tagihan otomatis setiap bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto_generate">Aktifkan Auto-Generate</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tagihan akan dibuat otomatis untuk semua penyewa aktif
                                    </p>
                                </div>
                                <Switch
                                    id="auto_generate"
                                    checked={data.auto_generate_enabled}
                                    onCheckedChange={(checked) =>
                                        setData('auto_generate_enabled', checked)
                                    }
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="generation_day">
                                        Tanggal Generate (1-28)
                                    </Label>
                                    <Input
                                        id="generation_day"
                                        type="number"
                                        min="1"
                                        max="28"
                                        value={data.generation_day}
                                        onChange={(e) =>
                                            setData('generation_day', e.target.value)
                                        }
                                        disabled={!data.auto_generate_enabled}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Tagihan akan dibuat pada tanggal ini setiap bulan
                                    </p>
                                    <InputError message={errors.generation_day} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_days">
                                        Jatuh Tempo (Hari)
                                    </Label>
                                    <Input
                                        id="due_days"
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={data.due_days}
                                        onChange={(e) => setData('due_days', e.target.value)}
                                        disabled={!data.auto_generate_enabled}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Jumlah hari dari tanggal tagihan hingga jatuh tempo
                                    </p>
                                    <InputError message={errors.due_days} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifikasi</CardTitle>
                            <CardDescription>
                                Pengaturan notifikasi untuk penyewa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email_notif">Notifikasi Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Kirim email saat tagihan baru dibuat
                                    </p>
                                </div>
                                <Switch
                                    id="email_notif"
                                    checked={data.send_email_notification}
                                    onCheckedChange={(checked) =>
                                        setData('send_email_notification', checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="sms_notif">Notifikasi SMS</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Kirim SMS saat tagihan baru dibuat
                                    </p>
                                </div>
                                <Switch
                                    id="sms_notif"
                                    checked={data.send_sms_notification}
                                    onCheckedChange={(checked) =>
                                        setData('send_sms_notification', checked)
                                    }
                                />
                            </div>

                            {data.send_email_notification && (
                                <div className="space-y-2">
                                    <Label htmlFor="email_template">Template Email</Label>
                                    <Textarea
                                        id="email_template"
                                        value={data.email_template}
                                        onChange={(e) =>
                                            setData('email_template', e.target.value)
                                        }
                                        placeholder="Template email notifikasi..."
                                        rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Gunakan variabel: {'{tenant_name}'}, {'{bill_number}'}, {'{amount}'}, {'{due_date}'}
                                    </p>
                                    <InputError message={errors.email_template} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
