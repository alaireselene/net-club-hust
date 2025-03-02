<script lang="ts">
	let categories = [
		{ id: 'research', name: 'Research' },
		{ id: 'events', name: 'Events' },
		{ id: 'announcements', name: 'Announcements' }
	];

	let selectedCategory: string | null = null;
	let loading = false;

	let posts = [
		{
			id: '1',
			slug: 'new-research-lab-opening',
			title: 'New Research Lab Opening',
			summary:
				'State-of-the-art research facility opening next month with focus on AI and robotics',
			category: 'research',
			publishedAt: '2025-03-01',
			image: 'https://placehold.co/600x400'
		},
		{
			id: '2',
			slug: 'upcoming-tech-conference',
			title: 'Student Tech Conference 2025',
			summary:
				'Join us for the annual student technology conference featuring keynote speakers from leading tech companies',
			category: 'events',
			publishedAt: '2025-02-28',
			image: 'https://placehold.co/600x400'
		},
		{
			id: '3',
			slug: 'research-grant-opportunity',
			title: 'Research Grant Applications Open',
			summary: 'New funding opportunities available for student research projects in STEM fields',
			category: 'announcements',
			publishedAt: '2025-02-27',
			image: 'https://placehold.co/600x400'
		}
	];
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<header class="mb-8">
		<h1 class="mb-4 font-serif text-4xl text-gray-900 dark:text-gray-100">Latest News</h1>
		<p class="text-lg text-gray-600 dark:text-gray-300">
			Stay updated with the latest from our research community
		</p>
	</header>

	<!-- Categories -->
	<nav class="mb-8">
		<div class="flex flex-wrap gap-2">
			<button
				class="rounded-full px-4 py-2 text-sm font-medium transition-colors
               {selectedCategory === null
					? 'bg-teal-600 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}"
				on:click={() => (selectedCategory = null)}
			>
				All Categories
			</button>
			{#each categories as category}
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors
                 {selectedCategory === category.id
						? 'bg-teal-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}"
					on:click={() => (selectedCategory = category.id)}
				>
					{category.name}
				</button>
			{/each}
		</div>
	</nav>

	<!-- Posts Grid -->
	{#if loading}
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<div class="animate-pulse">
					<div class="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
					<div class="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div class="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each posts.filter((post) => !selectedCategory || post.category === selectedCategory) as post}
				<article
					class="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02] dark:bg-gray-800"
				>
					{#if post.image}
						<img src={post.image} alt={post.title} class="h-48 w-full object-cover" />
					{/if}
					<div class="p-6">
						<div class="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<span
								class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-800 dark:text-teal-100"
							>
								{categories.find((c) => c.id === post.category)?.name}
							</span>
							<time datetime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString()}
							</time>
						</div>
						<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
							{post.title}
						</h2>
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
	{/if}
</div>
