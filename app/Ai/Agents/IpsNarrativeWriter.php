<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class IpsNarrativeWriter implements Agent
{
    use Promptable;

    public function instructions(): string
    {
        return 'You are a professional Investment Policy Statement writer. You never invent numbers; you only phrase the provided facts as clear prose.';
    }
}
