import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { Sun, Moon, Settings, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { CommandPalette } from '@/components/command-palette';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { useState, useEffect } from 'react';

export function AppSidebarHeader({
    breadcrumbs = [],
    viewMode = 'admin',
    onViewModeChange,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    viewMode?: 'admin' | 'owner';
    onViewModeChange?: (mode: 'admin' | 'owner') => void;
}) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const isAdmin = auth?.user?.role === 'admin';

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    // Get page title from breadcrumbs or URL
    const getPageTitle = () => {
        if (breadcrumbs.length > 0) {
            return breadcrumbs[breadcrumbs.length - 1].title;
        }
        
        // Fallback to URL-based title
        const path = page.url.split('?')[0];
        const segments = path.split('/').filter(Boolean);
        
        if (segments.length === 0) return 'Dashboard';
        
        const lastSegment = segments[segments.length - 1];
        return lastSegment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-6">
                <SidebarTrigger className="-ml-1" />
                
                  {/* Page Title */}
                <div className="hidden md:block">
                    <h1 className="text-sm font-semibold text-foreground">
                        {getPageTitle()}
                    </h1>
                </div>

                {/* Role Switcher for Admin */}
                {isAdmin && onViewModeChange && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-2"
                            >
                                {viewMode === 'admin' ? (
                                    <>
                                        <Shield className="h-4 w-4" />
                                        <span className="hidden sm:inline">Admin View</span>
                                    </>
                                ) : (
                                    <>
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">Owner View</span>
                                    </>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onClick={() => onViewModeChange('admin')}
                                className={cn(
                                    'cursor-pointer',
                                    viewMode === 'admin' && 'bg-accent'
                                )}
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                Admin View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onViewModeChange('owner')}
                                className={cn(
                                    'cursor-pointer',
                                    viewMode === 'owner' && 'bg-accent'
                                )}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Owner View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Command Palette */}
                <div className="hidden sm:block">
                    <CommandPalette />
                </div>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={toggleTheme}
                >
                    {theme === 'light' ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                </Button>

                {/* User Avatar */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-9 w-9 rounded-full p-0"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="text-xs bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
