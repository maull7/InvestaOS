<?php

namespace App\Ai\Gateway;

use Laravel\Ai\Contracts\Providers\TextProvider;
use Laravel\Ai\Gateway\OpenAiCompatible\OpenAiCompatibleGateway;
use Laravel\Ai\Gateway\StepContext;
use Laravel\Ai\Gateway\StepResponse;
use Laravel\Ai\Gateway\TextGenerationOptions;

/**
 * The 9router gateway always appends an SSE `data: [DONE]` marker after the
 * single JSON payload, even for non-streaming requests. The stock Laravel AI
 * client calls `$response->json()` on the whole body, which then fails to
 * decode. We strip the marker and decode manually.
 */
class NineRouterGateway extends OpenAiCompatibleGateway
{
    public function generateTextStep(
        TextProvider $provider,
        string $model,
        ?string $instructions,
        array $messages,
        array $tools,
        ?array $schema,
        ?TextGenerationOptions $options,
        ?int $timeout,
        StepContext $stepContext,
    ): StepResponse {
        $body = $this->buildStepBody($provider, $model, $instructions, $messages, $tools, $schema, $options, $stepContext);

        $response = $this->withErrorHandling(
            $provider->name(),
            fn () => $this->client($provider, $timeout)->post('chat/completions', $body),
        );

        $raw = preg_replace('/data: \[DONE\]\s*$/', '', $response->body());
        $data = is_string($raw) && trim($raw) !== '' ? json_decode($raw, true) : null;

        $this->validateTextResponse((array) $data);

        return $this->parseTextResponse((array) $data, $provider, filled($schema));
    }
}
