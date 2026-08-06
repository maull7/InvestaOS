import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Title from '@/fragments/Title';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

const plusFeatures = [
    'Exclusive Benefits',
    'Faster Processing',
    'Advanced Analytics',
    'Multi-Currency Support',
    'Enhanced Security',
];

const enterpriseFeatures = [
    'Tailored Financial Solutions',
    'High-Volume Transactions',
    'Dedicated Financial Insights',
    'Multi-Account & Global Payments',
    'Grade Security & Compliance',
];

function PlanCard({
    name,
    price,
    description,
    features,
    featured = false,
}: {
    name: string;
    price: string;
    description: string;
    features: string[];
    featured?: boolean;
}) {
    const featuredStyle = featured
        ? 'bg-gradient-to-br from-landing-primary via-landing-primary to-landing-primary-container text-landing-on-primary shadow-[0px_24px_60px_-15px_rgba(0,62,199,0.55)]'
        : 'border border-landing-outline-variant/30 bg-landing-surface-container-low text-landing-on-surface dark:border-white/10 dark:bg-white/5 dark:text-landing-inverse-on-surface';
    const checkStyle = featured
        ? 'bg-landing-surface/20 text-landing-on-primary'
        : 'bg-landing-surface-variant text-landing-on-surface dark:bg-white/10 dark:text-landing-inverse-on-surface';
    const featureStyle = featured
        ? 'text-landing-on-primary'
        : 'text-landing-on-surface-variant dark:text-landing-surface-variant';
    const priceTone = featured
        ? 'text-landing-primary-fixed-dim'
        : 'text-landing-on-surface-variant dark:text-landing-surface-variant';

    return (
        <div
            className={`flex h-full transform flex-col rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-2 ${
                featured
                    ? 'hover:shadow-[0px_32px_70px_-15px_rgba(0,62,199,0.65)]'
                    : 'hover:shadow-[0px_16px_40px_rgba(0,0,0,0.08)]'
            } ${featuredStyle}`}
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-headline-md">{name}</h3>
                {featured && (
                    <span className="rounded-full bg-landing-surface/20 px-3 py-1 text-[10px] font-bold tracking-wider text-landing-on-primary uppercase">
                        Best Deal
                    </span>
                )}
            </div>
            <p className={`font-body mb-8 text-body-md ${priceTone}`}>
                {description}
            </p>{' '}
            <div className="mb-8 flex items-baseline gap-1">
                <span className="text-[48px] leading-none font-bold tracking-tight">
                    {price}
                </span>
                <span className={`font-body text-body-md ${priceTone}`}>
                    /Month
                </span>
            </div>
            <Button
                variant={featured ? 'light' : 'primary'}
                size="lg"
                fullWidth
                className={cn('mb-8', !featured && 'shadow-md')}
            >
                Choose Plan
            </Button>
            <ul className="mt-auto space-y-4">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                        <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${checkStyle}`}
                        >
                            <Icon name="check" size="text-[14px]" />
                        </div>
                        <span
                            className={`font-body text-label-md font-medium ${featureStyle}`}
                        >
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Pricing() {
    return (
        <section
            id="pricing"
            className="relative mx-auto w-full max-w-[1280px] scroll-mt-20 px-4 py-section-gap md:px-10"
        >
            <div className="mx-auto mb-16 max-w-3xl text-center">
                <Reveal>
                    <Title>Pricing Plans</Title>
                </Reveal>
                <Reveal delay={80}>
                    <h2 className="mb-4 font-headline text-headline-lg leading-[1.2] text-landing-on-surface md:text-display-lg dark:text-landing-inverse-on-surface">
                        Pricing plans for your business, offering flexibility
                        and growth.
                    </h2>
                </Reveal>
                <Reveal delay={160}>
                    <p className="font-body text-body-lg text-landing-on-surface-variant dark:text-landing-surface-variant">
                        Designed for business size, financial needs, and growth
                        goals—ensuring seamless scalability, competitive
                        exchange rates, and advanced financial insights.
                    </p>
                </Reveal>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <Reveal delay={120} className="h-full">
                    <PlanCard
                        name="Plus"
                        price="$309"
                        description="Our pricing adapts to your company's financial scale, transaction volume, and unique business needs."
                        features={plusFeatures}
                        featured
                    />
                </Reveal>
                <Reveal delay={240} className="h-full">
                    <PlanCard
                        name="Enterprise"
                        price="$609"
                        description="Our pricing adapts to your company's financial scale, transaction volume, and unique business needs."
                        features={enterpriseFeatures}
                    />
                </Reveal>
            </div>
        </section>
    );
}
