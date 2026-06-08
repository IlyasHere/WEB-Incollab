import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileUp,
    Gift,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

type ClaimEvent = {
    id: number;
    title: string;
    date: string | null;
    points: number;
    category: string | null;
};

type ExistingClaim = {
    status_klaim: string;
    alasan_penolakan: string | null;
    submitted_at: string | null;
};

type PageProps = {
    event: ClaimEvent | null;
    mahasiswa: {
        name: string;
        nim: string;
    };
    existingClaim: ExistingClaim | null;
    eventOptions: Array<{
        id: number;
        title: string;
        points: number;
    }>;
};

type ClaimForm = {
    nama_lengkap: string;
    nim_user: string;
    nama_event: string;
    tanggal_mengikuti_event: string;
    nama_sertifikat: string;
    file_bukti: File | null;
};

function formatDate(date: string | null) {
    if (!date) {
        return 'Tanggal event belum diisi';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

function InputError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-2 text-sm font-medium text-red-600">{message}</p>;
}

export default function EventPointClaimCreate({
    event,
    mahasiswa,
    existingClaim,
    eventOptions,
}: PageProps) {
    const { data, setData, post, processing, errors, progress } =
        useForm<ClaimForm>({
            nama_lengkap: mahasiswa.name ?? '',
            nim_user: mahasiswa.nim ?? '',
            nama_event: event?.title ?? '',
            tanggal_mengikuti_event: event?.date ?? '',
            nama_sertifikat: mahasiswa.name ?? '',
            file_bukti: null,
        });
    const generalEventError = (errors as Record<string, string>).event;

    function submit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        post(event ? `/event/${event.id}/klaim-poin` : '/klaim-poin-event', {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head
                title={
                    event ? `Klaim Poin - ${event.title}` : 'Klaim Poin Event'
                }
            />

            <main className="px-4 py-5 pb-16 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[980px]">
                    <Link
                        href={event ? `/event/${event.id}` : '/event'}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5F576D] transition hover:text-[#6610F2]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke detail event
                    </Link>

                    <section className="mt-5 rounded-[32px] bg-[linear-gradient(135deg,_#FBF7FF_0%,_#FFFFFF_100%)] p-6 shadow-[0_24px_60px_rgba(124,58,237,0.08)] ring-1 ring-[#EFE4F8] sm:p-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-sm font-bold tracking-[0.18em] text-[#6610F2] uppercase">
                                    Klaim Poin Event
                                </p>
                                <h1 className="mt-3 text-3xl font-bold text-[#211832]">
                                    Upload Bukti Sertifikat
                                </h1>
                                <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B617C]">
                                    Kirim bukti keikutsertaan setelah mengikuti
                                    event. Poin baru masuk setelah admin
                                    menyetujui bukti.
                                </p>
                            </div>

                            <div className="rounded-[24px] bg-[#F7F0FF] px-5 py-4 text-[#281A3D]">
                                <div className="flex items-center gap-3">
                                    <Gift className="h-5 w-5 text-[#6610F2]" />
                                    <span className="text-lg font-bold">
                                        {event
                                            ? `+${event.points} poin`
                                            : 'Verifikasi admin'}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-[#6A5F7D]">
                                    {event?.category ?? 'Klaim Event'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[#ECE1F8] bg-white p-5">
                            <h2 className="text-xl font-bold text-[#241B35]">
                                {event?.title ??
                                    'Isi nama event yang sudah kamu ikuti'}
                            </h2>
                            <div className="mt-3 flex items-center gap-2 text-sm text-[#6B617C]">
                                <CalendarDays className="h-4 w-4 text-[#6610F2]" />
                                <span>{formatDate(event?.date ?? null)}</span>
                            </div>
                        </div>

                        {existingClaim ? (
                            <div className="mt-6 rounded-[26px] border border-[#E6D8FF] bg-white p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EAFF] text-[#6610F2]">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold tracking-[0.16em] text-[#6610F2] uppercase">
                                            Pengajuan sudah ada
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-[#241B35]">
                                            Status: {existingClaim.status_klaim}
                                        </h2>
                                        {existingClaim.alasan_penolakan && (
                                            <p className="mt-3 text-sm leading-6 text-[#A43D3D]">
                                                Alasan penolakan:{' '}
                                                {existingClaim.alasan_penolakan}
                                            </p>
                                        )}
                                        <p className="mt-3 text-sm leading-6 text-[#6B617C]">
                                            Satu user hanya bisa mengajukan satu
                                            klaim untuk satu event.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={submit}
                                className="mt-6 grid gap-5 rounded-[26px] border border-[#ECE1F8] bg-white p-6"
                            >
                                {generalEventError && (
                                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                        {generalEventError}
                                    </div>
                                )}

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-[#342847]">
                                            Nama lengkap
                                        </span>
                                        <input
                                            value={data.nama_lengkap}
                                            onChange={(e) =>
                                                setData(
                                                    'nama_lengkap',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 h-12 w-full rounded-2xl border border-[#E2D4F3] px-4 text-sm outline-none focus:border-[#6610F2]"
                                        />
                                        <InputError
                                            message={errors.nama_lengkap}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-[#342847]">
                                            NIM / ID user
                                        </span>
                                        <input
                                            value={data.nim_user}
                                            onChange={(e) =>
                                                setData(
                                                    'nim_user',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 h-12 w-full rounded-2xl border border-[#E2D4F3] px-4 text-sm outline-none focus:border-[#6610F2]"
                                        />
                                        <InputError message={errors.nim_user} />
                                    </label>
                                </div>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#342847]">
                                        Nama event
                                    </span>
                                    <input
                                        value={data.nama_event}
                                        readOnly={Boolean(event)}
                                        list="event-options"
                                        onChange={(e) =>
                                            setData(
                                                'nama_event',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2 h-12 w-full rounded-2xl border border-[#E2D4F3] bg-[#FBF8FF] px-4 text-sm text-[#6B617C] outline-none focus:border-[#6610F2]"
                                    />
                                    <datalist id="event-options">
                                        {eventOptions.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.title}
                                            >
                                                {option.points} poin
                                            </option>
                                        ))}
                                    </datalist>
                                    <InputError message={errors.nama_event} />
                                </label>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-[#342847]">
                                            Tanggal mengikuti event
                                        </span>
                                        <input
                                            type="date"
                                            value={data.tanggal_mengikuti_event}
                                            onChange={(e) =>
                                                setData(
                                                    'tanggal_mengikuti_event',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 h-12 w-full rounded-2xl border border-[#E2D4F3] px-4 text-sm outline-none focus:border-[#6610F2]"
                                        />
                                        <InputError
                                            message={
                                                errors.tanggal_mengikuti_event
                                            }
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-[#342847]">
                                            Nama yang tertera di sertifikat
                                        </span>
                                        <input
                                            value={data.nama_sertifikat}
                                            onChange={(e) =>
                                                setData(
                                                    'nama_sertifikat',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 h-12 w-full rounded-2xl border border-[#E2D4F3] px-4 text-sm outline-none focus:border-[#6610F2]"
                                        />
                                        <InputError
                                            message={errors.nama_sertifikat}
                                        />
                                    </label>
                                </div>

                                <label className="block rounded-[24px] border border-dashed border-[#C9B1F5] bg-[#FCF9FF] p-5">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-[#342847]">
                                        <FileUp className="h-4 w-4 text-[#6610F2]" />
                                        Upload file sertifikat
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) =>
                                            setData(
                                                'file_bukti',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                        className="mt-4 block w-full text-sm text-[#6B617C] file:mr-4 file:rounded-xl file:border-0 file:bg-[#6610F2] file:px-4 file:py-2 file:font-semibold file:text-white"
                                    />
                                    <p className="mt-3 text-xs text-[#7A708E]">
                                        Format PDF, JPG, JPEG, atau PNG.
                                        Maksimal 5MB.
                                    </p>
                                    {progress && (
                                        <p className="mt-2 text-sm font-semibold text-[#6610F2]">
                                            Upload {progress.percentage}%
                                        </p>
                                    )}
                                    <InputError message={errors.file_bukti} />
                                </label>

                                <div className="flex flex-wrap items-center justify-end gap-3">
                                    <Link
                                        href={
                                            event
                                                ? `/event/${event.id}`
                                                : '/event'
                                        }
                                        className="rounded-2xl border border-[#D8C7F3] px-5 py-3 text-sm font-semibold text-[#5F576D]"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-2xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {processing
                                            ? 'Mengirim...'
                                            : 'Kirim Klaim Poin'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

EventPointClaimCreate.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
