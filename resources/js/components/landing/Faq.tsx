import Icon from '@/components/ui/Icon';
import Title from '@/fragments/Title';
import Reveal from './Reveal';

const faqs = [
    {
        question: 'What is InvestaOS and how does it work?',
        answer: 'InvestaOS is a modern payments platform that lets you send, receive, and manage money across global markets. You create an account, connect your bank or wallet, and transact securely with competitive exchange rates.',
    },
    {
        question: 'How long do international transfers take?',
        answer: 'Most transfers are processed within minutes. Larger or high-risk transactions may take up to one business day while our compliance checks run automatically in the background.',
    },
    {
        question: 'What fees and exchange rates apply?',
        answer: 'We charge low, transparent flat fees with no hidden markups. You always see the exact amount your recipient will receive before you confirm a transfer, including the live exchange rate.',
    },
    {
        question: 'Is my money and data secure?',
        answer: 'Yes. We use bank-grade encryption, multi-factor authentication, and continuous fraud monitoring. Funds are held in segregated accounts and protected by strict regulatory compliance.',
    },
    {
        question: 'Which countries and currencies are supported?',
        answer: 'InvestaOS supports 40+ currencies across 180+ countries. New markets are added regularly, so your business can scale internationally without switching providers.',
    },
    {
        question: 'Can I cancel or change a transfer?',
        answer: 'You can cancel a transfer for free as long as it has not been sent. Once sent, cancellation depends on the destination bank policy. Our support team is available 24/7 to help.',
    },
];

export default function Faq() {
    return (
        <section
            id="faq"
            className="relative mx-auto w-full max-w-[1280px] scroll-mt-20 px-4 py-section-gap md:px-10"
        >
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <Reveal>
                    <Title>FAQ</Title>
                </Reveal>
                <Reveal delay={80}>
                    <h2 className="mb-4 font-headline text-headline-lg leading-[1.2] text-landing-on-surface md:text-display-lg dark:text-landing-inverse-on-surface">
                        Frequently asked questions
                    </h2>
                </Reveal>
                <Reveal delay={160}>
                    <p className="font-body text-body-lg text-landing-on-surface-variant dark:text-landing-surface-variant">
                        Everything you need to know about the platform.
                        Can&apos;t find what you&apos;re looking for? Reach out
                        to our team anytime.
                    </p>
                </Reveal>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
                {faqs.map((faq, i) => (
                    <Reveal key={faq.question} delay={i * 60}>
                        <details className="group rounded-2xl border border-landing-outline-variant/30 bg-landing-surface-container-low transition-all duration-300 open:border-landing-primary/30 open:bg-landing-surface open:shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/5 dark:open:border-landing-inverse-primary/30 dark:open:bg-white/10 dark:hover:shadow-black/20">
                            <summary className="font-body flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-landing-primary/10 text-landing-primary transition-transform duration-300 group-open:rotate-45 dark:bg-landing-inverse-primary/10 dark:text-landing-inverse-primary">
                                    <Icon name="add" />
                                </span>
                            </summary>
                            <p className="font-body px-6 pb-6 text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                                {faq.answer}
                            </p>
                        </details>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
