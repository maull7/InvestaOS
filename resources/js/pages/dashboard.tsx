import { Head } from '@inertiajs/react';

import BalanceChart from '@/components/dashboard/BalanceChart';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import StatCards from '@/components/dashboard/StatCards';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Welcome back, Admin
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Here is an overview of your platform today.
                        </p>
                    </div>

                    <StatCards />
                    <BalanceChart />
                    <RecentTransactions />
                </div>
            </DashboardLayout>
        </>
    );
}
