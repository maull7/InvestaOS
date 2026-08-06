import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

type TopBarProps = { onMenuOpen: () => void };

export default function TopBar({ onMenuOpen }: TopBarProps) {
    const [isDark, setIsDark] = useState(
        () =>
            typeof window !== 'undefined' &&
            document.documentElement.classList.contains('dark'),
    );

    const toggleTheme = () => {
        const next = !isDark;
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        setIsDark(next);
    };

    return (
        <header className="sticky top-0 z-30 flex w-full shrink-0 items-center justify-between border-b border-dashboard-outline-variant/40 bg-dashboard-surface-bright/90 bg-gradient-to-r from-dashboard-primary/10 to-dashboard-secondary/10 px-4 py-4 backdrop-blur-md md:px-6 md:py-5 dark:border-white/10 dark:bg-dashboard-inverse-surface/90 dark:from-dashboard-primary/15 dark:to-dashboard-secondary/15">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    aria-label="Open menu"
                    onClick={onMenuOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-dashboard-outline-variant/30 text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-low lg:hidden dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                >
                    <Icon name="menu" />
                </button>
                <h2 className="font-headline text-3xl font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                    Dashboard
                </h2>
            </div>
            <div className="hidden flex-1 px-4 lg:block lg:px-6">
                <div className="relative">
                    <Icon
                        name="search"
                        size="text-sm"
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full rounded-full border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low py-2 pr-4 pl-9 text-sm text-dashboard-on-surface transition-colors placeholder:text-dashboard-on-surface-variant/50 focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface dark:placeholder:text-dashboard-surface-variant/40"
                    />
                </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
                <Button
                    variant="light"
                    className="cursor-pointer p-2 dark:bg-dashboard-inverse-surface/45 dark:text-yellow-500 dark:hover:bg-white/10"
                    type="button"
                    aria-label="Toggle dark mode"
                    onClick={toggleTheme}
                >
                    <Icon
                        name={isDark ? 'light_mode' : 'dark_mode'}
                        className="text-xl"
                    />
                </Button>

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-dashboard-background px-3 py-2 text-left text-sm font-semibold text-dashboard-error transition-colors hover:bg-slate-300 dark:bg-dashboard-inverse-surface dark:text-red-600 dark:hover:bg-white/10"
                >
                    <Icon name="logout" size="text-[18px]" />
                    Logout
                </Link>
            </div>
        </header>
    );
}
