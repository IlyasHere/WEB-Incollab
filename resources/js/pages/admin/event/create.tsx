import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { EventForm } from './components/EventForm';

type AdminEventCreateProps = {
    categories: string[];
    visibilities: string[];
    registrationStatuses: string[];
};

export default function AdminEventCreate({
    categories,
    visibilities,
    registrationStatuses,
}: AdminEventCreateProps) {
    return (
        <>
            <Head title="Tambah Event Baru" />
            <EventForm
                mode="create"
                categories={categories}
                visibilities={visibilities}
                registrationStatuses={registrationStatuses}
            />
        </>
    );
}

AdminEventCreate.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
