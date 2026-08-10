<?php

namespace Tests\Feature;

use App\Models\Bond;
use App\Models\MutualFund;
use App\Models\Research;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ResearchControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_displays_researches(): void
    {
        $user = User::factory()->create(['role' => 'investor']);
        $admin = User::factory()->create(['role' => 'admin']);

        Research::factory()->create([
            'title' => 'BBCA Analysis',
            'status' => 'published',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($user)->get('/research')->assertOk();
    }

    public function test_index_filters_by_category(): void
    {
        $user = User::factory()->create(['role' => 'investor']);
        $admin = User::factory()->create(['role' => 'admin']);

        Research::factory()->create(['category' => 'stock', 'created_by' => $admin->id]);
        Research::factory()->create(['category' => 'bond', 'created_by' => $admin->id]);

        $this->actingAs($user)->get('/research?category=stock')->assertOk();
    }

    public function test_show_displays_research_detail(): void
    {
        $user = User::factory()->create(['role' => 'investor']);
        $admin = User::factory()->create(['role' => 'admin']);

        $research = Research::factory()->create([
            'status' => 'published',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($user)->get("/research/{$research->id}")->assertOk();
    }

    public function test_investor_can_generate_stock_research(): void
    {
        Http::fake();

        $user = User::factory()->create(['role' => 'investor']);
        $stock = Stock::factory()->create(['code' => 'BBCA']);

        $response = $this->actingAs($user)->post('/research/generate', [
            'category' => 'stock',
            'asset_type' => 'stock',
            'asset_code' => 'BBCA',
        ]);

        $response->assertRedirect(route('research.show', Research::latest('id')->first()));
        $this->assertDatabaseHas('researches', [
            'asset_code' => 'BBCA',
            'category' => 'stock',
        ]);
    }

    public function test_investor_can_generate_bond_research(): void
    {
        $user = User::factory()->create(['role' => 'investor']);
        $bond = Bond::factory()->create(['code' => 'INDOFR0001']);

        $response = $this->actingAs($user)->post('/research/generate', [
            'category' => 'bond',
            'asset_type' => 'bond',
            'asset_id' => $bond->id,
        ]);

        $this->assertDatabaseHas('researches', [
            'asset_code' => 'INDOFR0001',
            'category' => 'bond',
        ]);
        $response->assertRedirect(route('research.show', Research::latest('id')->first()));
    }

    public function test_investor_can_generate_fund_research(): void
    {
        $user = User::factory()->create(['role' => 'investor']);
        $fund = MutualFund::factory()->create(['code' => 'SDPP']);

        $response = $this->actingAs($user)->post('/research/generate', [
            'category' => 'fund',
            'asset_type' => 'fund',
            'asset_id' => $fund->id,
        ]);

        $this->assertDatabaseHas('researches', [
            'asset_code' => 'SDPP',
            'category' => 'fund',
        ]);
        $response->assertRedirect(route('research.show', Research::latest('id')->first()));
    }

    public function test_generate_validates_required_fields(): void
    {
        $user = User::factory()->create(['role' => 'investor']);

        $this->actingAs($user)
            ->post('/research/generate', [])
            ->assertSessionHasErrors(['category', 'asset_type']);
    }
}
