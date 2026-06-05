import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { EventForm } from './components/EventForm';
import type { EventItem } from './types';

type AdminEventEditProps = {
    categories: string[];
    visibilities: string[];
    registrationStatuses: string[];
    event: EventItem;
};

export default function AdminEventEdit({
    categories,
    visibilities,
    registrationStatuses,
    event,
}: AdminEventEditProps) {
    return (
        <>
            <Head title={`Edit ${event.title}`} />
            <EventForm
                mode="edit"
                categories={categories}
                visibilities={visibilities}
                registrationStatuses={registrationStatuses}
                event={event}
            />
        </>
    );
}

AdminEventEdit.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
