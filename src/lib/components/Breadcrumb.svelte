<script lang="ts">
	import { page } from '$app/state';
	import { Home, ChevronRight } from 'lucide-svelte';

	interface BreadcrumbSegment {
		text: string;
		href: string;
	}

	// Get breadcrumb data from page data
	let segments = $state<BreadcrumbSegment[]>([]);

	$effect(() => {
		// Don't show breadcrumb on home page
		if (page.url.pathname === '/') {
			segments = [];
			return;
		}

		// Use breadcrumb data from page data if available
		if (page.data.breadcrumb) {
			segments = page.data.breadcrumb;
			return;
		}

		// Fallback to URL-based breadcrumb if no data provided
		segments = page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, index, arr) => ({
				text: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
				href: '/' + arr.slice(0, index + 1).join('/')
			}));
	});
</script>

{#if segments.length > 0}
	<nav class="mb-4" aria-label="Breadcrumb">
		<ol class="flex items-center space-x-2 text-sm">
			<li>
				<a
					href="/"
					class="hover:text-cardinal-600 text-slate-600 transition-colors"
					aria-label="Home"
				>
					<Home class="inline-block h-5 w-5 stroke-current" />
				</a>
			</li>
			<li>
				<svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</li>
			{#each segments as { text, href }, i}
				<li>
					{#if i === segments.length - 1}
						<span class="font-medium text-slate-900" aria-current="page">
							{text}
						</span>
					{:else}
						<a {href} class="hover:text-cardinal-600 text-slate-600 transition-colors">
							{text}
						</a>
						<ChevronRight class="inline-block h-5 w-5 text-slate-400" />
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
