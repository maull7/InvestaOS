<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BondRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', Rule::unique('bonds', 'code')->ignore($this->route('bond'))],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:government_bond,corporate_bond,sukuk'],
            'issuer' => ['nullable', 'string', 'max:255'],
            'coupon' => ['nullable', 'numeric', 'between:0,100'],
            'maturity_date' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive'],
            'issue_date' => ['nullable', 'date'],
            'face_value' => ['nullable', 'numeric', 'min:0'],
            'payment_frequency' => ['nullable', 'in:annual,semiannual'],
            'last_price' => ['nullable', 'numeric', 'min:0'],
            'yield' => ['nullable', 'numeric', 'between:0,100'],
            'benchmark_yield' => ['nullable', 'numeric', 'between:0,100'],
            'benchmark_label' => ['nullable', 'string', 'max:255'],
            'currency' => ['nullable', 'string', 'max:10'],
        ];
    }
}
