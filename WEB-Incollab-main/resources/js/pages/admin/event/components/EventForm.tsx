import { Link, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ImagePlus,
    Info,
    MapPin,
    Ticket,
    Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { EventFormValues, EventItem } from '../types';

const OPEN_REGISTRATION_STATUS = 'Open';
const CLOSED_REGISTRATION_STATUS = 'Closed';
const COMING_SOON_REGISTRATION_STATUS = 'Coming Soon';

function inputClass(disabled = false) {
    return `mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] ${
        disabled
            ? 'cursor-not-allowed border-[#EEE7F6] bg-[#F7F4FB] text-[#887E99]'
            : 'border-[#E7DAF7] bg-[#FCFAFF] focus:border-[#6610F2] focus:ring-4 focus:ring-[#EDE2FF]'
    }`;
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-2 text-sm font-medium text-[#D11149]">{message}</p>;
}

function UploadPreview({
    title,
    description,
    preview,
    onChange,
    error,
    disabled = false,
}: {
    title: string;
    description: string;
    preview: string | null;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
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
                        disabled={disabled}
                        className="block w-full text-sm text-[#5E556E] file:mr-4 file:rounded-xl file:border-0 file:bg-[#6610F2] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#5A0BDA] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>
            </div>

            <FieldError message={error} />
        </label>
    );
}

function initialFormValues(
    defaultCategory: string,
    event?: EventItem,
): EventFormValues {
    if (!event) {
        return {
            judul_event: '',
            deskripsi_event: '',
            tanggal_event: '',
            tanggal_selesai: '',
            lokasi: '',
            kategori_event: defaultCategory,
            poin_event: '0',
            link_pendaftaran: '',
            visibility_status: 'Draft',
            registration_status: 'Coming Soon',
            poster_event: null,
            detail_poster_event: null,
            penyelenggara: '',
        };
    }

    return {
        judul_event: event.title,
        deskripsi_event: event.description ?? '',
        tanggal_event: event.date ?? '',
        tanggal_selesai: event.end_date ?? '',
        lokasi: event.location ?? '',
        kategori_event: event.category ?? defaultCategory,
        poin_event: String(event.points ?? 0),
        link_pendaftaran: event.registration_url ?? '',
        visibility_status: event.visibility_status ?? 'Draft',
        registration_status: event.registration_status ?? 'Coming Soon',
        poster_event: null,
        detail_poster_event: null,
        penyelenggara: event.organizer ?? '',
    };
}

function allowedRegistrationStatuses(
    statuses: string[],
    event?: EventItem,
): string[] {
    if (event?.registration_status === OPEN_REGISTRATION_STATUS) {
        return statuses.filter((status) =>
            [OPEN_REGISTRATION_STATUS, CLOSED_REGISTRATION_STATUS].includes(
                status,
            ),
        );
    }

    if (event?.registration_status === CLOSED_REGISTRATION_STATUS) {
        return statuses.filter(
            (status) => status === CLOSED_REGISTRATION_STATUS,
        );
    }

    return statuses.filter((status) =>
        [
            COMING_SOON_REGISTRATION_STATUS,
            OPEN_REGISTRATION_STATUS,
            CLOSED_REGISTRATION_STATUS,
        ].includes(status),
    );
}

export function EventForm({
    mode,
    categories,
    visibilities,
    registrationStatuses,
    event,
}: {
    mode: 'create' | 'edit';
    categories: string[];
    visibilities: string[];
    registrationStatuses: string[];
    event?: EventItem;
}) {
    const defaultCategory = categories[0] ?? 'Kompetisi';
    const { data, setData, post, processing, errors } =
        useForm<EventFormValues>(initialFormValues(defaultCategory, event));

    const [cardPreview, setCardPreview] = useState<string | null>(
        event?.poster_url ?? null,
    );
    const [detailPreview, setDetailPreview] = useState<string | null>(
        event?.detail_poster_url ?? null,
    );

    const registrationIsOpen =
        data.registration_status === OPEN_REGISTRATION_STATUS;
    const availableRegistrationStatuses = allowedRegistrationStatuses(
        registrationStatuses,
        mode === 'edit' ? event : undefined,
    );
    const isClosedEvent =
        mode === 'edit' &&
        event?.registration_status === CLOSED_REGISTRATION_STATUS;

    useEffect(() => {
        return () => {
            if (cardPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(cardPreview);
            }

            if (detailPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(detailPreview);
            }
        };
    }, [cardPreview, detailPreview]);

    function updatePreview(
        field: 'poster_event' | 'detail_poster_event',
        fileEvent: ChangeEvent<HTMLInputElement>,
    ) {
        const file = fileEvent.target.files?.[0] ?? null;
        const nextPreview = file ? URL.createObjectURL(file) : null;

        setData(field, file);

        if (field === 'poster_event') {
            if (cardPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(cardPreview);
            }

            setCardPreview(nextPreview ?? event?.poster_url ?? null);

            return;
        }

        if (detailPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(detailPreview);
        }

        setDetailPreview(nextPreview ?? event?.detail_poster_url ?? null);
    }

    function submit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        post(
            mode === 'edit' && event
                ? `/admin/event/${event.id}/update`
                : '/admin/event',
            {
                forceFormData: true,
            },
        );
    }

    return (
        <div className="space-y-6">
            <Link
                href="/admin/event"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#6610F2] transition hover:text-[#550DCC]"
            >
                <ChevronLeft className="h-4 w-4" />
                Kembali ke Kelola Event
            </Link>

            <section>
                <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                    {mode === 'edit' ? 'Edit Event' : 'Tambah Event Baru'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F5573] sm:text-base">
                    {mode === 'edit'
                        ? 'Perbarui data event agar admin lebih mudah mengelola informasi yang tampil di halaman publik.'
                        : 'Lengkapi informasi event untuk mempublikasikan kegiatan baru.'}
                </p>
            </section>

            <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] sm:p-8">
                <form className="space-y-8" onSubmit={submit}>
                    {isClosedEvent && (
                        <div className="rounded-2xl border border-[#FFE4E6] bg-[#FFF7F7] p-4 text-sm leading-6 text-[#8A2846]">
                            <div className="flex items-start gap-3">
                                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        Event ini sudah berstatus Closed
                                    </p>
                                    <p className="mt-1">
                                        Sesuai aturan admin, data event yang
                                        sudah closed dikunci. Kamu hanya bisa
                                        mengubah Visibility.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Visibility{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <select
                                value={data.visibility_status}
                                onChange={(event) =>
                                    setData(
                                        'visibility_status',
                                        event.target.value,
                                    )
                                }
                                className={inputClass()}
                            >
                                {visibilities.map((visibility) => (
                                    <option key={visibility} value={visibility}>
                                        {visibility}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.visibility_status} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Registration Status{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <p className="mt-1 text-xs leading-5 text-[#7B6F92]">
                                Event publik hanya tampil jika visibility-nya
                                Published.
                            </p>
                            <select
                                value={data.registration_status}
                                onChange={(event) =>
                                    setData(
                                        'registration_status',
                                        event.target.value,
                                    )
                                }
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            >
                                {availableRegistrationStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.registration_status} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Judul Event{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <input
                                type="text"
                                value={data.judul_event}
                                onChange={(event) =>
                                    setData('judul_event', event.target.value)
                                }
                                placeholder="Masukkan judul event..."
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            />
                            <FieldError message={errors.judul_event} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Penyelenggara{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <input
                                type="text"
                                value={data.penyelenggara}
                                onChange={(event) =>
                                    setData('penyelenggara', event.target.value)
                                }
                                placeholder="Nama instansi/komunitas"
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            />
                            <FieldError message={errors.penyelenggara} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Kategori Event{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <select
                                value={data.kategori_event}
                                onChange={(event) =>
                                    setData(
                                        'kategori_event',
                                        event.target.value,
                                    )
                                }
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.kategori_event} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Tanggal Mulai Event{' '}
                                <span className="text-[#D11149]">*</span>
                            </span>
                            <input
                                type="date"
                                value={data.tanggal_event}
                                onChange={(event) =>
                                    setData('tanggal_event', event.target.value)
                                }
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            />
                            <FieldError message={errors.tanggal_event} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Tanggal Selesai Event
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
                                className={inputClass(isClosedEvent)}
                                disabled={isClosedEvent}
                            />
                            <FieldError message={errors.tanggal_selesai} />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="text-sm font-semibold text-[#433552]">
                                Lokasi
                                {registrationIsOpen ? (
                                    <span className="text-[#D11149]"> *</span>
                                ) : null}
                            </span>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A77A8]" />
                                <input
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(event) =>
                                        setData('lokasi', event.target.value)
                                    }
                                    placeholder="Nama tempat atau link online..."
                                    className={`${inputClass(isClosedEvent)} pl-11`}
                                    disabled={isClosedEvent}
                                />
                            </div>
                            <FieldError message={errors.lokasi} />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="text-sm font-semibold text-[#433552]">
                                Deskripsi Event
                            </span>
                            <textarea
                                rows={5}
                                value={data.deskripsi_event}
                                onChange={(event) =>
                                    setData(
                                        'deskripsi_event',
                                        event.target.value,
                                    )
                                }
                                placeholder="Tulis deskripsi lengkap event..."
                                className={`${inputClass(isClosedEvent)} min-h-[140px] resize-none py-3`}
                                disabled={isClosedEvent}
                            />
                            <FieldError message={errors.deskripsi_event} />
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#433552]">
                                Poin Event
                            </span>
                            <div className="relative">
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
                                    placeholder="0"
                                    className={`${inputClass(isClosedEvent)} pl-11`}
                                    disabled={isClosedEvent}
                                />
                            </div>
                            <FieldError message={errors.poin_event} />
                        </label>

                        {registrationIsOpen ? (
                            <label className="block">
                                <span className="text-sm font-semibold text-[#433552]">
                                    Link Pendaftaran{' '}
                                    <span className="text-[#D11149]">*</span>
                                </span>
                                <div className="relative">
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
                                        placeholder="https://..."
                                        className={`${inputClass(isClosedEvent)} pl-11`}
                                        disabled={isClosedEvent}
                                    />
                                </div>
                                <FieldError message={errors.link_pendaftaran} />
                            </label>
                        ) : (
                            <div className="rounded-2xl border border-[#E7DAF7] bg-[#FBF8FF] p-4 text-sm leading-6 text-[#6A5486]">
                                <p className="font-semibold text-[#4C00D8]">
                                    Link pendaftaran tidak diwajibkan
                                </p>
                                <p className="mt-1">
                                    Saat status registrasi bukan Open, admin
                                    tidak perlu mengisi link pendaftaran.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <UploadPreview
                            title="Gambar Card Event"
                            description="Gambar ini dipakai di daftar event publik."
                            preview={cardPreview}
                            onChange={(event) =>
                                updatePreview('poster_event', event)
                            }
                            error={errors.poster_event}
                            disabled={isClosedEvent}
                        />

                        <UploadPreview
                            title="Gambar Detail Event"
                            description="Gambar ini muncul saat user membuka halaman detail event."
                            preview={detailPreview}
                            onChange={(event) =>
                                updatePreview('detail_poster_event', event)
                            }
                            error={errors.detail_poster_event}
                            disabled={isClosedEvent}
                        />
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#EFE4F8] pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 text-sm text-[#6F6483]">
                            <CalendarDays className="h-5 w-5 text-[#6610F2]" />
                            <span>
                                {mode === 'edit'
                                    ? 'Perubahan akan langsung memperbarui event di halaman admin dan publik.'
                                    : 'Event yang disimpan akan tampil di halaman admin dan publik.'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/admin/event"
                                className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-bold text-[#5F5573] transition hover:bg-[#F7F1FF]"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-11 rounded-lg bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing
                                    ? mode === 'edit'
                                        ? 'Menyimpan Perubahan...'
                                        : 'Menyimpan Event...'
                                    : mode === 'edit'
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Event'}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
