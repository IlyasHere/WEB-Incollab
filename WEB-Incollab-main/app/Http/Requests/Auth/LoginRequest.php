<?php

namespace App\Http\Requests\Auth;

use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Requests\LoginRequest as FortifyLoginRequest;

class LoginRequest extends FortifyLoginRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            Fortify::username() => ['required', 'email', 'regex:/^[^@\s]+@gmail\.com$/i'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            Fortify::username().'.required' => 'Email wajib diisi.',
            Fortify::username().'.email' => 'Format email tidak valid.',
            Fortify::username().'.regex' => 'Email harus menggunakan @gmail.com.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.letters' => 'Password harus mengandung huruf dan angka.',
            'password.numbers' => 'Password harus mengandung huruf dan angka.',
        ];
    }
}
