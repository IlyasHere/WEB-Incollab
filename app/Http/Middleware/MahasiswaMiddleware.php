<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MahasiswaMiddleware
{
    /**
     * Allow only mahasiswa users to access mahasiswa routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        abort_unless($request->user()?->role === 'mahasiswa', 403);

        return $next($request);
    }
}
