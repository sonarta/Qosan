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
    House,
    UsersRound,
    HandCoins,
    Receipt,
    ChartLine,
    Crown,
    Settings
    } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    }
];

const userManagementNavItems: NavItem[] = [
   {
        title: 'Owners',
        href: '/owners',
        icon: UsersRound,
        items: [
            {
                title: 'Semua Owners',
                href: '/owners',
            },
            {
                title: 'Owners Aktif',
                href: '/owners/active',
            },
            {
                title: 'Owners Suspended',
                href: '/owners/suspended',
            },
            {
                title: 'Pending Approval',
                href: '/owners/pending',
            }
        ],
    },
    {
        title: 'Properti',
        href: '/properties',
        icon: MapPinHouse,
    },
     {
        title: 'Penyewa',
        href: '/tenants',
        icon: House,
    }
];

const subscriptionNavItems: NavItem[] = [
   {
        title: 'Paket Langganan',
        href: '/packages',
        icon: Receipt,
        items: [
            {
                title: 'Daftar Paket',
                href: '/packages',
            },
            {
                title: 'Buat Paket Baru',
                href: '/packages/create',
            }
        ],
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: Receipt,
        items: [
            {
                title: 'Semua Subscriptions',
                href: '/subscriptions',
            },
            {
                title: 'Aktif',
                href: '/subscriptions/active',
            },
            {
                title: 'Akan Expire',
                href: '/subscriptions/expiring',
            },
            {
                title: 'Expired',
                href: '/subscriptions/expired',
            }
        ],
    },
    {
        title: 'Payment History',
        href: '/payments',
        icon: HandCoins,
    }
];

const financeNavItems: NavItem[] = [
    {
        title: 'Revenue Report',
        href: '/revenue-report',
        icon: ChartLine,
    },
    {
        title: 'Platform Analytics',
        href: '/platform-analytics',
        icon: ChartLine,
    },
    {
        title: 'Churn Analysis',
        href: '/churn-analysis',
        icon: ChartLine,
    },
];


const otherNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        items: [
            {
                title: 'General Settings',
                href: '/settings',
            },
            {
                title: 'Email Templates',
                href: '/settings',
            },
            {
                title: 'Notification Settings',
                href: '/settings',
            }
        ]
    },
    {
        title: 'Activity Logs',
        href: '/activity-logs',
        icon: ChartLine,
    },
    {
        title: 'Admin Users',
        href: '/admin-users',
        icon: Crown,
    }
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
                <NavMain items={userManagementNavItems} label="User Management" />
                <NavMain items={subscriptionNavItems} label="Subscription" />
                <NavMain items={financeNavItems} label="Keuangan" />
                <NavMain items={otherNavItems} label="Other" />
            </SidebarContent>

        </Sidebar>
    );
}
