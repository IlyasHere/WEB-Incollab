import { useForm } from '@inertiajs/react';
import {
    ChevronDown,
    Github,
    HelpCircle,
    Instagram,
    Linkedin,
    Pencil,
    Search,
} from 'lucide-react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import SettingsPageLayout from '@/layouts/SettingsPageLayout';
import type { User } from '@/types/auth';

type MahasiswaProfile = {
    bio: string | null;
    foto: string | null;
    universitas: string | null;
    jurusan: string | null;
    angkatan: string | null;
    semester: number | null;
    skill: string[] | null;
    minat: string[] | null;
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    total_poin: number;
};

type PengaturanProps = {
    profileUser: User;
    mahasiswa: MahasiswaProfile;
    universities: UniversityOption[];
};

type UniversityOption = {
    name: string;
    lldikti_region: string | null;
};

type ProfileForm = {
    name: string;
    universitas: string;
    jurusan: string;
    angkatan: string;
    semester: string;
    bio: string;
    skill: string[];
    minat: string[];
    instagram: string;
    linkedin: string;
    github: string;
    portfolio: string;
    foto: File | null;
};

const interestOptions = ['Teknologi', 'Desain', 'Bisnis', 'Sains', 'Seni'];

export default function Pengaturan({
    profileUser,
    mahasiswa,
    universities,
}: PengaturanProps) {
    const [skillInput, setSkillInput] = useState('');
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const initials = profileUser.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const initialAvatar = useMemo(() => {
        if (mahasiswa.foto) {
            return `/storage/${mahasiswa.foto}`;
        }

        if (profileUser.avatar) {
            return profileUser.avatar;
        }

        return null;
    }, [mahasiswa.foto, profileUser.avatar]);

    const { data, setData, put, processing, errors, reset } =
        useForm<ProfileForm>({
            name: profileUser.name ?? '',
            universitas: mahasiswa.universitas ?? '',
            jurusan: mahasiswa.jurusan ?? '',
            angkatan: mahasiswa.angkatan ?? '',
            semester: mahasiswa.semester ? String(mahasiswa.semester) : '',
            bio: mahasiswa.bio ?? '',
            skill: mahasiswa.skill ?? [],
            minat: mahasiswa.minat ?? [],
            instagram: mahasiswa.instagram ?? '',
            linkedin: mahasiswa.linkedin ?? '',
            github: mahasiswa.github ?? '',
            portfolio: mahasiswa.portfolio ?? '',
            foto: null,
        });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isEditing) {
            return;
        }

        put('/pengaturan', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setFotoPreview(null);
            },
        });
    };

    const addSkill = () => {
        if (!isEditing) {
            return;
        }

        const nextSkill = skillInput.trim();

        if (!nextSkill || data.skill.length >= 5) {
            return;
        }

        if (data.skill.includes(nextSkill)) {
            setSkillInput('');

            return;
        }

        setData('skill', [...data.skill, nextSkill]);
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        if (!isEditing) {
            return;
        }

        setData(
            'skill',
            data.skill.filter((item) => item !== skill),
        );
    };

    const toggleMinat = (item: string) => {
        if (!isEditing) {
            return;
        }

        setData(
            'minat',
            data.minat.includes(item)
                ? data.minat.filter((selected) => selected !== item)
                : [...data.minat, item],
        );
    };

    const changeFoto = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isEditing) {
            return;
        }

        const file = event.target.files?.[0] ?? null;

        setData('foto', file);
        setFotoPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <SettingsPageLayout title="Pengaturan">
            <form
                onSubmit={submit}
                className="grid gap-8 lg:grid-cols-[280px_1fr]"
            >
                <div>
                    <div className="rounded-[20px] border border-dashed border-[#B88CFF] p-6 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6610F2,#A855F7)] text-2xl font-bold text-white">
                            {fotoPreview || initialAvatar ? (
                                <img
                                    src={fotoPreview ?? initialAvatar ?? ''}
                                    alt={profileUser.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>

                        <div className="mt-5 flex justify-center gap-3">
                            <label
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                    isEditing
                                        ? 'cursor-pointer bg-[#6610F2] text-white hover:bg-[#570DD1]'
                                        : 'cursor-not-allowed bg-[#EEE9F5] text-[#9B8FB3]'
                                }`}
                            >
                                Ubah
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={!isEditing}
                                    onChange={changeFoto}
                                />
                            </label>
                            <button
                                type="button"
                                disabled={!isEditing}
                                onClick={() => {
                                    setData('foto', null);
                                    setFotoPreview(null);
                                }}
                                className="rounded-xl bg-[#F3ECFF] px-4 py-2 text-sm font-semibold text-[#5E5873] transition hover:bg-[#E9D8FF] disabled:cursor-not-allowed disabled:bg-[#EEE9F5] disabled:text-[#9B8FB3]"
                            >
                                Hapus
                            </button>
                        </div>
                        {errors.foto && <InputError>{errors.foto}</InputError>}
                    </div>

                    <div className="mt-6 rounded-[20px] border border-[#EFE4F8] p-5">
                        <h3 className="text-sm font-semibold text-[#382A49]">
                            Pratinjau Sosial
                        </h3>

                        <div className="mt-4 space-y-4 text-sm text-[#6E6380]">
                            <SocialPreview icon={Instagram}>
                                {data.instagram || '-'}
                            </SocialPreview>
                            <SocialPreview icon={Linkedin}>
                                {data.linkedin || '-'}
                            </SocialPreview>
                            <SocialPreview icon={Github}>
                                {data.github || '-'}
                            </SocialPreview>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-6 flex flex-col gap-3 border-b border-[#EFE4F8] pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#382A49]">
                                Edit Profile
                            </h2>
                            <p className="mt-1 text-sm text-[#766B8A]">
                                Mode baca aktif agar profil aman dari perubahan
                                tidak sengaja.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(102,16,242,0.22)] transition hover:bg-[#570DD1]"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    <FormSection
                        title="Informasi Pribadi"
                        help={<ProfileHelpTooltip />}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Nama Lengkap"
                                value={data.name}
                                error={errors.name}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('name', value)}
                            />
                        </div>

                        <UniversityCombobox
                            label="Universitas"
                            value={data.universitas}
                            options={universities}
                            error={errors.universitas}
                            disabled={!isEditing || processing}
                            onChange={(value) => setData('universitas', value)}
                        />

                        <div className="grid gap-4 md:grid-cols-[1fr_140px_140px]">
                            <InputField
                                label="Jurusan"
                                value={data.jurusan}
                                error={errors.jurusan}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('jurusan', value)}
                            />
                            <InputField
                                label="Angkatan"
                                value={data.angkatan}
                                error={errors.angkatan}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('angkatan', value)}
                            />
                            <InputField
                                label="Semester"
                                type="number"
                                value={data.semester}
                                error={errors.semester}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('semester', value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#5E5873]">
                                Bio
                            </label>
                            <textarea
                                rows={3}
                                value={data.bio}
                                maxLength={300}
                                disabled={!isEditing || processing}
                                onChange={(event) =>
                                    setData('bio', event.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-[#D8CDE8] px-4 py-3 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10 disabled:bg-[#F7F1FF] disabled:text-[#8A7FA2]"
                            />
                            {errors.bio && (
                                <InputError>{errors.bio}</InputError>
                            )}
                            <p className="mt-1 text-right text-xs text-[#8A7FA2]">
                                {data.bio.length}/300
                            </p>
                        </div>
                    </FormSection>

                    <FormSection title="Skill & Minat">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-3 block text-sm font-medium text-[#5E5873]">
                                    Skill Utama Maks 5
                                </label>

                                <div className="mb-3 flex flex-wrap gap-2">
                                    {data.skill.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            disabled={!isEditing || processing}
                                            onClick={() => removeSkill(skill)}
                                            className="rounded-full bg-[#6610F2] px-3 py-1.5 text-sm font-medium text-white disabled:cursor-default disabled:bg-[#F3ECFF] disabled:text-[#6610F2]"
                                        >
                                            {skill} x
                                        </button>
                                    ))}
                                </div>

                                <div className="flex rounded-xl border border-[#D8CDE8]">
                                    <input
                                        value={skillInput}
                                        disabled={!isEditing || processing}
                                        onChange={(event) =>
                                            setSkillInput(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        placeholder="Ketik untuk menambah skill..."
                                        className="h-11 flex-1 rounded-l-xl px-4 text-sm outline-none disabled:bg-[#F7F1FF] disabled:text-[#8A7FA2]"
                                    />
                                    <button
                                        type="button"
                                        disabled={!isEditing || processing}
                                        onClick={addSkill}
                                        className="px-4 text-lg font-bold text-[#6610F2] disabled:cursor-not-allowed disabled:text-[#9B8FB3]"
                                    >
                                        +
                                    </button>
                                </div>
                                {errors.skill && (
                                    <InputError>{errors.skill}</InputError>
                                )}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-medium text-[#5E5873]">
                                    Bidang Minat
                                </label>

                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map((item) => {
                                        const active =
                                            data.minat.includes(item);

                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                disabled={
                                                    !isEditing || processing
                                                }
                                                onClick={() =>
                                                    toggleMinat(item)
                                                }
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    active
                                                        ? 'border-[#6610F2] bg-[#F3ECFF] text-[#6610F2]'
                                                        : 'border-[#D8CDE8] text-[#6E6380] hover:border-[#6610F2] hover:text-[#6610F2]'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.minat && (
                                    <InputError>{errors.minat}</InputError>
                                )}
                            </div>
                        </div>

                    </FormSection>

                    <FormSection title="Kontak & Tautan">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Instagram"
                                value={data.instagram}
                                error={errors.instagram}
                                disabled={!isEditing || processing}
                                onChange={(value) =>
                                    setData('instagram', value)
                                }
                            />
                            <InputField
                                label="LinkedIn"
                                value={data.linkedin}
                                error={errors.linkedin}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('linkedin', value)}
                            />
                            <InputField
                                label="GitHub"
                                value={data.github}
                                error={errors.github}
                                disabled={!isEditing || processing}
                                onChange={(value) => setData('github', value)}
                            />
                         
                        </div>

                        <InputField
                            label="Portfolio / Website"
                            value={data.portfolio}
                            error={errors.portfolio}
                            disabled={!isEditing || processing}
                            onChange={(value) => setData('portfolio', value)}
                        />
                    </FormSection>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-3 border-t border-[#EFE4F8] pt-6">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => {
                                    reset();
                                    setSkillInput('');
                                    setFotoPreview(null);
                                    setIsEditing(false);
                                }}
                                className="rounded-xl border border-[#BFB5CF] px-6 py-3 text-sm font-semibold text-[#5E5873] transition hover:bg-[#F8F3FF] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(102,16,242,0.25)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </SettingsPageLayout>
    );
}

function SocialPreview({
    icon: Icon,
    children,
}: {
    icon: typeof Instagram;
    children: ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-[#6610F2]" />
            {children}
        </div>
    );
}

function FormSection({
    title,
    help,
    children,
}: {
    title: string;
    help?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="mb-8">
            <div className="mb-5 flex items-center gap-2 border-b border-[#EFE4F8] pb-3">
                <h2 className="font-semibold text-[#382A49]">{title}</h2>
                {help}
            </div>

            <div className="space-y-4">{children}</div>
        </section>
    );
}

function ProfileHelpTooltip() {
    return (
        <div className="group relative">
            <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6610F2] transition hover:bg-[#F3ECFF]"
                aria-label="Panduan informasi pribadi"
            >
                <HelpCircle className="h-4 w-4" />
            </button>

            <div className="pointer-events-none absolute left-1/2 z-20 mt-3 w-[min(20rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-2 rounded-2xl border border-[#EFE4F8] bg-white p-4 text-sm text-[#5E5873] opacity-0 shadow-[0_18px_45px_rgba(56,42,73,0.14)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-semibold text-[#382A49]">
                    Panduan edit profil
                </p>
                <p className="mt-2 leading-6">
                    Pastikan nama, universitas, angkatan, dan semester sesuai
                    data akademikmu.
                </p>
                <p className="mt-2 leading-6">
                    Jurusan wajib diisi dengan benar karena dipakai untuk
                    mengenali bidang kolaborasi dan rekomendasi partner.
                </p>
            </div>
        </div>
    );
}

function UniversityCombobox({
    label,
    value,
    options,
    error,
    disabled = false,
    onChange,
}: {
    label: string;
    value: string;
    options: UniversityOption[];
    error?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const query = value.trim().toLowerCase();
    const filteredOptions = useMemo(() => {
        if (!query) {
            return options.slice(0, 12);
        }

        return options
            .filter((option) => option.name.toLowerCase().includes(query))
            .slice(0, 12);
    }, [options, query]);

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-[#5E5873]">
                {label}
            </label>

            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9B8FB3]" />
                <input
                    type="text"
                    value={value}
                    disabled={disabled}
                    placeholder="Cari universitas..."
                    onFocus={() => setOpen(!disabled)}
                    onBlur={() => {
                        window.setTimeout(() => setOpen(false), 120);
                    }}
                    onChange={(event) => {
                        onChange(event.target.value);
                        setOpen(true);
                    }}
                    className="h-11 w-full rounded-xl border border-[#D8CDE8] px-10 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10 disabled:bg-[#F7F1FF] disabled:text-[#8A7FA2]"
                />
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#9B8FB3]" />
            </div>

            {open && !disabled && (
                <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#EFE4F8] bg-white p-2 shadow-[0_18px_45px_rgba(56,42,73,0.14)]">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option.name}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    onChange(option.name);
                                    setOpen(false);
                                }}
                                className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-[#F7F1FF]"
                            >
                                <span className="text-sm font-semibold text-[#382A49]">
                                    {option.name}
                                </span>
                                {option.lldikti_region && (
                                    <span className="mt-0.5 text-xs text-[#8A7FA2]">
                                        LLDikti Wilayah {option.lldikti_region}
                                    </span>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-3 text-sm text-[#8A7FA2]">
                            Universitas tidak ditemukan.
                        </div>
                    )}
                </div>
            )}

            {error && <InputError>{error}</InputError>}
        </div>
    );
}

function InputField({
    label,
    value,
    error,
    type = 'text',
    disabled = false,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    type?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#5E5873]">
                {label}
            </label>
            <input
                type={type}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
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
