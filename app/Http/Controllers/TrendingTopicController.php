<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Support\FeedPostFormatter;
use App\Support\TrendingTopicFinder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrendingTopicController extends Controller
{
    public function index(TrendingTopicFinder $trendingTopicFinder): Response
    {
        return Inertia::render('trending/index', [
            'topics' => $trendingTopicFinder->get(30),
        ]);
    }

    public function show(
        Request $request,
        string $topic,
        FeedPostFormatter $feedPostFormatter,
        TrendingTopicFinder $trendingTopicFinder
    ): Response {
        $topicKey = $trendingTopicFinder->normalizeKey($topic);
        $allTopics = $trendingTopicFinder->get(30);
        $currentTopic = $allTopics->firstWhere('slug', $topicKey);

        abort_unless($currentTopic, 404);

        $posts = FeedPost::query()
            ->with(['user.mahasiswa', 'images'])
            ->withCount('komentar')
            ->latest()
            ->get()
            ->filter(fn (FeedPost $post) => collect($post->tags ?? [])
                ->contains(fn (string $tag) => $trendingTopicFinder->normalizeKey($tag) === $topicKey))
            ->values();

        $relatedTopics = $allTopics
            ->reject(fn (array $item) => $item['slug'] === $topicKey)
            ->take(6)
            ->values();

        return Inertia::render('trending/show', [
            'topic' => $currentTopic,
            'posts' => $feedPostFormatter->formatMany($posts, $request->user()),
            'relatedTopics' => $relatedTopics,
        ]);
    }
}
