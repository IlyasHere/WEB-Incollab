export type EventItem = {
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
    visibility_status: string | null;
    registration_status: string | null;
    poster_url: string | null;
    detail_poster_url?: string | null;
    created_at?: string | null;
    organizer: string | null;
    admin_name: string | null;
};

export type EventsPage = {
    data: EventItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type EventFilters = {
    search: string;
    category: string;
    visibility: string;
    registration_status: string;
};

export type EventSummary = {
    total: number;
    upcoming: number;
    published: number;
};

export type EventFormValues = {
    judul_event: string;
    deskripsi_event: string;
    tanggal_event: string;
    tanggal_selesai: string;
    lokasi: string;
    kategori_event: string;
    poin_event: string;
    link_pendaftaran: string;
    visibility_status: string;
    registration_status: string;
    poster_event: File | null;
    detail_poster_event: File | null;
    penyelenggara: string;
};
