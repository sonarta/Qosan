import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Payment } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, X, Eye } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pembayaran', href: '/payments' },
    { title: 'Menunggu Konfirmasi', href: '/payments/pending/list' },
];

interface PendingPaymentsProps {
    pendingPayments: Payment[];
}

export default function PendingPayments({ pendingPayments }: PendingPaymentsProps) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState<'confirm' | 'reject' | null>(null);

    const { data, setData, patch, processing } = useForm({
        notes: '',
    });

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

    const handleOpenModal = (payment: Payment, actionType: 'confirm' | 'reject') => {
        setSelectedPayment(payment);
        setAction(actionType);
        setShowModal(true);
        setData('notes', '');
    };

    const handleConfirm = () => {
        if (!selectedPayment) return;
        
        router.patch(`/payments/${selectedPayment.id}/confirm`, {}, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedPayment(null);
            },
        });
    };

    const handleReject = () => {
        if (!selectedPayment) return;
        
        patch(`/payments/${selectedPayment.id}/reject`, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedPayment(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran Menunggu Konfirmasi" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Pembayaran Menunggu Konfirmasi</h1>
                    <p className="text-sm text-muted-foreground">
                        Review dan konfirmasi pembayaran dari penyewa
                    </p>
                </div>

                {pendingPayments.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                Tidak ada pembayaran yang menunggu konfirmasi
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingPayments.map((payment) => (
                            <Card key={payment.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{payment.payment_number}</CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {payment.bill?.bill_number}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">Menunggu</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium">Penyewa</p>
                                        <p className="text-sm text-muted-foreground">
                                            {payment.bill?.tenant?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {payment.bill?.tenant?.room?.name} - {payment.bill?.tenant?.room?.property?.name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm font-medium">Tanggal</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(payment.payment_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Jumlah</p>
                                            <p className="text-sm font-semibold text-primary">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {payment.payment_method && (
                                        <div>
                                            <p className="text-sm font-medium">Metode</p>
                                            <p className="text-sm text-muted-foreground">{payment.payment_method}</p>
                                        </div>
                                    )}

                                    {payment.proof_image && (
                                        <div>
                                            <p className="text-sm font-medium mb-2">Bukti Transfer</p>
                                            <img
                                                src={`/storage/${payment.proof_image}`}
                                                alt="Bukti Transfer"
                                                className="w-full rounded-lg border cursor-pointer"
                                                onClick={() => window.open(`/storage/${payment.proof_image}`, '_blank')}
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => handleOpenModal(payment, 'confirm')}
                                            className="flex-1"
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Konfirmasi
                                        </Button>
                                        <Button
                                            onClick={() => handleOpenModal(payment, 'reject')}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Tolak
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {action === 'confirm' ? 'Konfirmasi Pembayaran' : 'Tolak Pembayaran'}
                        </DialogTitle>
                        <DialogDescription>
                            {action === 'confirm' 
                                ? 'Apakah Anda yakin ingin mengkonfirmasi pembayaran ini? Status tagihan akan diubah menjadi "Lunas".'
                                : 'Berikan alasan penolakan pembayaran ini.'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 space-y-2">
                                <p className="text-sm"><strong>No. Pembayaran:</strong> {selectedPayment.payment_number}</p>
                                <p className="text-sm"><strong>Tagihan:</strong> {selectedPayment.bill?.bill_number}</p>
                                <p className="text-sm"><strong>Penyewa:</strong> {selectedPayment.bill?.tenant?.name}</p>
                                <p className="text-sm"><strong>Jumlah:</strong> {formatCurrency(selectedPayment.amount)}</p>
                            </div>

                            {action === 'reject' && (
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Alasan Penolakan *</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Masukkan alasan penolakan..."
                                        rows={4}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        {action === 'confirm' ? (
                            <Button onClick={handleConfirm} disabled={processing}>
                                {processing ? 'Memproses...' : 'Ya, Konfirmasi'}
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleReject} 
                                disabled={processing || !data.notes}
                                variant="destructive"
                            >
                                {processing ? 'Memproses...' : 'Tolak Pembayaran'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
