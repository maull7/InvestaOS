<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OnboardingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return match ((int) $this->route('step')) {
            1 => [
                'full_name' => ['required', 'string', 'max:255'],
                'date_of_birth' => ['required', 'date', 'before:today'],
                'gender' => ['required', 'string', 'max:50'],
                'occupation' => ['required', 'string', 'max:255'],
                'company' => ['nullable', 'string', 'max:255'],
            ],
            2 => [
                'answers' => ['required', 'array'],
                'answers.*' => ['required', 'integer', 'exists:investment_question_options,id'],
            ],
            3 => [],
            4 => [
                'annual_income' => ['required', 'numeric', 'min:0'],
                'monthly_expenses' => ['required', 'numeric', 'min:0'],
                'total_assets' => ['required', 'numeric', 'min:0'],
                'total_liabilities' => ['required', 'numeric', 'min:0'],
                'emergency_fund' => ['required', 'numeric', 'min:0'],
            ],
            5 => [
                'goals' => ['array'],
                'goals.*.type' => ['required', 'string', 'max:255'],
                'goals.*.target_amount' => ['required', 'numeric', 'min:0'],
                'goals.*.target_date' => ['required', 'date'],
                'goals.*.priority' => ['required', 'in:low,medium,high'],
                'advance' => ['boolean'],
            ],
            default => abort(404),
        };
    }
}
