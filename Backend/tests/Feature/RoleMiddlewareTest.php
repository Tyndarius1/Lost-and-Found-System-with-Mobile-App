<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_access_staff_only_claims_index(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/claims');

        $response->assertStatus(403);
    }

    public function test_staff_can_access_staff_only_claims_index(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        Sanctum::actingAs($staff);

        $response = $this->getJson('/api/claims');

        $response->assertOk();
        $response->assertJsonStructure(['data']);
    }

    public function test_staff_cannot_access_admin_only_user_import_route(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        Sanctum::actingAs($staff);

        $response = $this->postJson('/api/imports/users');

        $response->assertStatus(403);
    }
}
