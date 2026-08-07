<?php

use App\Http\Controllers\Admin\BondController as AdminBondController;
use App\Http\Controllers\Admin\GoalDetectionRuleController;
use App\Http\Controllers\Admin\InvestmentManagerController as AdminInvestmentManagerController;
use App\Http\Controllers\Admin\InvestmentQuestionController;
use App\Http\Controllers\Admin\MutualFundController as AdminMutualFundController;
use App\Http\Controllers\Admin\RiskAllocationController;
use App\Http\Controllers\Admin\RiskProfileController;
use App\Http\Controllers\Admin\StockController as AdminStockController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BondController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvestmentGoalController;
use App\Http\Controllers\InvestmentManagerController;
use App\Http\Controllers\InvestmentProfileController;
use App\Http\Controllers\IpsController;
use App\Http\Controllers\MarketDataController;
use App\Http\Controllers\MutualFundController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'auth/Login')->name('login');
    Route::inertia('/register', 'auth/Register')->name('register');
    Route::post('/login', [AuthController::class, 'store'])->name('login.attempt');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('onboarded')
        ->name('dashboard');

    Route::get('/planning', [DashboardController::class, 'planning'])
        ->middleware(['onboarded', 'role:investor'])
        ->name('planning');

    Route::get('/profile', [DashboardController::class, 'profile'])
        ->middleware(['onboarded', 'role:investor'])
        ->name('profile');

    Route::post('/goals', [InvestmentGoalController::class, 'store'])
        ->middleware('role:investor')
        ->name('goals.store');

    Route::put('/profile', [InvestmentProfileController::class, 'update'])
        ->middleware(['onboarded', 'role:investor'])
        ->name('profile.update');

    Route::prefix('policy')->middleware(['onboarded', 'role:investor'])->group(function () {
        Route::get('/', [IpsController::class, 'index'])->name('policy.index');
        Route::post('/', [IpsController::class, 'store'])->name('policy.store');
        Route::get('/{ips}', [IpsController::class, 'show'])->name('policy.show');
        Route::post('/{ips}/finalize', [IpsController::class, 'finalize'])->name('policy.finalize');
        Route::post('/{ips}/regenerate', [IpsController::class, 'regenerate'])->name('policy.regenerate');
        Route::get('/{ips}/download', [IpsController::class, 'download'])->name('policy.download');
        Route::delete('/{ips}', [IpsController::class, 'destroy'])->name('policy.destroy');
    });
    Route::put('/goals/{goal}', [InvestmentGoalController::class, 'update'])
        ->middleware('role:investor')
        ->name('goals.update');
    Route::delete('/goals/{goal}', [InvestmentGoalController::class, 'destroy'])
        ->middleware('role:investor')
        ->name('goals.destroy');

    Route::middleware('role:investor')->prefix('onboarding')->group(function () {
        Route::get('/', [OnboardingController::class, 'show'])->name('onboarding.show');
        Route::post('/step/{step}', [OnboardingController::class, 'saveStep'])->name('onboarding.step');
        Route::post('/complete', [OnboardingController::class, 'complete'])->name('onboarding.complete');
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/questions', [InvestmentQuestionController::class, 'index'])->name('admin.questions.index');
        Route::post('/questions', [InvestmentQuestionController::class, 'store'])->name('admin.questions.store');
        Route::put('/questions/{question}', [InvestmentQuestionController::class, 'update'])->name('admin.questions.update');
        Route::delete('/questions/{question}', [InvestmentQuestionController::class, 'destroy'])->name('admin.questions.destroy');

        Route::get('/risk-profiles', [RiskProfileController::class, 'index'])->name('admin.risk-profiles.index');
        Route::post('/risk-profiles', [RiskProfileController::class, 'store'])->name('admin.risk-profiles.store');
        Route::put('/risk-profiles/{riskProfile}', [RiskProfileController::class, 'update'])->name('admin.risk-profiles.update');
        Route::delete('/risk-profiles/{riskProfile}', [RiskProfileController::class, 'destroy'])->name('admin.risk-profiles.destroy');

        Route::get('/suitability', [RiskAllocationController::class, 'index'])->name('admin.suitability.index');
        Route::post('/suitability', [RiskAllocationController::class, 'store'])->name('admin.suitability.store');
        Route::put('/risk-profiles/{riskProfile}/allocations', [RiskAllocationController::class, 'update'])->name('admin.suitability.update');
        Route::delete('/suitability/{riskProfile}', [RiskAllocationController::class, 'destroy'])->name('admin.suitability.destroy');

        Route::get('/goal-rules', [GoalDetectionRuleController::class, 'index'])->name('admin.goal-rules.index');
        Route::post('/goal-rules', [GoalDetectionRuleController::class, 'store'])->name('admin.goal-rules.store');
        Route::put('/goal-rules/{rule}', [GoalDetectionRuleController::class, 'update'])->name('admin.goal-rules.update');
        Route::delete('/goal-rules/{rule}', [GoalDetectionRuleController::class, 'destroy'])->name('admin.goal-rules.destroy');

        Route::get('/stocks', [AdminStockController::class, 'index'])->name('admin.stocks.index');
        Route::get('/stocks/template', [AdminStockController::class, 'template'])->name('admin.stocks.template');
        Route::get('/stocks/{stock:code}', [AdminStockController::class, 'show'])->name('admin.stocks.show');
        Route::post('/stocks', [AdminStockController::class, 'store'])->name('admin.stocks.store');
        Route::post('/stocks/import', [AdminStockController::class, 'import'])->name('admin.stocks.import');
        Route::put('/stocks/{stock}', [AdminStockController::class, 'update'])->name('admin.stocks.update');
        Route::delete('/stocks/{stock}', [AdminStockController::class, 'destroy'])->name('admin.stocks.destroy');

        Route::get('/bonds', [AdminBondController::class, 'index'])->name('admin.bonds.index');
        Route::get('/bonds/template', [AdminBondController::class, 'template'])->name('admin.bonds.template');
        Route::post('/bonds', [AdminBondController::class, 'store'])->name('admin.bonds.store');
        Route::post('/bonds/import', [AdminBondController::class, 'import'])->name('admin.bonds.import');
        Route::put('/bonds/{bond}', [AdminBondController::class, 'update'])->name('admin.bonds.update');
        Route::delete('/bonds/{bond}', [AdminBondController::class, 'destroy'])->name('admin.bonds.destroy');

        Route::get('/investment-managers', [AdminInvestmentManagerController::class, 'index'])->name('admin.investment-managers.index');
        Route::get('/investment-managers/template', [AdminInvestmentManagerController::class, 'template'])->name('admin.investment-managers.template');
        Route::get('/investment-managers/{investmentManager}', [AdminInvestmentManagerController::class, 'show'])->name('admin.investment-managers.show');
        Route::post('/investment-managers', [AdminInvestmentManagerController::class, 'store'])->name('admin.investment-managers.store');
        Route::post('/investment-managers/import', [AdminInvestmentManagerController::class, 'import'])->name('admin.investment-managers.import');
        Route::put('/investment-managers/{investmentManager}', [AdminInvestmentManagerController::class, 'update'])->name('admin.investment-managers.update');
        Route::delete('/investment-managers/{investmentManager}', [AdminInvestmentManagerController::class, 'destroy'])->name('admin.investment-managers.destroy');

        Route::get('/mutual-funds', [AdminMutualFundController::class, 'index'])->name('admin.mutual-funds.index');
        Route::get('/mutual-funds/template', [AdminMutualFundController::class, 'template'])->name('admin.mutual-funds.template');
        Route::post('/mutual-funds', [AdminMutualFundController::class, 'store'])->name('admin.mutual-funds.store');
        Route::post('/mutual-funds/import', [AdminMutualFundController::class, 'import'])->name('admin.mutual-funds.import');
        Route::put('/mutual-funds/{mutualFund}', [AdminMutualFundController::class, 'update'])->name('admin.mutual-funds.update');
        Route::delete('/mutual-funds/{mutualFund}', [AdminMutualFundController::class, 'destroy'])->name('admin.mutual-funds.destroy');
    });

    Route::get('/stocks', [StockController::class, 'index'])
        ->middleware('onboarded')
        ->name('stocks.index');

    Route::get('/stocks/compare', [StockController::class, 'compare'])
        ->middleware('onboarded')
        ->name('stocks.compare');

    Route::get('/stocks/search', [StockController::class, 'search'])
        ->middleware('onboarded')
        ->name('stocks.search');

    Route::get('/stocks/{stock:code}', [StockController::class, 'show'])
        ->middleware('onboarded')
        ->name('stocks.show');

    Route::get('/stocks/{stock:code}/pdf', [StockController::class, 'pdf'])
        ->middleware('onboarded')
        ->name('stocks.pdf');

    Route::post('/stocks/{stock:code}/watch', [StockController::class, 'toggleWatch'])
        ->middleware('onboarded')
        ->name('stocks.watch');

    Route::get('/bonds', [BondController::class, 'index'])
        ->middleware('onboarded')
        ->name('bonds.index');

    Route::get('/bonds/{bond:code}', [BondController::class, 'show'])
        ->middleware('onboarded')
        ->name('bonds.show');

    Route::post('/bonds/{bond:code}/watch', [BondController::class, 'toggleWatch'])
        ->middleware('onboarded')
        ->name('bonds.watch');

    Route::get('/investment-managers', [InvestmentManagerController::class, 'index'])
        ->middleware('onboarded')
        ->name('investment-managers.index');

    Route::get('/investment-managers/{investmentManager}', [InvestmentManagerController::class, 'show'])
        ->middleware('onboarded')
        ->name('investment-managers.show');

    Route::get('/reksa-dana', [MutualFundController::class, 'index'])
        ->middleware('onboarded')
        ->name('mutual-funds.index');

    Route::get('/reksa-dana/{mutualFund:code}', [MutualFundController::class, 'show'])
        ->middleware('onboarded')
        ->name('mutual-funds.show');

    Route::get('/market-data', [MarketDataController::class, 'index'])
        ->middleware('onboarded')
        ->name('market-data.index');

    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
});
