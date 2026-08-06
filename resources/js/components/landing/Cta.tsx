import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from './Reveal';

export default function Cta() {
    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-10 md:pb-32">
            <Reveal>
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-landing-primary via-landing-primary to-landing-primary-container px-8 py-16 text-center shadow-[0px_24px_60px_-15px_rgba(0,62,199,0.5)] md:px-16 md:py-20">
                    <div className="hero-pattern absolute inset-0 opacity-60" />
                    <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 animate-[blob_14s_ease-in-out_infinite] rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 animate-[blob_18s_ease-in-out_infinite_reverse] rounded-full bg-landing-secondary-container/20 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl">
                        <span className="font-body mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-label-sm text-landing-on-primary shadow-sm backdrop-blur-sm">
                            <Icon name="bolt" size="text-sm" />
                            Start free, upgrade anytime
                        </span>
                        <h2 className="mb-4 font-headline text-headline-lg leading-[1.2] text-landing-on-primary md:text-display-lg">
                            Ready to send money worldwide?
                        </h2>
                        <p className="font-body mb-10 text-body-lg text-landing-on-primary/80">
                            Join thousands of businesses moving money faster
                            with InvestaOS. No setup fees, no hidden costs —
                            just seamless global payments.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button
                                href="/register"
                                variant="light"
                                size="lg"
                                className="btn-shine shadow-xl shadow-landing-on-surface/20"
                            >
                                Start now
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/30 text-landing-on-primary hover:bg-white/10 dark:border-white/30 dark:text-landing-on-primary dark:hover:bg-white/10"
                            >
                                Talk to sales
                            </Button>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
