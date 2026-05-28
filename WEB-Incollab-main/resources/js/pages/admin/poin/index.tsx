import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    FileText,
    Search,
    XCircle,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type ClaimStatus = 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak';

type Claim = {
    id: number;
    nama_lengkap: string | null;
    nim_user: string | null;
    nama_event: string | null;
    tanggal_mengikuti_event: string | null;
    nama_sertifikat: string | null;
    catatan_user: string | null;
    status_klaim: ClaimStatus;
    alasan_penolakan: string | null;
    file_bukti_url: string | null;
    points: number;
    submitted_at: string | null;
    reviewed_by: string | null;
    poin_diberikan_at: string | null;
};

type ClaimsPage = {
    data: Claim[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    from: number | null;
    to: number | null;
    total: number;
};

type PageProps = {
    claims: ClaimsPage;
    filters: {
        search: string;
        status: string;
    };
    statuses: ClaimStatus[];
    summary: {
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
    };
};

const statusStyles: Record<ClaimStatus, string> = {
    'Menunggu Verifikasi': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    Diterima: 'bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]',
    Ditolak: 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]',
};

function formatDate(date: string | null) {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

function cleanLabel(label: string) {
    return label.replace('&laquo;', '<').replace('&raquo;', '>');
}

function SummaryCard({
    title,
    value,
    tone,
    icon: Icon,
}: {
    title: string;
    value: number;
    tone: string;
    icon: typeof Clock3;
}) {
    return (
        <div className="rounded-2xl border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(56,42,73,0.05)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-[#766B8A]">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#1F1730]">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

function RejectForm({ claimId }: { claimId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        alasan_penolakan: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post(`/admin/poin/${claimId}/reject`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="mt-4 space-y-3">
            <textarea
                value={data.alasan_penolakan}
                onChange={(event) =>
                    setData('alasan_penolakan', event.target.value)
                }
                rows={3}
                placeholder="Tulis alasan penolakan..."
                className="w-full resize-none rounded-2xl border border-[#E2D4F3] px-4 py-3 text-sm outline-none focus:border-[#6610F2]"
            />
            {errors.alasan_penolakan && (
                <p className="text-sm font-medium text-red-600">
                    {errors.alasan_penolakan}
                </p>
            )}
            <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#D92D20] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                <XCircle className="h-4 w-4" />
                Tolak Klaim
            </button>
        </form>
    );
}

function ClaimRow({ claim }: { claim: Claim }) {
    const [showReject, setShowReject] = useState(false);
    const canReview = claim.status_klaim === 'Menunggu Verifikasi';

    function approveClaim() {
        router.post(
            `/admin/poin/${claim.id}/approve`,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <article className="rounded-[24px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(56,42,73,0.05)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[claim.status_klaim]}`}
                        >
                            {claim.status_klaim}
                        </span>
                        <span className="rounded-full bg-[#F4ECFE] px-3 py-1 text-xs font-bold text-[#6610F2]">
                            +{claim.points} poin
                        </span>
                    </div>

                    <h2 className="mt-3 text-xl font-bold text-[#211832]">
                        {claim.nama_event ?? 'Event'}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B617C]">
                        {claim.nama_lengkap ?? '-'} · {claim.nim_user ?? '-'}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm text-[#5F576D] md:grid-cols-2">
                        <p>
                            <span className="font-semibold text-[#342847]">
                                Tanggal ikut:
                            </span>{' '}
                            {formatDate(claim.tanggal_mengikuti_event)}
                        </p>
                        <p>
                            <span className="font-semibold text-[#342847]">
                                Nama sertifikat:
                            </span>{' '}
                            {claim.nama_sertifikat ?? '-'}
                        </p>
                        <p>
                            <span className="font-semibold text-[#342847]">
                                Diajukan:
                            </span>{' '}
                            {formatDate(claim.submitted_at)}
                        </p>
                        <p>
                            <span className="font-semibold text-[#342847]">
                                Direview:
                            </span>{' '}
                            {claim.reviewed_by ?? '-'}
                        </p>
                    </div>

                    {claim.catatan_user && (
                        <p className="mt-4 rounded-2xl bg-[#FCF9FF] px-4 py-3 text-sm leading-6 text-[#6B617C]">
                            {claim.catatan_user}
                        </p>
                    )}

                    {claim.alasan_penolakan && (
                        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                            Alasan penolakan: {claim.alasan_penolakan}
                        </p>
                    )}
                </div>

                <div className="flex w-full flex-col gap-3 xl:w-[220px]">
                    {claim.file_bukti_url && (
                        <a
                            href={claim.file_bukti_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8C7F3] px-4 py-3 text-sm font-semibold text-[#6610F2]"
                        >
                            <FileText className="h-4 w-4" />
                            Lihat Bukti
                        </a>
                    )}

                    {canReview && (
                        <>
                            <button
                                type="button"
                                onClick={approveClaim}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#12B76A] px-4 py-3 text-sm font-semibold text-white"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Setujui
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReject((value) => !value)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FEF3F2] px-4 py-3 text-sm font-semibold text-[#B42318]"
                            >
                                <XCircle className="h-4 w-4" />
                                Tolak
                            </button>
                        </>
                    )}
                </div>
            </div>

            {canReview && showReject && <RejectForm claimId={claim.id} />}
        </article>
    );
}

export default function AdminPoinIndex({
    claims,
    filters,
    statuses,
    summary,
}: PageProps) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    function applyFilters(nextSearch = search, nextStatus = status) {
        router.get(
            '/admin/poin',
            {
                search: nextSearch || undefined,
                status: nextStatus || undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    }

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        applyFilters();
    }

    return (
        <>
            <Head title="Kelola Poin" />
            <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                <p className="text-sm font-bold tracking-[0.12em] text-[#6610F2] uppercase">
                    Poin
                </p>
                <h1 className="mt-3 text-2xl font-bold text-[#1F1730]">
                    Kelola Poin
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766B8A]">
                    Verifikasi klaim poin event dari mahasiswa. Poin hanya
                    ditambahkan saat bukti disetujui dan tidak akan dobel untuk
                    klaim yang sama.
                </p>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-4">
                <SummaryCard
                    title="Total Klaim"
                    value={summary.total}
                    tone="bg-[#F4ECFE] text-[#6610F2]"
                    icon={FileText}
                />
                <SummaryCard
                    title="Menunggu"
                    value={summary.pending}
                    tone="bg-[#FFF7ED] text-[#C2410C]"
                    icon={Clock3}
                />
                <SummaryCard
                    title="Diterima"
                    value={summary.accepted}
                    tone="bg-[#ECFDF3] text-[#027A48]"
                    icon={CheckCircle2}
                />
                <SummaryCard
                    title="Ditolak"
                    value={summary.rejected}
                    tone="bg-[#FEF3F2] text-[#B42318]"
                    icon={XCircle}
                />
            </section>

            <section className="mt-6 rounded-[24px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(56,42,73,0.05)]">
                <form
                    onSubmit={submitFilters}
                    className="flex flex-col gap-3 lg:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A7A9E]" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama, NIM, event, atau sertifikat..."
                            className="h-12 w-full rounded-2xl border border-[#E2D4F3] pl-11 pr-4 text-sm outline-none focus:border-[#6610F2]"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(event) => {
                            const nextStatus = event.target.value;
                            setStatus(nextStatus);
                            applyFilters(search, nextStatus);
                        }}
                        className="h-12 rounded-2xl border border-[#E2D4F3] px-4 text-sm font-semibold text-[#342847] outline-none focus:border-[#6610F2]"
                    >
                        <option value="">Semua Status</option>
                        {statuses.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-[#6610F2] px-6 text-sm font-semibold text-white"
                    >
                        Filter
                    </button>
                </form>
            </section>

            <section className="mt-6 space-y-4">
                {claims.data.length > 0 ? (
                    claims.data.map((claim) => (
                        <ClaimRow key={claim.id} claim={claim} />
                    ))
                ) : (
                    <div className="rounded-[24px] border border-dashed border-[#DCCBFA] bg-white p-8 text-center">
                        <p className="text-sm font-bold tracking-[0.16em] text-[#6610F2] uppercase">
                            Belum Ada Klaim
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-[#241B35]">
                            Pengajuan klaim poin akan tampil di sini
                        </h2>
                    </div>
                )}
            </section>

            {claims.links.length > 3 && (
                <nav className="mt-6 flex flex-wrap justify-end gap-2">
                    {claims.links.map((link, index) => (
                        <button
                            key={`${link.label}-${index}`}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold ${
                                link.active
                                    ? 'border-[#6610F2] bg-[#6610F2] text-white'
                                    : 'border-[#E2D4F3] bg-white text-[#5F576D] disabled:opacity-40'
                            }`}
                        >
                            {cleanLabel(link.label)}
                        </button>
                    ))}
                </nav>
            )}
        </>
    );
}

AdminPoinIndex.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
