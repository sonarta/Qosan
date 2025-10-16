import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    LayoutGrid,
    Building2,
    DoorOpen,
    Users,
    Receipt,
    CreditCard,
    Settings,
    Search,
    Plus,
    TrendingUp,
    Crown,
    MapPinHouse,
    FileText,
    type LucideIcon,
} from 'lucide-react';
import axios from 'axios';

interface SearchResult {
    type: 'property' | 'tenant' | 'bill' | 'payment' | 'owner';
    id: number;
    title: string;
    subtitle?: string;
    url: string;
}

interface NavigationItem {
    title: string;
    url: string;
    icon: LucideIcon;
    keywords?: string[];
}

interface QuickAction {
    title: string;
    url: string;
    icon: LucideIcon;
    keywords?: string[];
}

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Navigation items
    const navigationItems: NavigationItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
            keywords: ['home', 'overview'],
        },
        {
            title: 'Properties',
            url: '/properties',
            icon: Building2,
            keywords: ['kost', 'property', 'properti'],
        },
        {
            title: 'Rooms',
            url: '/rooms',
            icon: DoorOpen,
            keywords: ['kamar', 'room'],
        },
        {
            title: 'Tenants',
            url: '/tenants',
            icon: Users,
            keywords: ['penyewa', 'tenant'],
        },
        {
            title: 'Bills',
            url: '/bills',
            icon: Receipt,
            keywords: ['tagihan', 'invoice', 'bill'],
        },
        {
            title: 'Payments',
            url: '/payments',
            icon: CreditCard,
            keywords: ['pembayaran', 'payment'],
        },
        {
            title: 'Finance Report',
            url: '/finance/reports',
            icon: TrendingUp,
            keywords: ['laporan', 'report', 'keuangan'],
        },
        {
            title: 'Subscription',
            url: '/subscription',
            icon: Crown,
            keywords: ['paket', 'langganan'],
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings,
            keywords: ['pengaturan', 'setting'],
        },
    ];

    // Admin navigation items
    const adminNavigationItems: NavigationItem[] = [
        {
            title: 'Admin Dashboard',
            url: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Owners Management',
            url: '/admin/owners',
            icon: Users,
            keywords: ['owner', 'pemilik'],
        },
        {
            title: 'All Properties',
            url: '/admin/properties',
            icon: MapPinHouse,
        },
        {
            title: 'Subscription Packages',
            url: '/admin/packages',
            icon: Crown,
            keywords: ['paket'],
        },
        {
            title: 'Revenue Report',
            url: '/admin/revenue-report',
            icon: TrendingUp,
            keywords: ['revenue', 'pendapatan'],
        },
        {
            title: 'Platform Analytics',
            url: '/admin/platform-analytics',
            icon: TrendingUp,
            keywords: ['analytics', 'analitik'],
        },
        {
            title: 'Churn Analysis',
            url: '/admin/churn-analysis',
            icon: TrendingUp,
            keywords: ['churn', 'retention'],
        },
    ];

    // Quick actions
    const quickActions: QuickAction[] = [
        {
            title: 'Create New Property',
            url: '/properties/create',
            icon: Plus,
            keywords: ['add', 'new', 'tambah', 'properti'],
        },
        {
            title: 'Add New Room',
            url: '/rooms/create',
            icon: Plus,
            keywords: ['add', 'new', 'tambah', 'kamar'],
        },
        {
            title: 'Add New Tenant',
            url: '/tenants/create',
            icon: Plus,
            keywords: ['add', 'new', 'tambah', 'penyewa'],
        },
        {
            title: 'Create Bill',
            url: '/bills/create',
            icon: Plus,
            keywords: ['add', 'new', 'tambah', 'tagihan'],
        },
    ];

    // Keyboard shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Search API
    useEffect(() => {
        if (search.length < 2) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setLoading(true);
            axios
                .get('/api/search', { params: { q: search } })
                .then((response) => {
                    setSearchResults(response.data.results || []);
                })
                .catch((error) => {
                    console.error('Search error:', error);
                    setSearchResults([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSelect = (url: string) => {
        setOpen(false);
        setSearch('');
        router.visit(url);
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'property':
                return Building2;
            case 'tenant':
                return Users;
            case 'bill':
                return Receipt;
            case 'payment':
                return CreditCard;
            case 'owner':
                return Users;
            default:
                return FileText;
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
                <Search className="h-4 w-4" />
                <span>Search</span>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type to search or navigate..."
                    value={search}
                    onValueChange={setSearch}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? 'Searching...' : 'No results found.'}
                    </CommandEmpty>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <>
                            <CommandGroup heading="Search Results">
                                {searchResults.map((result) => {
                                    const Icon = getResultIcon(result.type);
                                    return (
                                        <CommandItem
                                            key={`${result.type}-${result.id}`}
                                            onSelect={() => handleSelect(result.url)}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{result.title}</span>
                                                {result.subtitle && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {result.subtitle}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    )}

                    {/* Quick Actions */}
                    {search.length === 0 && (
                        <CommandGroup heading="Quick Actions">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <CommandItem
                                        key={action.url}
                                        onSelect={() => handleSelect(action.url)}
                                        keywords={action.keywords}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span>{action.title}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}

                    {/* Navigation */}
                    <CommandGroup heading="Navigation">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <CommandItem
                                    key={item.url}
                                    onSelect={() => handleSelect(item.url)}
                                    keywords={item.keywords}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>

                    {/* Admin Navigation */}
                    <CommandGroup heading="Admin">
                        {adminNavigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <CommandItem
                                    key={item.url}
                                    onSelect={() => handleSelect(item.url)}
                                    keywords={item.keywords}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
