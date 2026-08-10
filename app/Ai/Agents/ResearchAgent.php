<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class ResearchAgent implements Agent
{
    use Promptable;

    public function instructions(): string
    {
        return 'You are a professional investment research analyst. You never invent numbers; you only analyze the provided data and write clear, structured analysis.';
    }
}
