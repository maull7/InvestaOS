<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['profile_id', 'question_id', 'option_id'])]
class InvestmentAnswer extends Model
{
    public function profile()
    {
        return $this->belongsTo(InvestmentProfile::class);
    }

    public function option()
    {
        return $this->belongsTo(InvestmentQuestionOption::class);
    }
}
