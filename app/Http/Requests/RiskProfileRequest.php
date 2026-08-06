<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RiskProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'min_score' => ['required', 'integer'],
            'max_score' => ['required', 'integer', 'gte:min_score'],
        ];
    }
}
