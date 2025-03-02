<script lang="ts">
	let featuredPosts = [
		{
			id: '1',
			slug: 'new-research-lab-opening',
			title: 'New Research Lab Opening',
			summary:
				'State-of-the-art research facility opening next month with focus on AI and robotics',
			category: 'Research',
			publishedAt: '2025-03-01',
			image: 'https://placehold.co/800x400'
		},
		{
			id: '2',
			slug: 'upcoming-tech-conference',
			title: 'Student Tech Conference 2025',
			summary:
				'Join us for the annual student technology conference featuring keynote speakers from leading tech companies',
			category: 'Events',
			publishedAt: '2025-02-28',
			image: 'https://placehold.co/800x400'
		}
	];
</script>

<section class="bg-white py-12 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<h2 class="mb-4 font-serif text-3xl text-gray-900 dark:text-white">Latest News</h2>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Stay updated with the latest developments from our research community
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			{#each featuredPosts as post}
				<article
					class="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-[1.02] dark:bg-gray-800"
				>
					{#if post.image}
						<img src={post.image} alt={post.title} class="h-48 w-full object-cover" />
					{/if}
					<div class="p-6">
						<div class="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<span
								class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-800 dark:text-teal-100"
							>
								{post.category}
							</span>
							<time datetime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString()}
							</time>
						</div>
						<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
							{post.title}
						</h3>
						<p class="mb-4 text-gray-600 dark:text-gray-300">
							{post.summary}
						</p>
						<a
							href={`/news/${post.slug}`}
							class="inline-flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
						>
							Read more
							<svg class="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>
				</article>
			{/each}
		</div>

		<div class="mt-8 text-center">
			<a
				href="/news"
				class="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700"
			>
				View All News
			</a>
		</div>
	</div>
</section>
