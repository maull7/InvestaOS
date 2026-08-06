<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['question_id', 'label', 'score', 'order'])]
class InvestmentQuestionOption extends Model
{
    public function question()
    {
        return $this->belongsTo(InvestmentQuestion::class);
    }
}
