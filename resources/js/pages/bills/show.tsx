import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Bill } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, FileText, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tagihan',
        href: '/bills',
    },
    {
        title: 'Detail Tagihan',
        href: '#',
    },
];

interface BillShowProps {
    bill: Bill;
}

export default function BillShow({ bill }: BillShowProps) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
            unpaid: { variant: 'secondary', label: 'Belum Lunas' },
            paid: { variant: 'default', label: 'Lunas' },
            overdue: { variant: 'destructive', label: 'Jatuh Tempo' },
            cancelled: { variant: 'outline', label: 'Dibatalkan' },
        };
        const config = variants[status] || variants.unpaid;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleMarkAsPaid = () => {
        if (confirm('Tandai tagihan ini sebagai lunas?')) {
            router.patch(`/bills/${bill.id}/mark-paid`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tagihan ${bill.bill_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Tagihan</h1>
                        <p className="text-sm text-muted-foreground">
                            {bill.bill_number}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <a href={`/bills/${bill.id}/pdf`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </a>
                        {bill.status === 'unpaid' && (
                            <Button onClick={handleMarkAsPaid}>
                                Tandai Lunas
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Tagihan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nomor Tagihan</p>
                                    <p className="font-medium">{bill.bill_number}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Tagihan</p>
                                <p className="font-medium">{formatDate(bill.bill_date)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                                <p className="font-medium">{formatDate(bill.due_date)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Periode</p>
                                <p className="font-medium">
                                    {formatDate(bill.period_start)} - {formatDate(bill.period_end)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <div className="mt-1">{getStatusBadge(bill.status)}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penyewa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Penyewa</p>
                                <p className="font-medium">{bill.tenant?.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Telepon</p>
                                <p className="font-medium">{bill.tenant?.phone}</p>
                            </div>

                            {bill.tenant?.email && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{bill.tenant.email}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">Kamar</p>
                                <p className="font-medium">{bill.tenant?.room?.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Properti</p>
                                <p className="font-medium">{bill.tenant?.room?.property?.name}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Tagihan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-left font-medium">Deskripsi</th>
                                        <th className="pb-3 text-right font-medium">Jumlah</th>
                                        <th className="pb-3 text-right font-medium">Harga</th>
                                        <th className="pb-3 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bill.items?.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-3">{item.description}</td>
                                            <td className="py-3 text-right">{item.quantity}</td>
                                            <td className="py-3 text-right">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="py-3 text-right font-medium">
                                                {formatCurrency(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2">
                                        <td colSpan={3} className="py-4 text-right font-bold">
                                            TOTAL:
                                        </td>
                                        <td className="py-4 text-right text-xl font-bold text-primary">
                                            {formatCurrency(bill.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {bill.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{bill.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
