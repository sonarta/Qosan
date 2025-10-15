import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    MapPinHouse,
    Settings,
    HelpCircle,
    House,
    UsersRound,
    HandCoins,
    Receipt,
    ChartLine,
    Bell
    } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    }
];

const propertyNavItems: NavItem[] = [
    {
        title: 'Properti',
        href: '/properties',
        icon: MapPinHouse,
    },
    {
        title: 'Kamar / Unit',
        href: '/rooms',
        icon: House,
    }
];

const tenantNavItems: NavItem[] = [
   {
        title: 'Penyewa',
        href: '/tenants',
        icon: UsersRound,
        items: [
            {
                title: 'Daftar Penyewa',
                href: '/tenants',
            },
            {
                title: 'Penyewa Aktif',
                href: '/tenants?status=active',
            },
            {
                title: 'Penyewa Tidak Aktif',
                href: '/tenants?status=inactive',
            },
        ],
    }
];

const financeNavItems: NavItem[] = [
    {
        title: 'Tagihan',
        href: '/bills',
        icon: Receipt,
        items: [
            {
                title: 'Semua Tagihan',
                href: '/bills',
            },
            {
                title: 'Belum Lunas',
                href: '/bills?status=unpaid',
            },
            {
                title: 'Jatuh Tempo',
                href: '/bills?status=overdue',
            },
            {
                title: 'Sudah Lunas',
                href: '/bills?status=paid',
            },
        ],
    },
    {
        title: 'Pembayaran',
        href: '/payments',
        icon: HandCoins,
        items: [
            {
                title: 'Riwayat Pembayaran',
                href: '/payments',
            },
            {
                title: 'Menunggu Konfirmasi',
                href: '/payments/pending/list',
            },
        ],
    },
    {
        title: 'Laporan Keuangan',
        href: '/finance/reports',
        icon: ChartLine,
    }
];


const otherNavItems: NavItem[] = [
    {
        title: 'Notifikasi',
        href: '/settings',
        icon: Bell
    },
    {
        title: 'Pengaturan',
        href: '/help',
        icon: Settings,
        hasChevron: true,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="General" />
                <NavMain items={propertyNavItems} label="Properti" />
                <NavMain items={tenantNavItems} label="Penyewa" />
                <NavMain items={financeNavItems} label="Keuangan" />
                <NavMain items={otherNavItems} label="Other" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
