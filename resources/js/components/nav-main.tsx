import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function NavMain({
    items = [],
    label = 'General'
}: {
    items: NavItem[];
    label?: string;
}) {
    const page = usePage();
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/70">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1 px-2">
                {items.map((item) => {
                    const hasSubItems = (item.items?.length ?? 0) > 0;
                    const isActiveDirect = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );
                    const isActiveChild = hasSubItems
                        ? item.items?.some((subItem: NavItem) =>
                              page.url.startsWith(
                                  typeof subItem.href === 'string'
                                      ? subItem.href
                                      : subItem.href.url,
                              ),
                          ) ?? false
                        : false;
                    const isActive = isActiveDirect || isActiveChild;

                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={{ children: item.title }}
                                            isActive={isActive}
                                            className="group h-9 px-3 text-sm data-[state=open]:bg-sidebar-accent/70 data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            {item.icon && <item.icon className="h-5 w-5" />}
                                            <span className="font-medium">{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="grid overflow-hidden px-1 pb-1 transition-all duration-200 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]">
                                        <div className="overflow-hidden">
                                            <SidebarMenuSub className="mt-1 border-l border-sidebar-border/60 pl-3">
                                                {item.items?.map((subItem: NavItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={page.url.startsWith(
                                                        typeof subItem.href === 'string'
                                                            ? subItem.href
                                                            : subItem.href.url,
                                                    )} className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground">
                                                        <Link href={subItem.href} prefetch>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </div>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                size="lg"
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="h-9 px-3 text-sm"
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    <span className="font-medium">{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                    {item.hasChevron && (
                                        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
