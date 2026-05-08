<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'email' => ['required', 'string', 'email', 'regex:/^[^@\s]+@gmail\.com$/i', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers(), 'confirmed'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 3 karakter.',
            'name.max' => 'Nama maksimal 100 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.regex' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar.',
            'password.required' => 'password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.letters' => 'Password harus mengandung huruf dan angka.',
            'password.numbers' => 'Password harus mengandung huruf dan angka.',
            'password.password.letters' => 'Password harus mengandung huruf dan angka.',
            'password.password.numbers' => 'Password harus mengandung huruf dan angka.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => 'mahasiswa',
        ]);

        $user->mahasiswa()->create();

        return $user;
    }
}
