<?php

namespace App\Services;

/**
 * Prose sections produced by an IpsWriter, keyed by IPS section name.
 */
final class IpsNarrative
{
    /** @param  array<string, string>  $sections */
    public function __construct(public readonly array $sections) {}
}
