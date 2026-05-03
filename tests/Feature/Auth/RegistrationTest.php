<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('email must use a valid format', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'zunadea@gmail',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors([
        'email' => 'Format email tidak valid.',
    ]);
});

test('email must be unique', function () {
    User::factory()->create([
        'email' => 'zunadea@gmail.com',
    ]);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'zunadea@gmail.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors([
        'email' => 'Email ini sudah terdaftar.',
    ]);
});

test('password must be at least eight characters', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => '123',
        'password_confirmation' => '123',
    ]);

    $response->assertSessionHasErrors([
        'password' => 'Password minimal 8 karakter.',
    ]);
});

test('password confirmation must match', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'PasswordBerbeda123',
    ]);

    $response->assertSessionHasErrors([
        'password' => 'Konfirmasi password tidak cocok.',
    ]);
});
