<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'description', 'category', 'order', 'active'])]
class InvestmentQuestion extends Model
{
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    public function options()
    {
        return $this->hasMany(InvestmentQuestionOption::class, 'question_id')->orderBy('order');
    }
}
