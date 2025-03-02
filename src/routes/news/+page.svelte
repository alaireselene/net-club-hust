<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';

	let categories = [
		{ id: 'research', name: 'Nghiên cứu' },
		{ id: 'events', name: 'Sự kiện' },
		{ id: 'announcements', name: 'Thông báo' }
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
	<PageHeader title="Tin tức" subtitle="Các tin tức mới nhất" />

	<!-- Categories -->
	<nav class="mb-8">
		<div class="flex flex-wrap gap-2">
			<button
				class="rounded-full px-4 py-2 text-sm font-medium transition-colors
                {selectedCategory === null
					? 'bg-cardinal-600 text-white'
					: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
				on:click={() => (selectedCategory = null)}
			>
				Toàn bộ
			</button>
			{#each categories as category}
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors
                  {selectedCategory === category.id
						? 'bg-cardinal-600 text-white'
						: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
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
					<div class="mb-4 h-48 rounded-lg bg-slate-200"></div>
					<div class="mb-2 h-6 w-3/4 rounded bg-slate-200"></div>
					<div class="h-4 w-1/2 rounded bg-slate-200"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each posts.filter((post) => !selectedCategory || post.category === selectedCategory) as post}
				<article
					class="flex min-h-[24rem] flex-col overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]"
				>
					{#if post.image}
						<img src={post.image} alt={post.title} class="h-48 w-full object-cover" />
					{/if}
					<div class="flex grow flex-col p-6">
						<div class="grow">
							<div class="mb-2 flex items-center gap-2 text-sm text-slate-500">
								<span
									class="bg-cardinal-100 text-cardinal-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{categories.find((c) => c.id === post.category)?.name}
								</span>
								<time datetime={post.publishedAt}>
									{new Date(post.publishedAt).toLocaleDateString()}
								</time>
							</div>
							<h2 class="mb-2 text-xl font-semibold text-slate-900">
								{post.title}
							</h2>
							<p class="text-slate-600">
								{post.summary}
							</p>
						</div>
						<a
							href={`/news/${post.slug}`}
							class="text-cardinal-600 hover:text-cardinal-700 mt-4 inline-flex items-center"
						>
							Đọc tiếp
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
