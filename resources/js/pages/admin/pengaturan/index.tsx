import { Head, Link, router, useForm } from '@inertiajs/react';
import { Camera, Home, LogOut, Pencil, Save, UserRound, X } from 'lucide-react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

type AdminProfile = {
    name: string;
    email: string;
    avatar: string | null;
};

type AdminPengaturanProps = {
    profileUser: AdminProfile;
};

type AdminProfileForm = {
    name: string;
    avatar: File | null;
};

export default function AdminPengaturanIndex({
    profileUser,
}: AdminPengaturanProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initials = useMemo(
        () =>
            profileUser.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase(),
        [profileUser.name],
    );

    const { data, setData, post, processing, errors, reset } =
        useForm<AdminProfileForm>({
            name: profileUser.name ?? '',
            avatar: null,
        });

    const changeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isEditing) {
            return;
        }

        const file = event.target.files?.[0] ?? null;
        setData('avatar', file);
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isEditing) {
            return;
        }

        post('/admin/pengaturan', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setAvatarPreview(null);
            },
        });
    };

    const cancelEdit = () => {
        reset();
        setAvatarPreview(null);
        setIsEditing(false);
    };

    return (
        <>
            <Head title="Pengaturan Admin" />

            <main
                className="min-h-screen bg-[#FBF7FF] px-4 py-8 text-[#1F1730] sm:px-6 lg:px-8"
                style={{
                    fontFamily:
                        '"Plus Jakarta Sans", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
                }}
            >
                <div className="mx-auto max-w-[1320px] space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-3xl font-bold text-[#1F1730]">
                            Pengaturan
                        </h1>

                        <Link
                            href="/admin/dashboard"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D8CDE8] bg-white px-4 text-sm font-semibold text-[#6610F2] transition hover:bg-[#F7F1FF]"
                        >
                            <Home className="h-4 w-4" />
                            Kembali ke Beranda
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                        <aside className="h-fit rounded-2xl border border-[#EFE4F8] bg-white p-4 shadow-[0_18px_45px_rgba(177,145,221,0.12)]">
                            <h2 className="px-3 pb-4 text-xl font-bold text-[#1F1730]">
                                Settings
                            </h2>

                            <div className="space-y-1">
                                <Link
                                    href="/admin/pengaturan"
                                    className="flex w-full items-center gap-3 rounded-xl bg-[#F3ECFF] px-3 py-3 text-sm font-semibold text-[#6610F2]"
                                >
                                    <UserRound className="h-4 w-4" />
                                    Profile
                                </Link>

                                <div className="my-3 border-t border-[#EFE4F8]" />

                                <button
                                    type="button"
                                    onClick={() => router.post('/logout')}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#D11149] transition hover:bg-[#FFF0F4]"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </div>
                        </aside>

                        <form
                            onSubmit={submit}
                            className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(177,145,221,0.12)]"
                        >
                            <div className="mb-8 flex flex-col gap-4 border-b border-[#EFE4F8] pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-[#382A49]">
                                        Profile
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766B8A]">
                                        Kelola username dan foto profil akun
                                        admin.
                                    </p>
                                </div>

                                {!isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(102,16,242,0.22)] transition hover:bg-[#570DD1]"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit Profil
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                                <div className="h-fit rounded-2xl border border-dashed border-[#B88CFF] p-6 text-center">
                                    <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6610F2,#A855F7)] text-3xl font-bold text-white">
                                        {avatarPreview || profileUser.avatar ? (
                                            <img
                                                src={
                                                    avatarPreview ??
                                                    profileUser.avatar ??
                                                    ''
                                                }
                                                alt={profileUser.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-[#382A49]">
                                        {profileUser.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#766B8A]">
                                        {profileUser.email}
                                    </p>

                                    <label
                                        className={`mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                                            isEditing
                                                ? 'cursor-pointer bg-[#6610F2] text-white hover:bg-[#570DD1]'
                                                : 'cursor-not-allowed bg-[#F4F0F8] text-[#9B8FB3]'
                                        }`}
                                    >
                                        <Camera className="h-4 w-4" />
                                        Ubah Foto
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={!isEditing}
                                            onChange={changeAvatar}
                                            className="hidden"
                                        />
                                    </label>
                                    {errors.avatar && (
                                        <InputError>{errors.avatar}</InputError>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <FormSection title="Informasi Akun">
                                        <InputField
                                            label="Username"
                                            value={data.name}
                                            error={errors.name}
                                            disabled={!isEditing || processing}
                                            onChange={(value) =>
                                                setData('name', value)
                                            }
                                        />

                                        <InputField
                                            label="Email"
                                            value={profileUser.email}
                                            disabled
                                            onChange={() => undefined}
                                        />
                                    </FormSection>

                                    {isEditing && (
                                        <div className="flex justify-end gap-3 border-t border-[#EFE4F8] pt-6">
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={cancelEdit}
                                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#BFB5CF] px-5 text-sm font-semibold text-[#5E5873] transition hover:bg-[#F8F3FF] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <X className="h-4 w-4" />
                                                Batal
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(102,16,242,0.22)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <Save className="h-4 w-4" />
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

function FormSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section>
            <div className="mb-5 border-b border-[#EFE4F8] pb-3">
                <h2 className="font-semibold text-[#382A49]">{title}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">{children}</div>
        </section>
    );
}

function InputField({
    label,
    value,
    error,
    disabled = false,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#5E5873]">
                {label}
            </label>
            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10 disabled:bg-[#F7F1FF] disabled:text-[#8A7FA2]"
            />
            {error && <InputError>{error}</InputError>}
        </div>
    );
}

function InputError({ children }: { children: ReactNode }) {
    return <p className="mt-2 text-sm text-[#D11149]">{children}</p>;
}
