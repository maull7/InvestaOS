import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Logo from '@/components/ui/Logo';

const columns = [
    {
        title: 'Product',
        links: ['Personal', 'Business', 'Platform', 'Pricing', 'Integrations'],
    },
    {
        title: 'Company',
        links: ['About us', 'Careers', 'Blog', 'Press', 'Partners'],
    },
    {
        title: 'Resources',
        links: ['Help Center', 'API Docs', 'Guides', 'Status', 'Community'],
    },
    {
        title: 'Legal',
        links: ['Terms', 'Privacy', 'Security', 'Cookie Policy'],
    },
];

const socials = [
    { icon: 'mail', label: 'Email' },
    { icon: 'forum', label: 'Community' },
    { icon: 'link', label: 'Website' },
    { icon: 'rss_feed', label: 'Blog' },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-landing-outline-variant/20 bg-landing-surface dark:bg-landing-inverse-surface">
            <div className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-10 md:pt-20">
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
                    <div className="col-span-2 md:col-span-4">
                        <Logo className="mb-5" />
                        <p className="font-body mb-6 max-w-sm text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                            Modern, secure, and scalable payment solutions for
                            businesses moving money across global markets with
                            confidence.
                        </p>

                        <div className="mb-6">
                            <p className="font-body mb-3 text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                Stay in the loop
                            </p>
                            <form
                                className="flex max-w-sm gap-2"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="font-body w-full min-w-0 flex-1 rounded-full border border-transparent bg-landing-surface-container-low px-4 py-2.5 text-label-md text-landing-on-surface transition-all duration-200 placeholder:text-landing-on-surface-variant/50 focus:border-landing-primary focus:bg-landing-surface focus:ring-2 focus:ring-landing-primary/30 focus:outline-none dark:bg-white/5 dark:text-landing-inverse-on-surface dark:placeholder:text-landing-surface-variant/40"
                                />
                                <Button type="submit" className="shrink-0 px-5">
                                    Subscribe
                                </Button>
                            </form>
                        </div>

                        <div className="flex items-center gap-2">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-landing-outline-variant/30 text-landing-on-surface-variant transition-all duration-200 hover:scale-105 hover:border-landing-primary/40 hover:text-landing-primary dark:text-landing-surface-variant dark:hover:text-landing-inverse-primary"
                                >
                                    <Icon name={social.icon} size="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((column) => (
                        <div key={column.title} className="md:col-span-2">
                            <h4 className="font-body mb-4 text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                {column.title}
                            </h4>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="font-body text-body-md text-sm text-landing-on-surface-variant transition-colors hover:text-landing-primary dark:text-landing-surface-variant dark:hover:text-landing-inverse-primary"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-col justify-between gap-4 border-t border-landing-outline-variant/20 py-8 md:flex-row md:items-center">
                    <p className="font-body text-label-sm text-landing-on-surface-variant/70 dark:text-landing-surface-variant/70">
                        © 2024 InvestaOS Finance. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        {['Terms', 'Privacy', 'Cookies'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="font-body text-label-sm text-landing-on-surface-variant transition-colors hover:text-landing-primary dark:text-landing-surface-variant dark:hover:text-landing-inverse-primary"
                            >
                                {link}
                            </a>
                        ))}
                        <div className="font-body flex items-center gap-1.5 text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                            <Icon name="public" size="text-sm" />
                            English (US)
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
