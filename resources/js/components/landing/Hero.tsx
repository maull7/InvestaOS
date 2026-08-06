import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from './Reveal';

const withdrawals = [
    {
        name: 'Rayhan Noor',
        method: 'Bank Transfer',
        amount: '-$120.00',
        status: 'Success',
        tone: 'text-landing-secondary',
    },
    {
        name: 'Nada Salsabila',
        method: 'Bank Transfer',
        amount: '-$420.00',
        status: 'Success',
        tone: 'text-landing-secondary',
    },
    {
        name: 'Ina Hanali',
        method: 'Paypal',
        amount: '-$232.00',
        status: 'Failed',
        tone: 'text-landing-error',
    },
];

const partners = ['Stripe', 'PayPal', 'Visa', 'Mastercard', 'Wise', 'Revolut'];

function PartnerMark({ name }: { name: string }) {
    switch (name) {
        case 'Mastercard':
            return (
                <span className="flex items-center gap-2.5">
                    <span className="relative flex h-6 w-10 items-center">
                        <span className="absolute left-0 h-5 w-5 rounded-full bg-current opacity-60" />
                        <span className="absolute left-3.5 h-5 w-5 rounded-full border-2 border-current opacity-40" />
                    </span>
                    <span className="font-bold tracking-tight lowercase">
                        mastercard
                    </span>
                </span>
            );
        case 'Visa':
            return (
                <span className="font-extrabold tracking-tighter uppercase italic">
                    Visa
                </span>
            );
        case 'PayPal':
            return (
                <span className="font-bold tracking-tight italic">
                    Pay
                    <span className="font-extrabold tracking-tight italic">
                        Pal
                    </span>
                </span>
            );
        case 'Wise':
            return (
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    <span className="font-bold tracking-tight lowercase">
                        wise
                    </span>
                </span>
            );
        case 'Stripe':
            return (
                <span className="font-bold tracking-tight lowercase">
                    stripe
                </span>
            );
        default:
            return <span className="font-bold tracking-tight">Revolut</span>;
    }
}

