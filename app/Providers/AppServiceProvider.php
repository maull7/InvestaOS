<?php

namespace App\Providers;

use App\Ai\Gateway\NineRouterGateway;
use App\Contracts\IpsWriter;
use App\Services\Writers\AiWriter;
use App\Services\Writers\RuleBasedWriter;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
