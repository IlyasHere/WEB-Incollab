export type ReportStatus = 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';

export type Report = {
    id: number;
    code: string;
    reporter: string;
    userId: string;
    category: string;
    date: string;
    status: ReportStatus;
    attachmentsCount: number;
};

export type ReportsPage = {
    data: Report[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type Summary = {
    total: number;
    baru: number;
    diproses: number;
    selesai: number;
};

export type Filters = {
    search: string;
    category: string;
    status: string;
};

export type AdminPengaduanIndexProps = {
    reports: ReportsPage;
    summary: Summary;
    filters: Filters;
    categories: string[];
    statuses: ReportStatus[];
};
