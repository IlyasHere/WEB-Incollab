# Tugas Kelompok: Data Uji Error Form InCollab

Dokumen ini berisi data uji error atau data yang tidak benar untuk 3 form pada aplikasi InCollab. Format tabel mengikuti contoh pada instruksi tugas.

## 1. Form Register / Create New Account

| Field | Data Uji (Error) | Ekspektasi Hasil (Pesan Error) |
| --- | --- | --- |
| Name | kosong / tidak diisi | "Nama wajib diisi." |
| Name | teks lebih dari 255 karakter | "Nama maksimal 255 karakter." |
| Email | `zunadea@gmail` (tanpa `.com`) | "Format email tidak valid." |
| Email | `test@example.com` (sudah terdaftar pada data seed) | "Email ini sudah terdaftar." |
| Password | `123` (terlalu pendek) | "Password minimal 8 karakter." |
| Konfirmasi Password | `PasswordBerbeda123` | "Konfirmasi password tidak cocok." |

## 2. Form Login

| Field | Data Uji (Error) | Ekspektasi Hasil (Pesan Error) |
| --- | --- | --- |
| Email | kosong / tidak diisi | "Email wajib diisi." |
| Email | `usergmail.com` (tanpa `@`) | "Format email tidak valid." |
| Email | `belumdaftar@example.com` (email belum terdaftar) | "Email atau password salah." |
| Password | kosong / tidak diisi | "Password wajib diisi." |
| Password | `passwordsalah123` untuk email yang benar | "Email atau password salah." |

## 3. Form Update Password / Security Settings

| Field | Data Uji (Error) | Ekspektasi Hasil (Pesan Error) |
| --- | --- | --- |
| Current Password | kosong / tidak diisi | "Password saat ini wajib diisi." |
| Current Password | `passwordsalah123` | "Password saat ini tidak sesuai." |
| New Password | kosong / tidak diisi | "Password baru wajib diisi." |
| New Password | `123` (terlalu pendek) | "Password minimal 8 karakter." |
| Confirm Password | `PasswordBerbeda123` | "Konfirmasi password tidak cocok." |

## Catatan Pengujian

- Gunakan akun seed `test@example.com` untuk skenario email sudah terdaftar atau login dengan akun yang sudah ada.
- Untuk pengujian password salah, masukkan email akun yang valid lalu isi password dengan data uji error.
- Pesan error ditulis dalam bahasa Indonesia agar sesuai format tugas. Pada implementasi Laravel bawaan, teks pesan dapat tampil dalam bahasa Inggris jika file translasi validasi belum diubah.
