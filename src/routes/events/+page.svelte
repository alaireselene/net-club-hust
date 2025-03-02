<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="space-y-8">
		<PageHeader title="Sự kiện" subtitle="Các sự kiện được tổ chức bởi Thành viên Mạng lưới" />

		{#if data.events.length > 0}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.events as event}
					<EventCard {event} />
				{/each}
			</div>
		{:else}
			<div
				class="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900"
			>
				<p class="text-slate-600 dark:text-slate-400">
					No upcoming events at the moment. Check back later!
				</p>
			</div>
		{/if}
	</div>
</div>
