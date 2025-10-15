import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: string | number;
    hasChevron?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PropertyImage {
    id: number;
    property_id: number;
    path: string;
    filename: string;
    order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Property {
    id: number;
    owner_id: number;
    name: string;
    slug: string;
    type?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    total_units: number;
    description?: string;
    status: 'draft' | 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    owner?: User;
    images?: PropertyImage[];
    rooms?: Room[];
    rooms_count?: number;
}

export interface RoomImage {
    id: number;
    room_id: number;
    path: string;
    filename: string;
    order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: number;
    property_id: number;
    name: string;
    slug: string;
    type?: string;
    floor?: number;
    size?: number;
    capacity: number;
    price: number;
    status: 'available' | 'occupied' | 'maintenance';
    description?: string;
    created_at: string;
    updated_at: string;
    property?: Property;
    images?: RoomImage[];
}

export interface Tenant {
    id: number;
    room_id: number;
    name: string;
    email?: string;
    phone: string;
    id_card_number?: string;
    address?: string;
    check_in_date: string;
    check_out_date?: string;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
    room?: Room;
}

export interface BillItem {
    id: number;
    bill_id: number;
    description: string;
    amount: number;
    quantity: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface Bill {
    id: number;
    tenant_id: number;
    bill_number: string;
    bill_date: string;
    due_date: string;
    period_start: string;
    period_end: string;
    subtotal: number;
    total: number;
    status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
    tenant?: Tenant;
    items?: BillItem[];
    payments?: Payment[];
}

export interface Payment {
    id: number;
    bill_id: number;
    payment_number: string;
    amount: number;
    payment_date: string;
    payment_method?: string;
    proof_image?: string;
    status: 'pending' | 'confirmed' | 'rejected';
    notes?: string;
    confirmed_at?: string;
    confirmed_by?: number;
    created_at: string;
    updated_at: string;
    bill?: Bill;
    confirmedBy?: User;
}

export interface BillingSetting {
    id: number;
    auto_generate_enabled: boolean;
    generation_day: number;
    due_days: number;
    send_email_notification: boolean;
    send_sms_notification: boolean;
    email_template?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
