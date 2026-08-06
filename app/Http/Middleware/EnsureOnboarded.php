<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboarded
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->isAdmin()) {
            $profile = $user->investmentProfile;

            if (! $profile || $profile->status !== 'completed') {
                return redirect()->route('onboarding.show');
            }
        }

        return $next($request);
    }
}
