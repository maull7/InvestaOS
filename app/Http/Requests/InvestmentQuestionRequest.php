<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvestmentQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer'],
            'active' => ['boolean'],
            'options' => ['required', 'array', 'min:1'],
            'options.*.label' => ['required', 'string', 'max:255'],
            'options.*.score' => ['required', 'integer'],
            'options.*.order' => ['nullable', 'integer'],
        ];
    }
}
