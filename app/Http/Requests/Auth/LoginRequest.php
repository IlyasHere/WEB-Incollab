<?php

namespace App\Http\Requests\Auth;

use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Requests\LoginRequest as FortifyLoginRequest;

class LoginRequest extends FortifyLoginRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            Fortify::username() => ['required', 'email', 'regex:/^[^@\s]+@gmail\.com$/i'],
            'password' => 'required|string',
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
            Fortify::username().'.regex' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}
