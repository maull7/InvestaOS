import { cn } from '@/lib/utils';
import Icon from './Icon';

type LogoProps = {
    href?: string;
    size?: 'md' | 'lg';
    className?: string;
};

export default function Logo({ href, size = 'md', className }: LogoProps) {
    const isLink = Boolean(href);
    const badge = size === 'lg' ? 'h-11 w-11 rounded-2xl' : 'h-9 w-9 rounded-xl';
    const text = size === 'lg' ? 'text-2xl' : 'text-headline-md';
    const content = (
        <>
            <span
                className={cn(
                    'flex items-center justify-center bg-landing-primary shadow-md shadow-landing-primary/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110',
                    badge,
                )}
            >
                <Icon
                    name="dataset"
                    className="text-landing-on-primary"
                    size="text-xl"
                />
            </span>
            <span
                className={cn(
                    'font-headline font-bold text-landing-on-surface dark:text-landing-inverse-on-surface',
                    text,
                )}
            >
                Investa<span className="text-landing-primary">OS</span>
            </span>
        </>
    );

    const classes = cn('group flex items-center gap-2.5', className);

    if (isLink) {
        return (
            <a href={href} className={classes}>
                {content}
            </a>
        );
    }

    return <div className={classes}>{content}</div>;
}
