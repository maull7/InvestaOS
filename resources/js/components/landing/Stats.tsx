import Reveal from './Reveal';

const stats = [
    { value: '40+', label: 'Currencies supported' },
    { value: '180+', label: 'Countries covered' },
    { value: '$2.4B', label: 'Transferred securely' },
    { value: '99.9%', label: 'Platform uptime' },
];

export default function Stats() {
    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 md:px-10">
            <Reveal>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-landing-primary to-landing-primary-container px-8 py-10 shadow-xl shadow-landing-primary/20 md:px-12">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-landing-secondary-container/20 blur-3xl" />
                    <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="text-center md:text-left"
                            >
                                <p className="font-headline text-4xl font-bold text-landing-on-primary md:text-5xl">
                                    {stat.value}
                                </p>
                                <p className="font-body mt-2 text-label-md text-landing-primary-fixed-dim">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
