import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Download,
    Eye,
    FileText,
    History,
    Info,
    Paperclip,
    Save,
    ShieldCheck,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type ReportStatus = 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';

type Attachment = {
    id: number;
    type: 'image' | 'file';
    name: string;
    url: string;
};

type ReportDetail = {
    id: number;
    code: string;
    category: string;
    description: string;
    status: ReportStatus;
    adminNote: string;
    createdAt: string;
    createdAtDetail: string;
    handledAtDetail: string | null;
    reporter: {
        name: string;
        username: string;
        userId: string;
        avatar: string | null;
    };
    attachments: Attachment[];
};

type AdminPengaduanDetailProps = {
    report: ReportDetail;
    statuses: ReportStatus[];
};

const imageFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320" viewBox="0 0 420 320"><rect width="420" height="320" rx="28" fill="#D6F3EF"/><rect x="154" y="32" width="112" height="256" rx="20" fill="#1F1730"/><rect x="162" y="44" width="96" height="232" rx="14" fill="#fff"/><rect x="180" y="76" width="60" height="8" rx="4" fill="#6610F2"/><rect x="178" y="112" width="64" height="18" rx="9" fill="#EAF6FF"/><rect x="178" y="146" width="44" height="18" rx="9" fill="#F0E7FF"/><rect x="178" y="180" width="70" height="18" rx="9" fill="#FFF0E0"/><circle cx="210" cy="244" r="13" fill="#F0E7FF"/></svg>`,
    );

export default function AdminPengaduanDetail({
    report,
    statuses,
}: AdminPengaduanDetailProps) {
    const [selectedAttachment, setSelectedAttachment] =
        useState<Attachment | null>(null);

    return (
        <>
            <Head title="Detail Pengaduan" />

            <div className="min-h-[calc(100vh-8rem)] rounded-[28px] bg-[#FBF7FF] px-3 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1040px]">
                    <Link
                        href="/admin/pengaduan"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#766B8A] transition hover:text-[#6610F2]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pengaduan
                    </Link>

                    <header className="mt-8 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-[#1F1730]">
                            Detail Pengaduan
                        </h1>
                        <span className="text-sm font-bold text-[#C0B5D2]">
                            #{report.code}
                        </span>
                        <StatusBadge status={report.status} />
                    </header>

                    <main className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <InfoCard report={report} />
                            <DescriptionCard description={report.description} />

                            <div className="grid gap-6 md:grid-cols-2">
                                <AttachmentCard
                                    attachments={report.attachments}
                                    onPreview={setSelectedAttachment}
                                />
                                <TimelineCard report={report} />
                            </div>
                        </div>

                        <AdminActionCard report={report} statuses={statuses} />
                    </main>
                </div>
            </div>

            {selectedAttachment?.type === 'image' && (
                <AttachmentPreviewModal
                    attachment={selectedAttachment}
                    onClose={() => setSelectedAttachment(null)}
                />
            )}
        </>
    );
}

function InfoCard({ report }: { report: ReportDetail }) {
    return (
        <Card>
            <CardTitle icon={Info}>Informasi Laporan</CardTitle>

            <div className="mt-8 grid gap-7 md:grid-cols-2">
                <InfoItem label="Kategori">
                    <span className="inline-flex rounded-lg border border-[#FFD0C5] bg-[#FFF4EF] px-3 py-2 font-semibold text-[#1F1730]">
                        {report.category}
                    </span>
                </InfoItem>

                <InfoItem label="Tanggal Dibuat">
                    <span className="inline-flex items-center gap-2 font-semibold text-[#382A49]">
                        <CalendarDays className="h-4 w-4 text-[#766B8A]" />
                        {report.createdAt}
                    </span>
                </InfoItem>

                <InfoItem label="Pelapor">
                    <div className="flex w-full max-w-[320px] items-center gap-3 rounded-xl border border-[#E4D8F2] bg-[#FBF7FF] p-3">
                        {report.reporter.avatar ? (
                            <img
                                src={report.reporter.avatar}
                                alt={report.reporter.name}
                                className="h-11 w-11 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0E7FF] text-sm font-extrabold text-[#6610F2]">
                                {initials(report.reporter.name)}
                            </span>
                        )}
                        <div>
                            <p className="font-extrabold text-[#1F1730]">
                                {report.reporter.name}
                            </p>
                            <p className="text-sm font-medium text-[#8A7FA2]">
                                {report.reporter.username}
                            </p>
                        </div>
                    </div>
                </InfoItem>

                <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem label="ID Laporan">
                        <p className="font-bold text-[#382A49]">
                            #{report.code}
                        </p>
                    </InfoItem>
                    <InfoItem label="User ID">
                        <p className="font-bold text-[#382A49]">
                            {report.reporter.userId}
                        </p>
                    </InfoItem>
                </div>
            </div>
        </Card>
    );
}

