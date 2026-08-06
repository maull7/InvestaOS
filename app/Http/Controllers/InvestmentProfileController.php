<?php

namespace App\Http\Controllers;

use App\Services\InvestmentProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InvestmentProfileController extends Controller
{
    public function update(Request $request, InvestmentProfileService $service): RedirectResponse
    {
        $profile = $service->firstOrCreate($request->user());

        $profile->update($request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', 'max:50'],
            'occupation' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'annual_income' => ['required', 'numeric', 'min:0'],
            'monthly_expenses' => ['required', 'numeric', 'min:0'],
            'total_assets' => ['required', 'numeric', 'min:0'],
            'total_liabilities' => ['required', 'numeric', 'min:0'],
            'emergency_fund' => ['required', 'numeric', 'min:0'],
        ]));

        return redirect()->back();
    }
}
