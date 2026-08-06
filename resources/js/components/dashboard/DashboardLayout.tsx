import { useEffect, useState } from 'react';

import type { PropsWithChildren } from 'react';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-dashboard-background bg-gradient-to-br from-dashboard-primary/10 to-dashboard-secondary/10 font-dash text-dashboard-on-surface antialiased dark:bg-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    sidebarOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setSidebarOpen(false)}
            />
            <div className="flex w-full flex-1 flex-col overflow-hidden">
                <TopBar onMenuOpen={() => setSidebarOpen(true)} />
                <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-start gap-6 overflow-y-auto p-4 pb-8 md:p-6 lg:grid-cols-12 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
