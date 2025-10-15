import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebar as AppSidebarAdmin } from '@/components/app-sidebar-admin';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    
    // State for view mode (admin can switch between admin and owner view)
    const [viewMode, setViewMode] = useState<'admin' | 'owner'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin_view_mode');
            return (saved as 'admin' | 'owner') || 'admin';
        }
        return 'admin';
    });

    // Save view mode to localStorage
    useEffect(() => {
        if (isAdmin) {
            localStorage.setItem('admin_view_mode', viewMode);
        }
    }, [viewMode, isAdmin]);

    const handleViewModeChange = (mode: 'admin' | 'owner') => {
        setViewMode(mode);
    };

    // Determine which sidebar to show
    const showAdminSidebar = isAdmin && viewMode === 'admin';

    return (
        <AppShell variant="sidebar">
            {showAdminSidebar ? <AppSidebarAdmin /> : <AppSidebar />}
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader 
                    breadcrumbs={breadcrumbs}
                    viewMode={viewMode}
                    onViewModeChange={isAdmin ? handleViewModeChange : undefined}
                />
                {children}
            </AppContent>
        </AppShell>
    );
}
