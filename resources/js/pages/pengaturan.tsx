import { useForm } from '@inertiajs/react';
import { Github, Instagram, Linkedin } from 'lucide-react';
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
    behance: string | null;
    portfolio: string | null;
    tersedia_kolaborasi: boolean | null;
    total_poin: number;
};

type PengaturanProps = {
    profileUser: User;
    mahasiswa: MahasiswaProfile;
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
    behance: string;
    portfolio: string;
    tersedia_kolaborasi: boolean;
    foto: File | null;
};

const interestOptions = ['Teknologi', 'Desain', 'Bisnis', 'Sains', 'Seni'];

export default function Pengaturan({
    profileUser,
    mahasiswa,
}: PengaturanProps) {
    const [skillInput, setSkillInput] = useState('');
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
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

    const { data, setData, put, processing, errors } = useForm<ProfileForm>({
        name: profileUser.name ?? '',
        // username: '',
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
        behance: mahasiswa.behance ?? '',
        portfolio: mahasiswa.portfolio ?? '',
        tersedia_kolaborasi: mahasiswa.tersedia_kolaborasi ?? true,
        foto: null,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put('/pengaturan', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const addSkill = () => {
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
        setData(
            'skill',
            data.skill.filter((item) => item !== skill),
        );
    };

    const toggleMinat = (item: string) => {
        setData(
            'minat',
            data.minat.includes(item)
                ? data.minat.filter((selected) => selected !== item)
                : [...data.minat, item],
        );
    };

    const changeFoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setData('foto', file);
        setFotoPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <SettingsPageLayout
            title="Pengaturan"
        >
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
                            <label className="cursor-pointer rounded-xl bg-[#6610F2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#570DD1]">
                                Ubah
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={changeFoto}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setData('foto', null);
                                    setFotoPreview(null);
                                }}
                                className="rounded-xl bg-[#F3ECFF] px-4 py-2 text-sm font-semibold text-[#5E5873] transition hover:bg-[#E9D8FF]"
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
                    <FormSection title="Informasi Pribadi">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Nama Lengkap"
                                value={data.name}
                                error={errors.name}
                                onChange={(value) => setData('name', value)}
                            />
                        </div>

                        <InputField
                            label="Universitas"
                            value={data.universitas}
                            error={errors.universitas}
                            onChange={(value) => setData('universitas', value)}
                        />

                        <div className="grid gap-4 md:grid-cols-[1fr_140px_140px]">
                            <InputField
                                label="Jurusan"
                                value={data.jurusan}
                                error={errors.jurusan}
                                onChange={(value) => setData('jurusan', value)}
                            />
                            <InputField
                                label="Angkatan"
                                value={data.angkatan}
                                error={errors.angkatan}
                                onChange={(value) => setData('angkatan', value)}
                            />
                            <InputField
                                label="Semester"
                                type="number"
                                value={data.semester}
                                error={errors.semester}
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
                                onChange={(event) =>
                                    setData('bio', event.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-[#D8CDE8] px-4 py-3 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
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
                                            onClick={() => removeSkill(skill)}
                                            className="rounded-full bg-[#6610F2] px-3 py-1.5 text-sm font-medium text-white"
                                        >
                                            {skill} x
                                        </button>
                                    ))}
                                </div>

                                <div className="flex rounded-xl border border-[#D8CDE8]">
                                    <input
                                        value={skillInput}
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
                                        className="h-11 flex-1 rounded-l-xl px-4 text-sm outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-4 text-lg font-bold text-[#6610F2]"
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

                        {/* <label className="flex items-center gap-3 rounded-xl border border-[#EFE4F8] p-4 text-sm font-semibold text-[#382A49]">
                            <input
                                type="checkbox"
                                checked={data.tersedia_kolaborasi}
                                onChange={(event) =>
                                    setData(
                                        'tersedia_kolaborasi',
                                        event.target.checked,
                                    )
                                }
                                className="h-4 w-4 rounded border-[#D8CDE8] text-[#6610F2]"
                            />
                            Tersedia untuk kolaborasi
                        </label> */}
                    </FormSection>

                    <FormSection title="Kontak & Tautan">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Instagram"
                                value={data.instagram}
                                error={errors.instagram}
                                onChange={(value) =>
                                    setData('instagram', value)
                                }
                            />
                            <InputField
                                label="LinkedIn"
                                value={data.linkedin}
                                error={errors.linkedin}
                                onChange={(value) => setData('linkedin', value)}
                            />
                            <InputField
                                label="GitHub"
                                value={data.github}
                                error={errors.github}
                                onChange={(value) => setData('github', value)}
                            />
                            <InputField
                                label="Behance"
                                value={data.behance}
                                error={errors.behance}
                                onChange={(value) => setData('behance', value)}
                            />
                        </div>

                        <InputField
                            label="Portfolio / Website"
                            value={data.portfolio}
                            error={errors.portfolio}
                            onChange={(value) => setData('portfolio', value)}
                        />
                    </FormSection>

                    <div className="mt-8 flex justify-end gap-3 border-t border-[#EFE4F8] pt-6">
                        <button
                            type="button"
                            disabled={processing}
                            className="rounded-xl border border-[#BFB5CF] px-6 py-3 text-sm font-semibold text-[#5E5873] transition hover:bg-[#F8F3FF] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(102,16,242,0.25)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
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
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="mb-8">
            <div className="mb-5 border-b border-[#EFE4F8] pb-3">
                <h2 className="font-semibold text-[#382A49]">{title}</h2>
            </div>

            <div className="space-y-4">{children}</div>
        </section>
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