export default function Hero() {
    return (
        <section id="home" className="relative scroll-mt-20 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 animate-[blob_14s_ease-in-out_infinite] rounded-full bg-landing-primary-container/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 animate-[blob_18s_ease-in-out_infinite_reverse] rounded-full bg-landing-secondary-container/15 blur-3xl" />

            <div className="relative mx-auto w-full max-w-[1280px] px-4 py-16 md:px-10 md:py-24">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
                    <div className="flex flex-col items-start space-y-8">
                        <Reveal>
                            <div className="font-body inline-flex items-center gap-2 rounded-full border border-landing-outline-variant/30 bg-landing-surface-container-low px-3 py-1.5 text-label-sm shadow-sm dark:border-white/10 dark:bg-white/5">
                                <span className="text-landing-on-surface-variant dark:text-landing-surface-variant">
                                    4.8
                                </span>
                                <Icon
                                    name="star"
                                    size="text-sm"
                                    className="text-yellow-400"
                                />
                                <span className="text-landing-on-surface-variant dark:text-landing-surface-variant">
                                    3k+ reviews on
                                </span>
                                <Icon
                                    name="play_arrow"
                                    size="text-sm"
                                    className="text-landing-primary dark:text-landing-inverse-primary"
                                />
                            </div>
                        </Reveal>

                        <Reveal delay={100}>
                            <h1 className="font-headline text-display-lg-mobile text-landing-on-surface md:text-display-lg dark:text-landing-inverse-on-surface">
                                Modern{' '}
                                <span className="text-gradient font-light italic">
                                    payments
                                </span>
                                <br />
                                for markets.
                            </h1>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="font-body max-w-lg text-body-lg text-landing-on-surface-variant dark:text-landing-surface-variant">
                                Seamless, secure, and scalable payment solutions
                                designed for modern businesses to transact
                                effortlessly across global markets with
                                confidence.
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    href="/register"
                                    variant="primary"
                                    size="lg"
                                    className="px-7 py-3.5 shadow-landing-secondary-container/40"
                                >
                                    Start now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="group px-7 py-3.5 hover:border-landing-primary/40"
                                >
                                    Learn more
                                    <Icon
                                        name="arrow_forward"
                                        size="text-sm"
                                        className="inline-block align-[-2px] transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                </Button>
                            </div>
                        </Reveal>

                        <Reveal delay={400} className="w-full">
                            <div className="w-full border-t border-landing-outline-variant/20 pt-8 dark:border-white/10">
                                <p className="font-body mb-5 text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                                    Empowering{' '}
                                    <strong className="text-landing-primary dark:text-landing-inverse-primary">
                                        3k+
                                    </strong>{' '}
                                    businesses worldwide with secure, and
                                    innovative financial solutions — trusted.
                                </p>
                                <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                                    <div className="animate-marquee flex w-max items-center gap-14 pr-14 hover:[animation-play-state:paused]">
                                        {[...partners, ...partners].map(
                                            (partner, i) => (
                                                <span
                                                    key={`${partner}-${i}`}
                                                    className="text-xl text-landing-on-surface-variant/40 transition-colors duration-300 hover:text-landing-on-surface-variant/80 dark:text-landing-surface-variant/40 dark:hover:text-landing-surface-variant/80"
                                                >
                                                    <PartnerMark
                                                        name={partner}
                                                    />
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={150}>
                        <div className="hero-pattern relative h-[600px] overflow-hidden rounded-3xl shadow-xl">
                            <div className="glass-panel absolute top-12 left-8 w-64 animate-[float_6s_ease-in-out_infinite] rounded-xl p-4 shadow-[0px_20px_48px_rgba(0,0,0,0.12)]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-landing-secondary-container">
                                        <Icon
                                            name="group"
                                            className="text-landing-on-secondary-container"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-body text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                            Accounting Team
                                        </h4>
                                        <p className="text-[10px] text-landing-on-surface-variant dark:text-landing-surface-variant">
                                            Reports are ready!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel absolute top-1/2 left-1/2 z-10 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 shadow-[0px_20px_48px_rgba(0,0,0,0.12)]">
                                <div className="mb-4 flex items-center justify-between border-b border-landing-outline-variant/20 pb-2 dark:border-white/10">
                                    <h3 className="font-body text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                        Recent Withdrawals
                                    </h3>
                                    <span className="font-body cursor-pointer text-label-sm text-landing-primary dark:text-landing-inverse-primary">
                                        View All
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {withdrawals.map((w) => (
                                        <div
                                            key={w.name}
                                            className="flex items-center justify-between rounded-lg p-1 transition-colors duration-200 hover:bg-landing-surface-container-low dark:hover:bg-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-landing-surface-container-high dark:bg-white/10">
                                                    <Icon
                                                        name="person"
                                                        size="text-sm"
                                                        className="text-landing-on-surface-variant dark:text-landing-surface-variant"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-body text-label-sm text-landing-on-surface dark:text-landing-inverse-on-surface">
                                                        {w.name}
                                                    </p>
                                                    <p className="text-[10px] text-landing-on-surface-variant dark:text-landing-surface-variant">
                                                        {w.method}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-body text-label-sm text-landing-on-surface dark:text-landing-inverse-on-surface">
                                                    {w.amount}
                                                </p>
                                                <p
                                                    className={`text-[10px] ${w.tone}`}
                                                >
                                                    {w.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel absolute right-8 bottom-16 w-64 animate-[float_8s_ease-in-out_infinite_reverse] rounded-xl p-4 shadow-[0px_20px_48px_rgba(0,0,0,0.12)]">
                                <div className="flex items-start gap-3">
                                    <div className="font-body flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-landing-secondary-container text-label-sm text-landing-on-secondary-container">
                                        N
                                    </div>
                                    <div>
                                        <h4 className="font-body text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                            Customer
                                        </h4>
                                        <p className="mb-1 text-[10px] text-landing-on-surface-variant dark:text-landing-surface-variant">
                                            Just now
                                        </p>
                                        <p className="font-body text-label-sm text-landing-on-surface dark:text-landing-inverse-on-surface">
                                            Thank you! We appreciate that!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-32 left-16 flex h-12 w-12 animate-[blob_10s_ease-in-out_infinite] items-center justify-center rounded-2xl border-2 border-dashed border-landing-secondary-fixed/50">
                                <Icon
                                    name="public"
                                    className="text-landing-secondary-fixed"
                                />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
