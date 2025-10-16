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
        href: '/admin/owners',
        icon: UsersRound,
        items: [
            {
                title: 'Semua Owners',
                href: '/admin/owners',
            },
            {
                title: 'Owners Aktif',
                href: '/admin/owners?status=active',
            },
            {
                title: 'Owners Suspended',
                href: '/admin/owners?status=suspended',
            },
            {
                title: 'Pending Approval',
                href: '/admin/owners?status=pending',
            }
        ],
    },
    {
        title: 'Properti',
        href: '/admin/properties',
        icon: MapPinHouse,
    },
     {
        title: 'Penyewa',
        href: '/admin/tenants',
        icon: House,
    }
];

const subscriptionNavItems: NavItem[] = [
   {
        title: 'Paket Langganan',
        href: '/admin/packages',
        icon: Receipt,
        items: [
            {
                title: 'Daftar Paket',
                href: '/admin/packages',
            },
            {
                title: 'Buat Paket Baru',
                href: '/admin/packages/create',
            }
        ],
    },
    {
        title: 'Subscriptions',
        href: '/admin/subscriptions',
        icon: Crown,
        items: [
            {
                title: 'Semua Subscriptions',
                href: '/admin/subscriptions',
            },
            {
                title: 'Aktif',
                href: '/admin/subscriptions?status=active',
            },
            {
                title: 'Akan Expire',
                href: '/admin/subscriptions?status=expiring',
            },
            {
                title: 'Expired',
                href: '/admin/subscriptions?status=expired',
            }
        ],
    },
    {
        title: 'Payment History',
        href: '/admin/payments',
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
