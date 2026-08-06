<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', Rule::unique('stocks', 'code')->ignore($this->route('stock'))],
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'listing_board' => ['nullable', 'string', 'max:255'],
            'ipo_date' => ['nullable', 'date'],
            'website' => ['nullable', 'url', 'max:255'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
