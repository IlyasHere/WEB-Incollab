<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $imageRule = $this->isMethod('post') ? 'required' : 'nullable';

        return [
            'judul_event' => ['required', 'string', 'max:150'],
            'deskripsi_event' => ['nullable', 'string'],
            'tanggal_event' => ['required', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_event'],
            'lokasi' => ['required', 'string', 'max:100'],
            'kategori_event' => [
                'required',
                'string',
                Rule::in(['Kompetisi', 'Workshop', 'Seminar', 'Hackathon']),
            ],
            'poin_event' => ['nullable', 'integer', 'min:0'],
            'link_pendaftaran' => ['nullable', 'url', 'max:255'],
            'status_event' => ['required', 'string', 'max:50'],
            'poster_event' => [$imageRule, 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'detail_poster_event' => [$imageRule, 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'penyelenggara' => ['required', 'string', 'max:150'],
        ];
    }
}
