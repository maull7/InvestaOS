<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvestmentQuestionRequest;
use App\Models\InvestmentQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvestmentQuestionController extends Controller
{
    public function index(): Response
    {
        $questions = InvestmentQuestion::query()
            ->with('options')
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/Questions', ['questions' => $questions]);
    }

    public function store(InvestmentQuestionRequest $request): RedirectResponse
    {
        $question = InvestmentQuestion::create($request->safe()->except('options'));
        $this->syncOptions($question, $request->input('options', []));

        return redirect()->route('admin.questions.index');
    }

    public function update(
        InvestmentQuestionRequest $request,
        InvestmentQuestion $question,
    ): RedirectResponse {
        $question->update($request->safe()->except('options'));
        $this->syncOptions($question, $request->input('options', []));

        return redirect()->route('admin.questions.index');
    }

    public function destroy(InvestmentQuestion $question): RedirectResponse
    {
        $question->delete();

        return redirect()->route('admin.questions.index');
    }

    private function syncOptions(InvestmentQuestion $question, array $options): void
    {
        $question->options()->delete();

        foreach ($options as $i => $option) {
            $question->options()->create([
                'label' => $option['label'],
                'score' => $option['score'],
                'order' => $option['order'] ?? $i,
            ]);
        }
    }
}