function DescriptionCard({ description }: { description: string }) {
    return (
        <Card>
            <CardTitle icon={FileText}>Deskripsi Laporan</CardTitle>
            <div className="mt-5 rounded-xl border-l-4 border-[#6610F2] bg-[#F0E7FF] px-5 py-5 text-sm leading-7 text-[#382A49] sm:text-base">
                {description}
            </div>
        </Card>
    );
}

function AttachmentCard({
    attachments,
    onPreview,
}: {
    attachments: Attachment[];
    onPreview: (attachment: Attachment) => void;
}) {
    return (
        <Card className="min-h-[250px]">
            <CardTitle icon={Paperclip}>Bukti Lampiran</CardTitle>

            {attachments.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                    {attachments.map((attachment, index) =>
                        attachment.type === 'image' ? (
                            <button
                                key={attachment.id}
                                type="button"
                                onClick={() => onPreview(attachment)}
                                className="group relative h-[122px] overflow-hidden rounded-xl border border-[#EFE4F8] bg-[#F7F1FF]"
                            >
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    onError={(event) => {
                                        event.currentTarget.src = imageFallback;
                                    }}
                                    className="h-full w-full object-cover"
                                />
                                <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white opacity-0 transition duration-200 group-hover:opacity-100">
                                    <Eye className="h-6 w-6" />
                                    <span className="mt-1 text-xs font-bold">
                                        Lihat
                                    </span>
                                </span>
                                <span className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-[#6610F2]">
                                    {index + 1}
                                </span>
                            </button>
                        ) : (
                            <div
                                key={attachment.id}
                                className="flex h-[122px] flex-col items-center justify-center rounded-xl border border-[#EFE4F8] bg-[#FBF7FF] p-3 text-center"
                            >
                                <FileText className="h-8 w-8 text-[#766B8A]" />
                                <p className="mt-2 max-w-full truncate text-sm font-medium text-[#766B8A]">
                                    {attachment.name}
                                </p>
                                <a
                                    href={attachment.url}
                                    download={attachment.name}
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#6610F2]"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Download
                                </a>
                            </div>
                        ),
                    )}
                </div>
            ) : (
                <div className="mt-5 rounded-xl border border-dashed border-[#D8CDE8] bg-[#FBF7FF] p-5 text-sm text-[#766B8A]">
                    Tidak ada lampiran gambar.
                </div>
            )}
        </Card>
    );
}

