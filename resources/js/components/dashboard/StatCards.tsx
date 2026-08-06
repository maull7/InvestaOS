import Icon from '@/components/ui/Icon';
import { statItems } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import Card from './Card';

const cardVariants = ['gradient', 'primary', 'secondary', 'light'] as const;

const iconChip = (variant: (typeof cardVariants)[number]) =>
    variant === 'light'
        ? 'bg-dashboard-primary/10 text-dashboard-primary dark:bg-dashboard-primary-fixed/20 dark:text-dashboard-primary-fixed-dim'
        : 'bg-white/20 text-white';

const valueText = (variant: (typeof cardVariants)[number]) =>
    variant === 'light'
        ? 'text-dashboard-on-surface dark:text-dashboard-inverse-on-surface'
        : 'text-white';

const labelText = (variant: (typeof cardVariants)[number]) =>
    variant === 'light'
        ? 'text-dashboard-on-surface-variant dark:text-dashboard-surface-variant'
        : 'text-white/80';

export default function StatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map((item, i) => {
                const variant = cardVariants[i % cardVariants.length];

                return (
                    <Card key={item.id} variant={variant} className="p-5">
                        <div className="flex items-center justify-between">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full',
                                    iconChip(variant),
                                )}
                            >
                                <Icon name={item.icon} size="text-[20px]" />
                            </div>
                            <span
                                className={cn(
                                    'flex items-center rounded-full px-2 py-0.5 text-xs font-bold',
                                    item.trend === 'up'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
                                )}
                            >
                                <Icon
                                    name="arrow_drop_up"
                                    size="text-[14px]"
                                    className={
                                        item.trend === 'down'
                                            ? 'rotate-180'
                                            : ''
                                    }
                                />
                                {item.change}
                            </span>
                        </div>
                        <p
                            className={cn(
                                'mt-4 font-headline text-2xl font-bold tracking-tight',
                                valueText(variant),
                            )}
                        >
                            {item.value}
                        </p>
                        <p
                            className={cn(
                                'font-body mt-0.5 text-label-sm',
                                labelText(variant),
                            )}
                        >
                            {item.label}
                        </p>
                    </Card>
                );
            })}
        </div>
    );
}
