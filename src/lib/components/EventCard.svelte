<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import BaseCard from './BaseCard.svelte';
	import { Calendar, MapPin } from 'lucide-svelte';

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

<BaseCard href="/events/{event.slug}" featured={event.featured} padding="p-0">
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
				<Calendar class="h-4 w-4" />
				<span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
			</div>

			<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
				<MapPin class="h-4 w-4" />
				<span>{event.translation?.location ?? 'Location TBA'}</span>
			</div>
		</div>
	</div>
</BaseCard>
