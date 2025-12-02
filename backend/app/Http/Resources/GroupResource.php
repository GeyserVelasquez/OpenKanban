<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Ejemplo de campo calculado
            'name_uppercase' => strtoupper($this->name),
            
            // Ejemplo de campo condicional
            'full_details' => $this->when($request->has('include_details'), [
                'internal_id' => $this->id,
                'metadata' => 'Información adicional',
            ]),
            
            // Ejemplo de relaciones (si existen en el modelo)
            // 'boards' => BoardResource::collection($this->whenLoaded('boards')),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0.0',
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }
}
