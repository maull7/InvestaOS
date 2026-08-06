import { Head } from '@inertiajs/react';

import Cta from '@/components/landing/Cta';
import Faq from '@/components/landing/Faq';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import Pricing from '@/components/landing/Pricing';
import Stats from '@/components/landing/Stats';

export default function Welcome() {
    return (
        <>
            <Head title="Modern Payments Platform" />
            <div className="min-h-screen bg-landing-background font-sans text-landing-on-surface antialiased selection:bg-landing-secondary-container selection:text-landing-on-secondary-container dark:bg-landing-dark dark:text-landing-inverse-on-surface dark:selection:bg-landing-secondary-container dark:selection:text-landing-on-secondary-container">
                <Navbar />
                <main>
                    <Hero />
                    <Stats />
                    <Features />
                    <Pricing />
                    <Faq />
                    <Cta />
                </main>
                <Footer />
            </div>
        </>
    );
}
