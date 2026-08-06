<?php

namespace App\Contracts;

use App\Services\IpsInput;
use App\Services\IpsNarrative;

interface IpsWriter
{
    /**
     * Produce the narrative (prose) sections of an IPS from structured input.
     * Numbers and structure are never produced here — only text.
     */
    public function write(IpsInput $input): IpsNarrative;

    /**
     * Short identifier recorded on generated documents (e.g. "ai" | "rule").
     */
    public function label(): string;
}
