import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { recentTransactions } from '@/lib/dashboard';
import type { TransactionStatus } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import Card from './Card';

const statusTone: Record<TransactionStatus, string> = {
    Success:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    Pending:
        'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    Failed: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

const typeIcon: Record<string, string> = {
    Deposit: 'arrow_forward',
    Withdrawal: 'logout',
    Investment: 'shopping_bag',
};

export default function RecentTransactions() {
    return (
        <Card>
            <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 p-5 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Recent Transactions
                    </h3>
                    <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-bold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                        {recentTransactions.length}
                    </span>
                </div>
                <Button variant="outline" className="px-4 py-1.5 text-xs">
                    View all
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-dashboard-outline-variant/20 text-left text-xs text-dashboard-on-surface-variant dark:border-white/10 dark:text-dashboard-surface-variant">
                            <th className="px-5 py-3 font-medium">User</th>
                            <th className="px-5 py-3 font-medium">Type</th>
                            <th className="px-5 py-3 font-medium">Amount</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="border-b border-dashboard-outline-variant/10 last:border-0 dark:border-white/5"
                            >
                                <td className="px-5 py-3.5 font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    {tx.user}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="flex items-center gap-1.5 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        <Icon
                                            name={typeIcon[tx.type]}
                                            size="text-sm"
                                        />
                                        {tx.type}
                                    </span>
                                </td>
                                <td
                                    className={cn(
                                        'px-5 py-3.5 font-semibold',
                                        tx.amount.startsWith('-')
                                            ? 'text-dashboard-error dark:text-red-400'
                                            : 'text-dashboard-success dark:text-emerald-400',
                                    )}
                                >
                                    {tx.amount}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span
                                        className={cn(
                                            'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                                            statusTone[tx.status],
                                        )}
                                    >
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 whitespace-nowrap text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    {tx.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
