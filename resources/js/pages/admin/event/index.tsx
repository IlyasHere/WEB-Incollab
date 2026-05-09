import { Head, router, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    Pencil,
    Trash2,
    ImagePlus,
    MapPin,
    Sparkles,
    Ticket,
    Trophy,
} from 'lucide-react';
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type EventItem = {
    id: number;
    title: string;
    description: string | null;
    date: string | null;
    end_date: string | null;
    location: string | null;
    category: string | null;
    points: number;
    registration_url: string | null;
    status: string | null;
    poster_url: string | null;
    detail_poster_url?: string | null;
    organizer: string | null;
    admin_name: string | null;
};

type AdminEventPageProps = {
    categories: string[];
    events: EventItem[];
    stats: {
        total: number;
        upcoming: number;
        published: number;
    };
};

type EventFormData = {
    judul_event: string;
    deskripsi_event: string;
    tanggal_event: string;
    tanggal_selesai: string;
    lokasi: string;
    kategori_event: string;
    poin_event: string;
    link_pendaftaran: string;
    status_event: string;
    poster_event: File | null;
    detail_poster_event: File | null;
    penyelenggara: string;
};

const statusOptions = [
    'Published',
    'Coming Soon',
    'Registration Open',
    'Registration Closing',
];

function formatDateRange(startDate: string | null, endDate: string | null) {
    if (!startDate) {
        return 'Tanggal menyusul';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!endDate || endDate === startDate) {
        return formatter.format(new Date(startDate));
    }

    return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-2 text-sm font-medium text-[#D11149]">{message}</p>;
}

function emptyEventForm(firstCategory: string): EventFormData {
    return {
        judul_event: '',
        deskripsi_event: '',
        tanggal_event: '',
        tanggal_selesai: '',
        lokasi: '',
        kategori_event: firstCategory,
        poin_event: '0',
        link_pendaftaran: '',
        status_event: 'Published',
        poster_event: null,
        detail_poster_event: null,
        penyelenggara: '',
    };
}

function UploadPreview({
    title,
    description,
    preview,
    onChange,
    error,
}: {
    title: string;
    description: string;
    preview: string | null;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-[#433552]">
                {title}
            </span>
            <span className="mt-1 block text-xs leading-6 text-[#7B6F92]">
                {description}
            </span>

            <div className="mt-3 overflow-hidden rounded-[24px] border border-dashed border-[#D7C5F4] bg-[#FCFAFF]">
                <div className="relative h-52 bg-[linear-gradient(135deg,_#EFE7F8_0%,_#F8F3FF_100%)]">
                    {preview ? (
                        <img
                            src={preview}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[#7A6F8D]">
                            <ImagePlus className="h-8 w-8 text-[#6610F2]" />
                            <p className="text-sm font-semibold">
                                Belum ada gambar dipilih
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t border-[#ECE1F8] p-4">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={onChange}
                        className="block w-full text-sm text-[#5E556E] file:mr-4 file:rounded-xl file:border-0 file:bg-[#6610F2] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#5A0BDA]"
                    />
                </div>
            </div>

            <FieldError message={error} />
        </label>
    );
}

export default function AdminEventIndex({
    categories,
    events,
    stats,
}: AdminEventPageProps) {
    const defaultCategory = categories[0] ?? 'Kompetisi';
    const { data, setData, post, processing, errors, reset } =
        useForm<EventFormData>(emptyEventForm(defaultCategory));

    const [cardPreview, setCardPreview] = useState<string | null>(null);
    const [detailPreview, setDetailPreview] = useState<string | null>(null);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);

    useEffect(() => {
        return () => {
            if (cardPreview) {
                URL.revokeObjectURL(cardPreview);
            }

            if (detailPreview) {
                URL.revokeObjectURL(detailPreview);
            }
        };
    }, [cardPreview, detailPreview]);

    function updatePreview(
        field: 'poster_event' | 'detail_poster_event',
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;

        setData(field, file);

        const nextPreview = file ? URL.createObjectURL(file) : null;

        if (field === 'poster_event') {
            if (cardPreview) {
                URL.revokeObjectURL(cardPreview);
            }

            setCardPreview(nextPreview);
            return;
        }

        if (detailPreview) {
            URL.revokeObjectURL(detailPreview);
        }

        setDetailPreview(nextPreview);
    }

    function resetFormState() {
        reset();
        setData(emptyEventForm(defaultCategory));
        setEditingEventId(null);

        if (cardPreview) {
            URL.revokeObjectURL(cardPreview);
        }

        if (detailPreview) {
            URL.revokeObjectURL(detailPreview);
        }

        setCardPreview(null);
        setDetailPreview(null);
    }

    function startEditing(event: EventItem) {
        setEditingEventId(event.id);
        setData({
            judul_event: event.title,
            deskripsi_event: event.description ?? '',
            tanggal_event: event.date ?? '',
            tanggal_selesai: event.end_date ?? '',
            lokasi: event.location ?? '',
            kategori_event: event.category ?? defaultCategory,
            poin_event: String(event.points ?? 0),
            link_pendaftaran: event.registration_url ?? '',
            status_event: event.status ?? 'Published',
            poster_event: null,
            detail_poster_event: null,
            penyelenggara: event.organizer ?? '',
        });

        if (cardPreview && cardPreview.startsWith('blob:')) {
            URL.revokeObjectURL(cardPreview);
        }

        if (detailPreview && detailPreview.startsWith('blob:')) {
            URL.revokeObjectURL(detailPreview);
        }

        setCardPreview(event.poster_url ?? null);
        setDetailPreview(event.detail_poster_url ?? null);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post(
            editingEventId
                ? `/admin/event/${editingEventId}/update`
                : '/admin/event',
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    resetFormState();
                },
            },
        );
    }

    function deleteEvent(eventId: number) {
        if (!window.confirm('Hapus card event ini?')) {
            return;
        }

        router.delete(`/admin/event/${eventId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (editingEventId === eventId) {
                    resetFormState();
                }
            },
        });
    }

    return (
        <>
            <Head title="Kelola Event" />

            <div className="space-y-8">
                <section className="rounded-[30px] bg-[linear-gradient(135deg,_#FFFFFF_0%,_#F7F1FF_100%)] p-6 shadow-[0_22px_50px_rgba(56,42,73,0.08)] ring-1 ring-[#EFE4F8] sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold tracking-[0.18em] text-[#6610F2] uppercase">
                                Admin Event Panel
                            </p>
                            <h1 className="mt-3 text-3xl font-bold text-[#1F1730] sm:text-4xl">
                                Kelola kartu event dari sini
                            </h1>
                            <p className="mt-3 text-base leading-8 text-[#766B8A]">
                                Sekarang admin mengunggah 2 gambar manual: satu
                                untuk card event dan satu lagi untuk halaman
                                detail event.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#EFE4F8] bg-white px-5 py-4">
                                <p className="text-sm text-[#7B6F92]">
                                    Total event
                                </p>
                                <p className="mt-2 text-3xl font-bold text-[#1F1730]">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#EFE4F8] bg-white px-5 py-4">
                                <p className="text-sm text-[#7B6F92]">
                                    Upcoming
                                </p>
                                <p className="mt-2 text-3xl font-bold text-[#1F1730]">
                                    {stats.upcoming}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#EFE4F8] bg-white px-5 py-4">
                                <p className="text-sm text-[#7B6F92]">
                                    Published
                                </p>
                                <p className="mt-2 text-3xl font-bold text-[#1F1730]">
                                    {stats.published}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
                    <section className="rounded-[30px] border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EAFF] text-[#6610F2]">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#1F1730]">
                                    {editingEventId
                                        ? 'Edit Event'
                                        : 'Tambah Event Baru'}
                                </h2>
                                <p className="text-sm text-[#766B8A]">
                                    {editingEventId
                                        ? 'Perbarui data card yang dipilih, lalu simpan perubahan.'
                                        : 'Isi data event dan unggah gambar card plus gambar detail.'}
                                </p>
                            </div>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={submit}>
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Judul Event
                                    </span>
                                    <input
                                        type="text"
                                        value={data.judul_event}
                                        onChange={(event) =>
                                            setData(
                                                'judul_event',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                        placeholder="Contoh: National Data Science Olympiad 2026"
                                    />
                                    <FieldError message={errors.judul_event} />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Penyelenggara
                                    </span>
                                    <input
                                        type="text"
                                        value={data.penyelenggara}
                                        onChange={(event) =>
                                            setData(
                                                'penyelenggara',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                        placeholder="Contoh: BEM FASILKOM UI"
                                    />
                                    <FieldError
                                        message={errors.penyelenggara}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Kategori
                                    </span>
                                    <select
                                        value={data.kategori_event}
                                        onChange={(event) =>
                                            setData(
                                                'kategori_event',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError
                                        message={errors.kategori_event}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Status
                                    </span>
                                    <select
                                        value={data.status_event}
                                        onChange={(event) =>
                                            setData(
                                                'status_event',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError message={errors.status_event} />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Tanggal Mulai
                                    </span>
                                    <input
                                        type="date"
                                        value={data.tanggal_event}
                                        onChange={(event) =>
                                            setData(
                                                'tanggal_event',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                    />
                                    <FieldError
                                        message={errors.tanggal_event}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Tanggal Selesai
                                    </span>
                                    <input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(event) =>
                                            setData(
                                                'tanggal_selesai',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                    />
                                    <FieldError
                                        message={errors.tanggal_selesai}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Lokasi
                                    </span>
                                    <div className="relative mt-2">
                                        <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A77A8]" />
                                        <input
                                            type="text"
                                            value={data.lokasi}
                                            onChange={(event) =>
                                                setData(
                                                    'lokasi',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] py-3 pr-4 pl-11 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                            placeholder="Contoh: Balairung UI, Depok"
                                        />
                                    </div>
                                    <FieldError message={errors.lokasi} />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Poin Event
                                    </span>
                                    <div className="relative mt-2">
                                        <Trophy className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A77A8]" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.poin_event}
                                            onChange={(event) =>
                                                setData(
                                                    'poin_event',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] py-3 pr-4 pl-11 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                            placeholder="0"
                                        />
                                    </div>
                                    <FieldError message={errors.poin_event} />
                                </label>

                                <label className="block md:col-span-2">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Link Pendaftaran
                                    </span>
                                    <div className="relative mt-2">
                                        <Ticket className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A77A8]" />
                                        <input
                                            type="url"
                                            value={data.link_pendaftaran}
                                            onChange={(event) =>
                                                setData(
                                                    'link_pendaftaran',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] py-3 pr-4 pl-11 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <FieldError
                                        message={errors.link_pendaftaran}
                                    />
                                </label>

                                <label className="block md:col-span-2">
                                    <span className="text-sm font-semibold text-[#433552]">
                                        Deskripsi Event
                                    </span>
                                    <textarea
                                        value={data.deskripsi_event}
                                        onChange={(event) =>
                                            setData(
                                                'deskripsi_event',
                                                event.target.value,
                                            )
                                        }
                                        rows={5}
                                        className="mt-2 w-full rounded-2xl border border-[#E7DAF7] bg-[#FCFAFF] px-4 py-3 text-sm transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]"
                                        placeholder="Masukkan ringkasan event yang akan tampil pada card publik."
                                    />
                                    <FieldError
                                        message={errors.deskripsi_event}
                                    />
                                </label>

                                <div className="grid gap-6 md:col-span-2 xl:grid-cols-2">
                                    <UploadPreview
                                        title="Gambar Card Event"
                                        description="Gambar ini dipakai di daftar event."
                                        preview={cardPreview}
                                        onChange={(event) =>
                                            updatePreview('poster_event', event)
                                        }
                                        error={errors.poster_event}
                                    />

                                    <UploadPreview
                                        title="Gambar Detail Event"
                                        description="Gambar ini dipakai saat tombol Lihat Detail dibuka."
                                        preview={detailPreview}
                                        onChange={(event) =>
                                            updatePreview(
                                                'detail_poster_event',
                                                event,
                                            )
                                        }
                                        error={errors.detail_poster_event}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#FBF8FF] p-5">
                                <div className="flex items-center gap-3 text-sm text-[#6F6483]">
                                    <CalendarDays className="h-5 w-5 text-[#6610F2]" />
                                    <span>
                                        Event yang disimpan di sini langsung
                                        muncul di halaman publik `/event`.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-2xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.22)] transition hover:bg-[#5A0BDA] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : editingEventId
                                          ? 'Update Event'
                                          : 'Simpan Event'}
                                </button>

                                {editingEventId ? (
                                    <button
                                        type="button"
                                        onClick={resetFormState}
                                        className="inline-flex items-center justify-center rounded-2xl border border-[#D8C6F4] px-6 py-3 text-sm font-semibold text-[#6A5486] transition hover:bg-white"
                                    >
                                        Batal Edit
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    </section>

                    <section className="rounded-[30px] border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold tracking-[0.14em] text-[#6610F2] uppercase">
                                    Preview
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#1F1730]">
                                    Event yang sudah dibuat
                                </h2>
                            </div>
                            <span className="rounded-full bg-[#F3EAFF] px-4 py-2 text-sm font-semibold text-[#6610F2]">
                                {events.length} card
                            </span>
                        </div>

                        <div className="mt-6 space-y-4">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <article
                                        key={event.id}
                                        className="overflow-hidden rounded-[24px] border border-[#EFE4F8] bg-[#FCFAFF]"
                                    >
                                        <div className="relative h-40 overflow-hidden bg-[linear-gradient(135deg,_#221A32_0%,_#46366D_100%)]">
                                            {event.poster_url ? (
                                                <img
                                                    src={event.poster_url}
                                                    alt={event.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-end p-5 text-white">
                                                    <h3 className="max-w-[220px] text-xl leading-tight font-bold">
                                                        {event.title}
                                                    </h3>
                                                </div>
                                            )}

                                            <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#6610F2]">
                                                {event.category ?? 'Event'}
                                            </span>
                                        </div>

                                        <div className="space-y-3 p-5">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1F1730]">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-[#6F6483]">
                                                    {event.organizer ??
                                                        'Penyelenggara'}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEditing(event)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#D9C7F5] px-4 py-2 text-xs font-semibold text-[#6610F2] transition hover:bg-white"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteEvent(event.id)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#FFD1DA] px-4 py-2 text-xs font-semibold text-[#D11149] transition hover:bg-[#FFF4F7]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus
                                                </button>
                                            </div>

                                            <div className="space-y-2 text-sm text-[#635875]">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4 text-[#6610F2]" />
                                                    <span>
                                                        {formatDateRange(
                                                            event.date,
                                                            event.end_date,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-[#6610F2]" />
                                                    <span>
                                                        {event.location ??
                                                            'Lokasi menyusul'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white">
                                                    <div className="border-b border-[#EFE4F8] px-3 py-2 text-xs font-bold tracking-[0.14em] text-[#7A6F8D] uppercase">
                                                        Gambar Card
                                                    </div>
                                                    <div className="h-24 bg-[#F5F0FF]">
                                                        {event.poster_url ? (
                                                            <img
                                                                src={
                                                                    event.poster_url
                                                                }
                                                                alt={`${event.title} card`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white">
                                                    <div className="border-b border-[#EFE4F8] px-3 py-2 text-xs font-bold tracking-[0.14em] text-[#7A6F8D] uppercase">
                                                        Gambar Detail
                                                    </div>
                                                    <div className="h-24 bg-[#F5F0FF]">
                                                        {event.detail_poster_url ? (
                                                            <img
                                                                src={
                                                                    event.detail_poster_url
                                                                }
                                                                alt={`${event.title} detail`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#EFE7FF] px-3 py-1 text-xs font-semibold text-[#6610F2]">
                                                    {event.points} poin
                                                </span>
                                                <span className="rounded-full bg-[#F7F1FF] px-3 py-1 text-xs font-semibold text-[#6B547D]">
                                                    {event.status ?? 'Draft'}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-[24px] border border-dashed border-[#DCCBFA] bg-[#FCFAFF] p-6 text-center text-sm leading-7 text-[#726887]">
                                    Belum ada card event. Tambahkan event
                                    pertama dari form di sebelah kiri.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminEventIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
