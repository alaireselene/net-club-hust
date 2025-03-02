<script lang="ts">
	import { formatDate } from '$lib/utils/date';

	interface EventWithTranslation {
		id: string;
		slug: string;
		startDate: number | Date;
		endDate: number | Date;
		featured: boolean;
		translation: {
			title: string;
			summary: string;
			location: string;
		} | null;
	}

	export let event: EventWithTranslation;
</script>

<a
	href="/events/{event.slug}"
	class="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
>
	{#if event.featured}
		<div
			class="absolute top-2 right-2 z-10 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white"
		>
			Featured
		</div>
	{/if}

	<div class="flex flex-col gap-4 p-4">
		<div class="space-y-1">
			<h3
				class="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
			>
				{event.translation?.title ?? 'Untitled Event'}
			</h3>
			<p class="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
				{event.translation?.summary ?? 'No description available'}
			</p>
		</div>

		<div class="mt-auto space-y-2 text-sm">
			<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
			</div>

			<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span>{event.translation?.location ?? 'Location TBA'}</span>
			</div>
		</div>
	</div>
</a>
