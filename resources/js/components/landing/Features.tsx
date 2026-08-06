import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Title from '@/fragments/Title';
import Reveal from './Reveal';

const bars = [
    { height: '60%', tone: 'bg-landing-primary', striped: false },
    { height: '40%', tone: 'bg-landing-secondary-fixed', striped: false },
    { height: '80%', tone: 'bg-landing-primary', striped: false },
    { height: '90%', tone: 'bg-landing-primary', striped: true },
    { height: '50%', tone: 'bg-landing-primary', striped: false },
];

export default function Features() {
    return (
        <section
            id="features"
            className="relative mx-auto w-full max-w-[1280px] scroll-mt-20 px-4 py-section-gap md:px-10"
        >
            <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
                <div className="max-w-2xl">
                    <Reveal>
                        <Title>Why InvestaOS</Title>
                    </Reveal>
                    <Reveal delay={80}>
                        <h2 className="mb-4 font-headline text-headline-lg leading-[1.2] text-landing-on-surface md:text-display-lg dark:text-landing-inverse-on-surface">
                            Enjoy lower fees on
                            <br />
                            international money transfers.
                        </h2>
                    </Reveal>
                    <Reveal delay={160}>
                        <p className="font-body text-body-lg text-landing-on-surface-variant dark:text-landing-surface-variant">
                            InvestaOS makes sending money internationally simple
                            and affordable. Enjoy lower fees, competitive
                            exchange rates, and a seamless user experience.
                        </p>
                    </Reveal>
                </div>
                <Reveal delay={240}>
                    <Button variant="primary" className="shrink-0">
                        Learn More
                    </Button>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Reveal className="h-full">
                    <div className="flex h-full flex-col rounded-[24px] border border-landing-outline-variant/30 bg-landing-surface-container-low p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/30">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-landing-outline-variant/20 bg-landing-surface shadow-sm dark:border-white/10 dark:bg-white/10">
                                <Icon
                                    name="layers"
                                    className="text-landing-primary dark:text-landing-inverse-primary"
                                />
                            </div>
                        </div>
                        <h3 className="mb-2 font-headline text-headline-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Comparative Tools
                        </h3>
                        <p className="font-body mb-8 flex-grow text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                            Benchmark and contrast key performance metrics to
                            optimize operations, enhance efficiency, and drive
                            strategic growth.
                        </p>
                        <div className="relative flex h-48 flex-col items-center justify-end overflow-hidden rounded-xl border border-landing-outline-variant/20 bg-landing-surface p-6 dark:border-white/10 dark:bg-white/5">
                            <div className="absolute top-4 left-4 flex gap-4">
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-landing-primary" />
                                    <span className="font-body text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                                        Income
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-landing-secondary-fixed" />
                                    <span className="font-body text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                                        Outcome
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex h-24 w-full items-end justify-center gap-4">
                                {bars.map((bar, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            height: bar.height,
                                            animationDelay: `${i * 120}ms`,
                                        }}
                                        className={`w-8 origin-bottom animate-[grow_0.9s_ease-out_forwards] rounded-t-sm ${
                                            bar.striped
                                                ? 'relative overflow-hidden bg-landing-primary opacity-80'
                                                : bar.tone
                                        }`}
                                    >
                                        {bar.striped && (
                                            <>
                                                <div className="absolute inset-0 bg-landing-primary opacity-20" />
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundImage:
                                                            'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-landing-primary) 4px, var(--color-landing-primary) 8px)',
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={150} className="h-full">
                    <div className="flex h-full flex-col rounded-[24px] border border-landing-outline-variant/30 bg-landing-surface-container-low p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/30">
                        <div className="relative mb-8 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-landing-outline-variant/20 bg-landing-surface p-8 dark:border-white/10 dark:bg-white/5">
                            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-[blob_12s_ease-in-out_infinite] rounded-full bg-landing-primary-container/15 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-[blob_15s_ease-in-out_infinite_reverse] rounded-full bg-landing-secondary-container/15 blur-2xl" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <svg
                                    fill="none"
                                    height="100"
                                    viewBox="0 0 200 100"
                                    width="200"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 90 Q 50 10 100 50 T 190 10"
                                        fill="none"
                                        stroke="#003ec7"
                                        strokeWidth="4"
                                    />
                                </svg>
                            </div>
                            <Button
                                href="/register"
                                variant="solid"
                                className="btn-shine relative z-10"
                            >
                                Get started for free
                            </Button>
                        </div>
                        <h3 className="mb-2 font-headline text-headline-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Easy Tools
                        </h3>
                        <p className="font-body flex-grow text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                            Simple, powerful, and efficient tools for everyone,
                            anytime, anywhere.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
