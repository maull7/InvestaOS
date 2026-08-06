<?php

namespace Database\Seeders;

use App\Models\InvestmentQuestion;
use App\Models\InvestmentQuestionOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvestmentQuestionSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $questions = [
            [
                'title' => 'How long do you plan to keep your money invested?',
                'description' => 'Your time horizon influences how much short-term volatility you can ride out.',
                'category' => 'Time Horizon',
                'options' => [
                    ['label' => 'Less than 1 year', 'score' => 1],
                    ['label' => '1 - 3 years', 'score' => 2],
                    ['label' => '3 - 7 years', 'score' => 3],
                    ['label' => 'More than 7 years', 'score' => 4],
                ],
            ],
            [
                'title' => 'How would you react if your portfolio dropped 20% in a month?',
                'description' => 'Your emotional response reveals your true risk capacity.',
                'category' => 'Risk Tolerance',
                'options' => [
                    ['label' => 'Sell everything immediately', 'score' => 1],
                    ['label' => 'Sell part of the portfolio', 'score' => 2],
                    ['label' => 'Do nothing and wait', 'score' => 3],
                    ['label' => 'Buy more while prices are low', 'score' => 4],
                ],
            ],
            [
                'title' => 'What matters most to you as an investor?',
                'description' => 'Your priority shapes the right mix of assets.',
                'category' => 'Investment Goal',
                'options' => [
                    ['label' => 'Protecting my capital', 'score' => 1],
                    ['label' => 'Steady, predictable income', 'score' => 2],
                    ['label' => 'Balanced growth and safety', 'score' => 3],
                    ['label' => 'Maximum long-term growth', 'score' => 4],
                ],
            ],
            [
                'title' => 'What share of your savings could you lose without changing your lifestyle?',
                'description' => 'How much financial buffer you can afford to put at risk.',
                'category' => 'Financial Capacity',
                'options' => [
                    ['label' => 'Up to 5%', 'score' => 1],
                    ['label' => 'Up to 15%', 'score' => 2],
                    ['label' => 'Up to 30%', 'score' => 3],
                    ['label' => 'More than 30%', 'score' => 4],
                ],
            ],
        ];

        foreach ($questions as $order => $question) {
            $record = InvestmentQuestion::firstOrCreate(
                ['title' => $question['title']],
                [
                    'description' => $question['description'],
                    'category' => $question['category'],
                    'order' => $order + 1,
                ],
            );

            $record->options()->delete();

            foreach ($question['options'] as $index => $option) {
                InvestmentQuestionOption::create([
                    'question_id' => $record->id,
                    'label' => $option['label'],
                    'score' => $option['score'],
                    'order' => $index + 1,
                ]);
            }
        }
    }
}
