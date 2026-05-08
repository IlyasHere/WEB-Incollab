import { X } from 'lucide-react';
import FeedLivePreview from '@/components/feed/FeedLivePreview';
import type {
    FeedPreviewImage,
    FeedPreviewUser,
} from '@/components/feed/FeedLivePreview';

type LivePreviewModalProps = {
    open: boolean;
    onClose: () => void;
    user: FeedPreviewUser;
    title: string;
    content: string;
    tags: string[];
    images: FeedPreviewImage[];
};

export default function LivePreviewModal({
    open,
    onClose,
    user,
    title,
    content,
    tags,
    images,
}: LivePreviewModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end bg-[#1F1730]/45 px-3 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
            <section className="max-h-[90vh] w-full overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)] sm:max-w-lg">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EFE4F8] bg-white px-5 py-4">
                    <h2 className="text-lg font-extrabold text-[#1F1730]">
                        Preview Postingan
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                        aria-label="Tutup preview"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="bg-[#FBF7FF] p-4">
                    <FeedLivePreview
                        user={user}
                        title={title}
                        content={content}
                        tags={tags}
                        images={images}
                    />
                </div>
            </section>
        </div>
    );
}
