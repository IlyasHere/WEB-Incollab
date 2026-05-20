<?php

namespace App\Http\Requests;

use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    private const COMING_SOON = 'Coming Soon';

    private const OPEN = 'Open';

    private const CLOSED = 'Closed';

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
        $imageRule = $this->route('event') instanceof Event ? 'nullable' : 'required';
        $registrationStatus = $this->input('registration_status');
        $requiresRegistrationFields = $registrationStatus === self::OPEN;

        return [
            'judul_event' => ['required', 'string', 'max:150'],
            'deskripsi_event' => ['nullable', 'string'],
            'tanggal_event' => ['required', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_event'],
            'lokasi' => [
                Rule::requiredIf($requiresRegistrationFields),
                'nullable',
                'string',
                'max:100',
            ],
            'kategori_event' => [
                'required',
                'string',
                Rule::in(['Kompetisi', 'Workshop', 'Seminar', 'Hackathon']),
            ],
            'poin_event' => ['nullable', 'integer', 'min:0'],
            'link_pendaftaran' => [
                Rule::requiredIf($requiresRegistrationFields),
                'nullable',
                'url',
                'max:255',
            ],
            'visibility_status' => ['required', 'string', Rule::in(['Draft', 'Published'])],
            'registration_status' => ['required', 'string', Rule::in([self::COMING_SOON, self::OPEN, self::CLOSED])],
            'poster_event' => [$imageRule, 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'detail_poster_event' => [$imageRule, 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'penyelenggara' => ['required', 'string', 'max:150'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('registration_status') !== self::OPEN) {
            $this->merge([
                'link_pendaftaran' => null,
            ]);
        }
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $event = $this->route('event');

            if (! $event instanceof Event || $event->registration_status !== self::CLOSED) {
                return;
            }

            $restrictedFields = [
                'judul_event',
                'deskripsi_event',
                'tanggal_event',
                'tanggal_selesai',
                'lokasi',
                'kategori_event',
                'poin_event',
                'link_pendaftaran',
                'penyelenggara',
            ];

            foreach ($restrictedFields as $field) {
                $currentValue = match ($field) {
                    'tanggal_event', 'tanggal_selesai' => (string) optional($event->{$field})->toDateString(),
                    default => (string) ($event->getRawOriginal($field) ?? ''),
                };
                $nextValue = (string) ($this->input($field, '') ?? '');

                if ($nextValue !== $currentValue) {
                    $validator->errors()->add(
                        $field,
                        'Event yang sudah closed hanya bisa mengubah visibility.'
                    );
                }
            }

            if (($this->input('registration_status') ?? self::CLOSED) !== $event->registration_status) {
                $validator->errors()->add(
                    'registration_status',
                    'Registration status event yang sudah closed tidak bisa diubah.'
                );
            }

            if ($this->hasFile('poster_event') || $this->hasFile('detail_poster_event')) {
                $validator->errors()->add(
                    'poster_event',
                    'Gambar event yang sudah closed tidak bisa diubah.'
                );
            }
        });
    }
}
