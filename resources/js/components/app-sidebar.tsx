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
                href: '/tenants/list',
            },
            {
                title: 'Penyewa Aktif',
                href: '/tenants/active',
            },
            {
                title: 'Penyewa Tidak Aktif',
                href: '/tenants/inactive',
            },
        ],
    }
];

const financeNavItems: NavItem[] = [
    {
        title: 'Tagihan',
        href: '/finance/billing',
        icon: Receipt,
        items: [
            {
                title: 'Semua Tagihan',
                href: '/finance/billing',
            },
            {
                title: 'Belum Lunas',
                href: '/finance/billing/unpaid',
            },
            {
                title: 'Jatuh Tempo',
                href: '/finance/billing/due-soon',
            },
            {
                title: 'Sudah Lunas',
                href: '/finance/billing/paid',
            },
        ],
    },
    {
        title: 'Pembayaran',
        href: '/finance/payments',
        icon: HandCoins,
        items: [
            {
                title: 'Riwayat Pembayaran',
                href: '/finance/payments/history',
            },
            {
                title: 'Konfirmasi Pembayaran',
                href: '/finance/payments/confirmations',
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
