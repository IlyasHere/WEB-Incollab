<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Redirect users to the right dashboard after Fortify authentication.
     */
    public function toResponse($request)
    {
        $user = $request->user();

        return redirect()->to(
            $user?->role === 'admin' ? '/admin/dashboard' : '/dashboard',
        );
    }
}
