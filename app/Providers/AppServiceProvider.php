<?php

namespace App\Providers;

use App\Ai\Gateway\NineRouterGateway;
use App\Contracts\IpsWriter;
use App\Services\BondService;
use App\Services\ResearchDataService;
use App\Services\ResearchGenerationService;
use App\Services\Writers\AiWriter;
use App\Services\Writers\RuleBasedWriter;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Ai\AiManager;
use Laravel\Ai\Providers\OpenAiCompatibleProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(IpsWriter::class, function () {
            $ruleBased = new RuleBasedWriter;

            if (config('ai.enabled') && config('ai.providers.9router.key') !== '') {
                return new AiWriter($ruleBased, config('ai'));
            }

            return $ruleBased;
        });

        $this->app->singleton(ResearchGenerationService::class, function ($app) {
            return new ResearchGenerationService(
                $app->make(ResearchDataService::class),
                $app->make(BondService::class),
                config('ai')
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        app(AiManager::class)->extend('9router', function ($app, array $config) {
            $provider = new OpenAiCompatibleProvider($config, $app->make(Dispatcher::class));

            return $provider->useTextGateway(new NineRouterGateway($app->make(Dispatcher::class)));
        });

        RateLimiter::for('research-generate', function (Request $request) {
            return Limit::perMinute(3)->by($request->user()?->id ?? $request->ip());
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
