<?php

namespace App\Support;

use App\Models\FeedPost;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class TrendingTopicFinder
{
    public function get(int $limit = 10): Collection
    {
        $since = now()->subDays(7);
        $topics = collect();

        FeedPost::query()
            ->withCount('komentar')
            ->whereNotNull('tags')
            ->latest()
            ->get(['post_id', 'title', 'tags', 'created_at'])
            ->each(function (FeedPost $post) use ($since, $topics): void {
                collect($post->tags ?? [])
                    ->map(fn (string $tag) => $this->normalizeTag($tag))
                    ->filter(fn (?array $tag) => $tag !== null)
                    ->unique('key')
                    ->each(function (array $tag) use ($post, $since, $topics): void {
                        $current = $topics->get($tag['key'], [
                            'tag' => $tag['label'],
                            'slug' => $tag['key'],
                            'postCount' => 0,
                            'recentPostCount' => 0,
                            'commentCount' => 0,
                            'lastUsedAt' => null,
                            'sampleTitle' => null,
                        ]);

                        $isRecent = $post->created_at && $post->created_at->greaterThanOrEqualTo($since);

                        $current['postCount']++;
                        $current['recentPostCount'] += $isRecent ? 1 : 0;
                        $current['commentCount'] += (int) ($post->komentar_count ?? 0);
                        $current['sampleTitle'] ??= $post->title;

                        if (! $current['lastUsedAt'] || ($post->created_at && $post->created_at->greaterThan($current['lastUsedAt']))) {
                            $current['lastUsedAt'] = $post->created_at;
                        }

                        $topics->put($tag['key'], $current);
                    });
            });

        return $topics
            ->map(function (array $topic): array {
                $topic['score'] = ($topic['recentPostCount'] * 3)
                    + ($topic['postCount'] * 2)
                    + $topic['commentCount'];
                $topic['postsLabel'] = $this->formatPostCount($topic['recentPostCount'] ?: $topic['postCount']);
                $topic['lastUsedLabel'] = $topic['lastUsedAt']?->diffForHumans();

                return $topic;
            })
            ->sort(function (array $first, array $second): int {
                $scoreCompare = $second['score'] <=> $first['score'];

                if ($scoreCompare !== 0) {
                    return $scoreCompare;
                }

                return ($second['lastUsedAt']?->timestamp ?? 0) <=> ($first['lastUsedAt']?->timestamp ?? 0);
            })
            ->take($limit)
            ->values();
    }

    public function normalizeKey(string $tag): string
    {
        return (string) Str::of($tag)
            ->trim()
            ->ltrim('#')
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/i', '');
    }

    private function normalizeTag(string $tag): ?array
    {
        $label = trim($tag);

        if ($label === '') {
            return null;
        }

        $label = '#'.ltrim($label, '#');
        $key = $this->normalizeKey($label);

        if ($key === '') {
            return null;
        }

        return [
            'key' => $key,
            'label' => $label,
        ];
    }

    private function formatPostCount(int $count): string
    {
        if ($count >= 1000) {
            return number_format($count / 1000, 1).'k postingan baru';
        }

        return $count.' postingan baru';
    }
}
