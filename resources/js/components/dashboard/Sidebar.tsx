import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

import Icon from '@/components/ui/Icon';
import { adminNavSections, investorNavSections } from '@/lib/dashboard';
import type { NavSection } from '@/lib/dashboard';
import { cn } from '@/lib/utils';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { auth } = usePage().props;
    const url = usePage().url.split('?')[0];
    const role = auth.role ?? 'investor';
    const navSections: NavSection[] =
        role === 'admin' ? adminNavSections : investorNavSections;

    return (
        <aside
            className={cn(
                'fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col overflow-y-auto border-r border-dashboard-outline-variant bg-dashboard-surface bg-gradient-to-b from-dashboard-primary/15 via-dashboard-surface to-dashboard-secondary/15 p-6 transition-transform duration-300 lg:static lg:z-20 lg:translate-x-0 dark:border-white/10 dark:bg-dashboard-inverse-surface dark:from-dashboard-primary/25 dark:via-dashboard-inverse-surface dark:to-dashboard-secondary/20',
                open ? 'translate-x-0' : '-translate-x-full',
            )}
        >
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dashboard-primary text-dashboard-on-primary">
                    <Icon name="dataset" />
                </div>
                <div>
                    <h1 className="font-headline text-headline-md leading-tight font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        InvestaOS
                    </h1>
                    <p className="font-dash-mono text-dash-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        Admin Dashboard
                    </p>
                </div>
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={onClose}
                    className="ml-auto rounded-full p-1 text-dashboard-on-surface-variant transition-colors hover:bg-dashboard-surface-container-high lg:hidden dark:text-dashboard-surface-variant dark:hover:bg-white/10"
                >
                    <Icon name="close" size="text-sm" />
                </button>
            </div>

            <div className="flex-1 space-y-2 pb-6">
                {navSections.map((section) => (
                    <div key={section.label ?? 'main'}>
                        {section.label && (
                            <div className="mt-6 mb-2 px-3">
                                <span className="text-xs font-semibold tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                    {section.label}
                                </span>
                            </div>
                        )}
                        {section.items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'group relative mt-1.5 flex items-center gap-4 rounded-full px-4 py-2.5 transition-all duration-200',
                                    item.active ||
                                        item.href === url ||
                                        url.startsWith(`${item.href}/`)
                                        ? 'bg-dashboard-secondary-container font-bold text-dashboard-inverse-surface shadow-sm'
                                        : 'text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high dark:text-dashboard-surface-variant dark:hover:bg-white/10',
                                )}
                            >
                                <Icon
                                    name={item.icon}
                                    size="text-[20px]"
                                    className="transition-all duration-150 group-active:scale-[0.98]"
                                />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="border-t border-dashboard-outline-variant pt-4 dark:border-white/10">
                <div
                    tabIndex={0}
                    className="group relative flex cursor-pointer items-center gap-3 rounded-full bg-dashboard-surface-container-low p-2 transition-colors hover:bg-dashboard-surface-container focus:outline-none dark:bg-white/5 dark:hover:bg-white/10"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dashboard-primary text-sm font-bold text-dashboard-on-primary">
                        {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {auth.user.role}
                        </p>
                        <p className="truncate text-[11px] text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {auth.user.email}
                        </p>
                    </div>
                    <Icon
                        name="unfold_more"
                        size="text-sm"
                        className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant"
                    />
                    <div className="absolute bottom-full left-0 z-50 hidden w-full rounded-2xl bg-dashboard-inverse-on-surface p-2 text-dashboard-on-surface group-focus-within:block group-hover:block dark:bg-dashboard-inverse-surface dark:text-dashboard-inverse-on-surface">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors hover:bg-white/10"
                        >
                            <Icon name="person" size="text-[18px]" />
                            Profile Setting
                        </Link>
                        <div className="my-1 h-px bg-dashboard-inverse-surface hover:bg-slate-300 dark:hover:bg-white/10" />
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-dashboard-error transition-colors hover:bg-slate-300 dark:hover:bg-white/10"
                        >
                            <Icon name="logout" size="text-[18px]" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
