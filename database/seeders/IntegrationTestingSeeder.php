<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Event;
use App\Models\FeedPost;
use App\Models\KlaimPoin;
use App\Models\Komentar;
use App\Models\LaporanPengaduan;
use App\Models\Mahasiswa;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class IntegrationTestingSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $admin = User::updateOrCreate(
            ['email' => 'admin.test@gmail.com'],
            [
                'name' => 'Admin Integration Test',
                'password' => $password,
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
        );

        $mahasiswaUser = User::updateOrCreate(
            ['email' => 'mahasiswa.test@gmail.com'],
            [
                'name' => 'Mahasiswa Integration Test',
                'password' => $password,
                'role' => 'mahasiswa',
                'email_verified_at' => now(),
                'onboarding_completed_at' => now(),
            ],
        );

        $partnerUser = User::updateOrCreate(
            ['email' => 'partner.test@gmail.com'],
            [
                'name' => 'Partner Integration Test',
                'password' => $password,
                'role' => 'mahasiswa',
                'email_verified_at' => now(),
                'onboarding_completed_at' => now(),
            ],
        );

        $mahasiswa = Mahasiswa::updateOrCreate(
            ['user_id' => $mahasiswaUser->user_id],
            [
                'bio' => 'Akun mahasiswa dummy untuk integration testing InCollab.',
                'universitas' => 'Universitas Telkom',
                'jurusan' => 'S1 Informatika',
                'angkatan' => '2024',
                'semester' => 4,
                'skill' => ['UIUX', 'Frontend', 'MEMBACA'],
                'minat' => ['Teknologi', 'Desain', 'Bisnis'],
                'total_poin' => 250,
                'instagram' => 'mahasiswa.test',
                'linkedin' => 'mahasiswa-test',
                'github' => 'mahasiswa-test',
            ],
        );

        $partnerMahasiswa = Mahasiswa::updateOrCreate(
            ['user_id' => $partnerUser->user_id],
            [
                'bio' => 'Akun partner dummy untuk chat dan profil pengguna.',
                'universitas' => 'Universitas Indonesia',
                'jurusan' => 'S1 Data Sains',
                'angkatan' => '2023',
                'semester' => 6,
                'skill' => ['UIUX', 'Frontend'],
                'minat' => ['Teknologi', 'Desain'],
                'total_poin' => 50,
            ],
        );

        $publishedEvent = Event::updateOrCreate(
            ['judul_event' => 'Integration Testing Published Event'],
            [
                'admin_id' => $admin->user_id,
                'deskripsi_event' => 'Event published/open untuk kebutuhan pengujian integrasi.',
                'tanggal_event' => now()->addDays(7)->toDateString(),
                'tanggal_selesai' => now()->addDays(8)->toDateString(),
                'lokasi' => 'Bandung',
                'kategori_event' => 'Teknologi',
                'poin_event' => 75,
                'link_pendaftaran' => 'https://example.com/register',
                'status_event' => 'Open',
                'visibility_status' => 'Published',
                'registration_status' => 'Open',
                'penyelenggara' => 'InCollab Testing Team',
            ],
        );

        $draftEvent = Event::updateOrCreate(
            ['judul_event' => 'Integration Testing Draft Event'],
            [
                'admin_id' => $admin->user_id,
                'deskripsi_event' => 'Event draft/closed untuk pengujian akses event non-published.',
                'tanggal_event' => now()->addDays(14)->toDateString(),
                'tanggal_selesai' => now()->addDays(15)->toDateString(),
                'lokasi' => 'Jakarta',
                'kategori_event' => 'Bisnis',
                'poin_event' => 30,
                'status_event' => 'Closed',
                'visibility_status' => 'Draft',
                'registration_status' => 'Closed',
                'penyelenggara' => 'InCollab Testing Team',
            ],
        );

        $availableReward = Reward::updateOrCreate(
            ['nama_reward' => 'Integration Testing Reward Available'],
            [
                'admin_id' => $admin->user_id,
                'kategori_reward' => 'Merchandise',
                'poin_dibutuhkan' => 100,
                'stok' => 5,
                'deskripsi' => 'Reward dummy dengan stok tersedia.',
                'gambar' => [],
                'lokasi_penukaran' => 'Booth InCollab',
                'instruksi_penukaran' => 'Tunjukkan kode penukaran ke admin.',
                'berlaku_hari' => 30,
            ],
        );

        $emptyReward = Reward::updateOrCreate(
            ['nama_reward' => 'Integration Testing Reward Empty Stock'],
            [
                'admin_id' => $admin->user_id,
                'kategori_reward' => 'Voucher',
                'poin_dibutuhkan' => 50,
                'stok' => 0,
                'deskripsi' => 'Reward dummy dengan stok habis.',
                'gambar' => [],
                'lokasi_penukaran' => 'Online',
                'instruksi_penukaran' => 'Tidak dapat ditukar karena stok habis.',
                'berlaku_hari' => 30,
            ],
        );

        $post = FeedPost::updateOrCreate(
            [
                'user_id' => $mahasiswaUser->user_id,
                'title' => 'Integration Testing Feed Post',
            ],
            [
                'content' => 'Postingan dummy untuk pengujian feed, detail post, komentar, dan reply.',
                'tags' => ['testing', 'incollab'],
            ],
        );

        $comment = Komentar::updateOrCreate(
            [
                'mhs_id' => $partnerMahasiswa->mhs_id,
                'post_id' => $post->post_id,
                'isi_komentar' => 'Komentar dummy untuk integration testing.',
            ],
            [
                'parent_id' => null,
                'tanggal_komentar' => now(),
            ],
        );

        KlaimPoin::updateOrCreate(
            [
                'mhs_id' => $mahasiswa->mhs_id,
                'event_id' => $publishedEvent->event_id,
                'status_klaim' => 'Menunggu Verifikasi',
            ],
            [
                'tanggal_klaim' => now()->toDateString(),
                'nama_lengkap' => $mahasiswaUser->name,
                'nim_user' => 'INT-TEST-001',
                'nama_event' => $publishedEvent->judul_event,
                'tanggal_mengikuti_event' => now()->subDay()->toDateString(),
                'nama_sertifikat' => 'Sertifikat Integration Testing',
                'file_bukti' => 'event-point-claims/integration-testing-proof.pdf',
                'catatan_user' => 'Klaim dummy untuk pengujian admin.',
                'admin_id' => null,
                'catatan_admin' => null,
                'alasan_penolakan' => null,
                'poin_diberikan_at' => null,
            ],
        );

        LaporanPengaduan::updateOrCreate(
            [
                'mhs_id' => $mahasiswa->mhs_id,
                'isi_laporan' => 'Laporan dummy untuk integration testing.',
            ],
            [
                'admin_id' => null,
                'kategori_laporan' => 'Bug',
                'status_laporan' => 'Menunggu',
                'catatan_admin' => null,
                'ditangani_pada' => null,
            ],
        );

        Notification::updateOrCreate(
            [
                'user_id' => $mahasiswaUser->user_id,
                'title' => 'Notifikasi Integration Testing',
            ],
            [
                'type' => 'info',
                'body' => 'Notifikasi dummy untuk pengujian mark as read.',
                'url' => '/pengaturan/notifikasi',
                'read_at' => null,
            ],
        );

        $conversation = Conversation::between($mahasiswaUser, $partnerUser);
        $message = Message::updateOrCreate(
            [
                'conversation_id' => $conversation->id,
                'sender_id' => $partnerUser->user_id,
                'body' => 'Halo, ini pesan dummy untuk integration testing chat.',
            ],
            [
                'read_at' => null,
            ],
        );

        $conversation->forceFill(['last_message_at' => $message->created_at])->save();

        $this->command?->info('Integration testing seed data ready.');
        $this->command?->table(
            ['Variable', 'Value'],
            [
                ['mahasiswa_email', 'mahasiswa.test@gmail.com'],
                ['mahasiswa_password', 'password123'],
                ['admin_email', 'admin.test@gmail.com'],
                ['admin_password', 'password123'],
                ['event_id', $publishedEvent->event_id],
                ['draft_event_id', $draftEvent->event_id],
                ['post_id', $post->post_id],
                ['comment_id', $comment->komentar_id],
                ['reward_id', $availableReward->reward_id],
                ['reward_empty_stock_id', $emptyReward->reward_id],
                ['klaim_poin_id', KlaimPoin::where('mhs_id', $mahasiswa->mhs_id)->where('event_id', $publishedEvent->event_id)->value('klaim_id')],
                ['laporan_id', LaporanPengaduan::where('mhs_id', $mahasiswa->mhs_id)->value('laporan_id')],
                ['notification_id', Notification::where('user_id', $mahasiswaUser->user_id)->value('id')],
                ['conversation_id', $conversation->id],
                ['target_user_id', $partnerUser->user_id],
            ],
        );
    }
}
