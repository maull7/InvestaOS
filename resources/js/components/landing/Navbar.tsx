import { useEffect, useState } from 'react';

import Icon from '@/components/ui/Icon';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const links = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
];

function useScrollSpy(ids: string[], offset = 100): string | null {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const onScroll = () => {
            const pos = window.scrollY + offset;
            let current: string | null = null;

            for (const id of ids) {
                const el = document.getElementById(id);

                if (el && el.offsetTop <= pos) {
                    current = id;
                }
            }

            setActive(current);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [ids, offset]);

    return active;
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(
        () =>
            typeof window !== 'undefined' &&
            document.documentElement.classList.contains('dark'),
    );
    const active = useScrollSpy(links.map((link) => link.id));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        setIsDark(next);
    };

    return (
        <nav
            className={cn(
                'sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300',
                scrolled
                    ? 'border-landing-outline-variant/40 bg-landing-surface/85 shadow-lg shadow-landing-on-surface/5 dark:border-white/10 dark:bg-landing-inverse-surface/85 dark:shadow-black/20'
                    : 'border-landing-outline-variant/30 bg-landing-surface/60 dark:border-white/5 dark:bg-surface/60',
            )}
        >
            <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 md:px-10">
                <Logo href="#home" />

                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-landing-primary p-1 backdrop-blur-xl md:flex">
                    {links.map((link) => {
                        const activeItem = active === link.id;

                        return (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                className={cn(
                                    'relative rounded-full bg-landing-background px-5 py-2 text-sm font-medium transition-all duration-300',
                                    activeItem
                                        ? 'bg-white/10 text-white shadow-lg'
                                        : 'text-landing-dark hover:text-landing-primary',
                                )}
                            >
                                {link.label}

                                {activeItem && (
                                    <span className="absolute inset-x-4 -bottom-1 h-[2px] rounded-full bg-landing-primary" />
                                )}
                            </a>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Toggle dark mode"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-landing-outline-variant/40 text-landing-on-surface-variant transition-all duration-200 hover:bg-landing-surface-container-low hover:text-landing-primary dark:border-white/15 dark:text-landing-surface-variant dark:hover:bg-white/5 dark:hover:text-landing-inverse-primary"
                    >
                        <Icon
                            name={isDark ? 'light_mode' : 'dark_mode'}
                            className="text-xl"
                        />
                    </button>
                    <a
                        href="/login"
                        className="font-body hidden text-label-md text-landing-on-surface-variant transition-colors duration-200 hover:text-landing-primary md:inline-flex dark:text-landing-surface-variant dark:hover:text-landing-inverse-primary"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="font-body hidden rounded-full border bg-landing-primary px-4 py-2 text-label-md text-landing-on-primary transition-all duration-200 hover:scale-[0.98] hover:border-landing-primary/30 hover:bg-landing-primary/5 hover:text-landing-primary hover:shadow-md hover:shadow-landing-primary/30 md:inline-block"
                    >
                        Register
                    </a>
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-landing-outline-variant/40 text-landing-on-surface transition-colors duration-200 hover:bg-landing-surface-container-low md:hidden dark:border-white/15 dark:text-landing-inverse-on-surface dark:hover:bg-white/5"
                    >
                        <Icon
                            name={menuOpen ? 'close' : 'menu'}
                            className="text-2xl"
                        />
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 md:hidden',
                    menuOpen ? 'max-h-96' : 'max-h-0',
                )}
            >
                <div className="space-y-1 border-t border-landing-outline-variant/30 px-4 py-4 dark:border-white/10">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                                'font-body block rounded-lg px-3 py-2.5 text-label-md transition-colors duration-200',
                                active === link.id
                                    ? 'bg-landing-primary/10 text-landing-primary dark:bg-landing-inverse-primary/10 dark:text-landing-inverse-primary'
                                    : 'text-landing-on-surface-variant hover:bg-landing-surface-container-low hover:text-landing-primary dark:text-landing-surface-variant dark:hover:bg-white/5 dark:hover:text-landing-inverse-primary',
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="flex gap-3 pt-3">
                        <a
                            href="/login"
                            className="font-body flex-1 rounded-full border border-landing-outline-variant/40 px-4 py-2.5 text-center text-label-md text-landing-on-surface-variant dark:border-white/15 dark:text-landing-surface-variant"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="font-body flex-1 rounded-full bg-landing-primary px-4 py-2.5 text-center text-label-md text-landing-on-primary"
                        >
                            Register
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
