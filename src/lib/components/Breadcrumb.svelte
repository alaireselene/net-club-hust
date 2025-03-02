<script lang="ts">
	import { page } from '$app/state';

	// Convert URL path to breadcrumb segments
	let segments = $state([]);
	segments = page.url.pathname
		.split('/')
		.filter(Boolean)
		.map((segment, index, arr) => ({
			text: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
			href: '/' + arr.slice(0, index + 1).join('/'),
			current: index === arr.length - 1
		}));
</script>

<nav class="mb-4" aria-label="Breadcrumb">
	<ol class="flex items-center space-x-2 text-sm">
		<li>
			<a
				href="/"
				class="hover:text-cardinal-600 text-slate-600 transition-colors"
				aria-label="Home"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
			</a>
		</li>
		{#if segments.length > 0}
			<li>
				<svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</li>
		{/if}
		{#each segments as { text, href, current }}
			<li>
				{#if current}
					<span class="font-medium text-slate-900" aria-current="page">
						{text}
					</span>
				{:else}
					<a {href} class="hover:text-cardinal-600 text-slate-600 transition-colors">
						{text}
					</a>
					<svg
						class="ml-2 inline-block h-5 w-5 text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