function TimelineCard({ report }: { report: ReportDetail }) {
    const items = [
        {
            title: 'Laporan Diterima Sistem',
            time: report.createdAtDetail,
            active: true,
        },
        {
            title: 'Laporan Dibuat oleh Pelapor',
            time: report.createdAtDetail,
            active: false,
        },
        ...(report.handledAtDetail
            ? [
                  {
                      title: 'Laporan Ditangani Admin',
                      time: report.handledAtDetail,
                      active: false,
                  },
              ]
            : []),
    ];

    return (
        <Card className="min-h-[250px]">
            <CardTitle icon={History}>Riwayat</CardTitle>

            <div className="mt-6 space-y-6">
                {items.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className="relative flex gap-4"
                    >
                        {index < items.length - 1 && (
                            <span className="absolute top-4 left-[5px] h-[58px] w-px bg-[#E8DDF4]" />
                        )}
                        <span
                            className={`mt-1 h-3 w-3 rounded-full ${
                                item.active ? 'bg-[#1A8FE3]' : 'bg-[#E8DDF4]'
                            }`}
                        />
                        <div>
                            <p className="font-semibold text-[#382A49]">
                                {item.title}
                            </p>
                            <p className="mt-1 text-sm text-[#766B8A]">
                                {item.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function AdminActionCard({
    report,
    statuses,
}: {
    report: ReportDetail;
    statuses: ReportStatus[];
}) {
    const allowedStatuses = getAllowedStatuses(report.status, statuses);
    const isFinalStatus =
        report.status === 'Selesai' || report.status === 'Ditolak';
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            status_laporan: report.status,
            catatan_admin: report.adminNote,
        });

    const submit = () => {
        put(`/admin/pengaduan/${report.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <aside className="h-fit rounded-[24px] border border-[#D9C3F5] bg-white p-6 shadow-[0_18px_45px_rgba(177,145,221,0.16)]">
            <CardTitle icon={ShieldCheck}>Tindakan Admin</CardTitle>

            <div className="mt-7 space-y-6">
                <label className="block">
                    <span className="text-sm font-semibold text-[#382A49]">
                        Ubah Status
                    </span>
                    <select
                        value={data.status_laporan}
                        disabled={isFinalStatus || processing}
                        onChange={(event) =>
                            setData(
                                'status_laporan',
                                event.target.value as ReportStatus,
                            )
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-[#D8CDE8] bg-[#FBF7FF] px-4 text-sm font-semibold text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {allowedStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {isFinalStatus && (
                        <p className="mt-2 text-sm font-medium text-[#766B8A]">
                            Status final sudah dikunci.
                        </p>
                    )}
                    {errors.status_laporan && (
                        <p className="mt-2 text-sm font-medium text-[#D11149]">
                            {errors.status_laporan}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-[#382A49]">
                        Catatan Investigasi Admin
                    </span>
                    <textarea
                        rows={5}
                        value={data.catatan_admin}
                        disabled={isFinalStatus || processing}
                        onChange={(event) =>
                            setData('catatan_admin', event.target.value)
                        }
                        placeholder="Ketik catatan internal investigasi di sini..."
                        className="mt-2 w-full resize-none rounded-xl border border-[#D8CDE8] bg-[#FBF7FF] px-4 py-3 text-sm leading-6 text-[#382A49] transition outline-none placeholder:text-[#8A7FA2] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                    {errors.catatan_admin && (
                        <p className="mt-2 text-sm font-medium text-[#D11149]">
                            {errors.catatan_admin}
                        </p>
                    )}
                </label>

                <div>
                    <button
                        type="button"
                        disabled={processing || isFinalStatus}
                        onClick={submit}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6610F2] text-sm font-bold text-white shadow-[0_14px_24px_rgba(102,16,242,0.28)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save className="h-4 w-4" />
                        {processing
                            ? 'Menyimpan...'
                            : isFinalStatus
                              ? 'Status Final'
                              : 'Simpan Perubahan'}
                    </button>
                    {recentlySuccessful && (
                        <p className="mt-3 text-center text-sm font-semibold text-[#15803D]">
                            Laporan berhasil diperbarui.
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}

function AttachmentPreviewModal({
    attachment,
    onClose,
}: {
    attachment: Attachment;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <section className="relative max-w-4xl rounded-2xl bg-white p-4 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#382A49] shadow-lg transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                    aria-label="Tutup preview"
                >
                    <X className="h-5 w-5" />
                </button>

                <img
                    src={attachment.url}
                    alt={attachment.name}
                    onError={(event) => {
                        event.currentTarget.src = imageFallback;
                    }}
                    className="max-h-[75vh] max-w-full rounded-xl object-contain"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="truncate text-sm font-bold text-[#382A49]">
                        {attachment.name}
                    </p>
                    <a
                        href={attachment.url}
                        download={attachment.name}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-5 text-sm font-bold text-white transition hover:bg-[#570DD1]"
                    >
                        <Download className="h-4 w-4" />
                        Download Gambar
                    </a>
                </div>
            </section>
        </div>
    );
}

function Card({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`rounded-[24px] border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(177,145,221,0.12)] ${className}`}
        >
            {children}
        </section>
    );
}

function CardTitle({
    icon: Icon,
    children,
}: {
    icon: typeof Info;
    children: ReactNode;
}) {
    return (
        <h2 className="flex items-center gap-3 text-base font-semibold text-[#1F1730]">
            <Icon className="h-5 w-5 text-[#6610F2]" />
            {children}
        </h2>
    );
}

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-[#766B8A] uppercase">
                {label}
            </p>
            {children}
        </div>
    );
}

function getAllowedStatuses(
    currentStatus: ReportStatus,
    statuses: ReportStatus[],
) {
    const allowedByStatus: Record<ReportStatus, ReportStatus[]> = {
        Baru: ['Baru', 'Diproses', 'Ditolak'],
        Diproses: ['Diproses', 'Selesai', 'Ditolak'],
        Selesai: ['Selesai'],
        Ditolak: ['Ditolak'],
    };

    return statuses.filter((status) =>
        allowedByStatus[currentStatus].includes(status),
    );
}

function StatusBadge({ status }: { status: ReportStatus }) {
    const styles: Record<ReportStatus, string> = {
        Baru: 'bg-[#EAF6FF] text-[#1A8FE3]',
        Diproses: 'bg-[#FFF0E0] text-[#F37933]',
        Selesai: 'bg-[#F0E7FF] text-[#6610F2]',
        Ditolak: 'bg-[#FFE3EA] text-[#D11149]',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${styles[status]}`}
        >
            {status}
        </span>
    );
}

function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

AdminPengaduanDetail.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
