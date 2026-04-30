@component('mail::message')
# Halo!

Kami menerima permintaan **reset password** untuk akun InCollab kamu.

Klik tombol di bawah untuk membuat password baru. Link ini hanya berlaku **60 menit**.

@component('mail::button', ['url' => $actionUrl, 'color' => 'primary'])
Reset Password
@endcomponent

Jika kamu tidak merasa meminta reset password, abaikan email ini dan password kamu tidak akan berubah.

Salam hangat,
**Tim InCollab**
@endcomponent
