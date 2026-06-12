<?php

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Validation\ValidationException;

test('membuat user mahasiswa dan profil mahasiswa saat data valid', function () {
    $user = app(CreateNewUser::class)->create([
        'name' => 'Budi Santoso',
        'email' => 'budi.santoso@gmail.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    expect($user)->toBeInstanceOf(User::class);
    expect($user->role)->toBe('mahasiswa');
    expect($user->mahasiswa)->not->toBeNull();

    $this->assertDatabaseHas('users', [
        'user_id' => $user->user_id,
        'name' => 'Budi Santoso',
        'email' => 'budi.santoso@gmail.com',
        'role' => 'mahasiswa',
    ]);

    $this->assertDatabaseHas('mahasiswa', [
        'user_id' => $user->user_id,
    ]);
});

test('menolak pendaftaran dengan email selain gmail', function () {
    app(CreateNewUser::class)->create([
        'name' => 'Budi Santoso',
        'email' => 'budi.santoso@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);
})->throws(ValidationException::class);

test('menolak pendaftaran dengan password tanpa angka', function () {
    app(CreateNewUser::class)->create([
        'name' => 'Budi Santoso',
        'email' => 'budi.santoso@gmail.com',
        'password' => 'PasswordOnly',
        'password_confirmation' => 'PasswordOnly',
    ]);
})->throws(ValidationException::class);
