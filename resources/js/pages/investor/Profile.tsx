import { Head } from '@inertiajs/react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileForm from '@/components/ui/ProfileForm';
import type { ProfileData } from '@/components/ui/ProfileForm';

type Props = { profile: ProfileData | null };

export default function Profile({ profile }: Props) {
    return (
        <>
            <Head title="Profile Settings" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12 lg:max-w-3xl">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Profile Settings
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Update your personal and financial information.
                        </p>
                    </div>

                    <Card className="p-6 md:p-8">
                        <ProfileForm profile={profile} />
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}
