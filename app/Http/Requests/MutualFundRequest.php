<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MutualFundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'investment_manager_id' => ['nullable', 'exists:investment_managers,id'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('mutual_funds', 'code')->ignore($this->route('mutual_fund'))],
            'name' => ['required', 'string', 'max:255'],
            'fund_type' => ['required', Rule::in([
                'money_market', 'fixed_income', 'balanced', 'equity', 'protected', 'index', 'etf',
                'islamic_money_market', 'islamic_fixed_income', 'islamic_balanced', 'islamic_equity',
            ])],
            'currency' => ['nullable', 'string', 'max:10'],
            'risk_level' => ['nullable', 'integer', 'between:1,5'],
            'custodian_bank' => ['nullable', 'string', 'max:255'],
            'launch_date' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
