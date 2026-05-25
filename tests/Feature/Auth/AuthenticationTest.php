<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create([
        'email' => 'login-user@gmail.com',
        'password' => Hash::make('Password123'),
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'Password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create([
        'email' => 'two-factor-user@gmail.com',
        'password' => Hash::make('Password123'),
    ]);

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'Password123',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create([
        'email' => 'invalid-password-user@gmail.com',
        'password' => Hash::make('Password123'),
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'Wrong123',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});

test('users are rate limited', function () {
    $user = User::factory()->create([
        'email' => 'rate-limited-user@gmail.com',
    ]);

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'Wrong123',
    ]);

    $response->assertTooManyRequests();
});

test('login requires a gmail address', function () {
    $response = $this->from(route('login'))->post(route('login.store'), [
        'email' => 'ilyas@com',
        'password' => 'Password123',
    ]);

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors([
        'email' => 'Email harus menggunakan @gmail.com.',
    ]);
});

test('login password must be at least eight characters and include letters and numbers', function () {
    $this->from(route('login'))->post(route('login.store'), [
        'email' => 'ilyas@gmail.com',
        'password' => '12345678',
    ])->assertSessionHasErrors([
        'password' => 'Password harus mengandung huruf dan angka.',
    ]);

    $this->from(route('login'))->post(route('login.store'), [
        'email' => 'ilyas@gmail.com',
        'password' => 'Abc123',
    ])->assertSessionHasErrors([
        'password' => 'Password minimal 8 karakter.',
    ]);
});
