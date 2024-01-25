<?php

namespace Tests\Unit;

use App\Models\Handsone;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HandsoneTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test api loads json as response
     */
    public function test_handsone_load_response(): void
    {
        Handsone::factory()->create();
        $response = $this->get('/api/load');
        $response->assertStatus(200);
        $this->assertEquals([ "name" => "John", "age" => 30, "car" => null] ,(array)json_decode(json_decode($response->content())->data));

    }

    /**
     * Test api saves JSON into the table
     */
    public function test_handsone_save_response_with_invalid_data(): void
    {
        $response = $this->withHeaders([
            'Accept'=>'application/json'
        ])->post('/api/save',  ['test' => 'hello']);

        $response->assertStatus(422);
    }

    /**
     * Test api saves JSON into the table
     */
    public function test_handsone_save_response(): void
    {
        $response = $this->withHeaders([
            'Accept'=>'application/json'
        ])->post('/api/save',  ['body' => 'hello']);

        $response->assertStatus(200);
        $this->assertEquals("success",json_decode($response->content())[0]);
    }
}
