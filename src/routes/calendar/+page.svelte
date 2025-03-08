<script lang="ts">
	import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
	import { vi } from 'date-fns/locale';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { Event } from '$lib/server/db/schema';

	type EventType = Event['type'];

	const eventStyles: Record<EventType, string> = {
		workshop: 'bg-green-100 border-green-300 text-green-800',
		competition: 'bg-blue-100 border-blue-300 text-blue-800',
		cultural: 'bg-purple-100 border-purple-300 text-purple-800',
		research: 'bg-orange-100 border-orange-300 text-orange-800',
		synposium: 'bg-teal-100 border-teal-300 text-teal-800'
	};

	const typeLabels: Record<EventType, string> = {
		workshop: 'Hội thảo',
		competition: 'Cuộc thi',
		cultural: 'Văn hóa',
		research: 'Nghiên cứu',
		synposium: 'Hội nghị'
	};

	let { data } = $props<{ data: { events: Event[] } }>();
	let currentDate = $state(new Date());
	let currentWeek = $state(startOfWeek(currentDate, { weekStartsOn: 1 })); // Start week on Monday

	function nextWeek() {
		currentWeek = addWeeks(currentWeek, 1);
		// TODO: Implement reload with new date range
	}

	function previousWeek() {
		currentWeek = subWeeks(currentWeek, 1);
		// TODO: Implement reload with new date range
	}

	function getWeekDays(): Date[] {
		return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
	}

	function getEventsForDate(date: Date): Event[] {
		return data.events.filter(
			(event: Event) => format(event.startDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
		);
	}

	function getEventTypeStyle(type: EventType): string {
		return eventStyles[type];
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<PageHeader title="Lịch công tác" subtitle="Lịch công tác của Mạng lưới" />
		<div class="flex items-center gap-4">
			<button
				class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				onclick={previousWeek}
			>
				Tuần trước
			</button>
			<span class="text-lg font-semibold">
				{format(currentWeek, 'MMMM/yyyy', { locale: vi })}
			</span>
			<button
				class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				onclick={nextWeek}
			>
				Tuần sau
			</button>
		</div>
	</div>

	<div class="overflow-hidden rounded-lg border shadow">
		<!-- Calendar Header -->
		<div class="grid grid-cols-7 bg-gray-50">
			{#each getWeekDays() as day}
				<div class="border-b px-2 py-4 text-center font-semibold">
					<div class="text-sm text-gray-600">
						{format(day, 'EEE', { locale: vi })}
					</div>
					<div class="text-lg">
						{format(day, 'dd/MM')}
					</div>
				</div>
			{/each}
		</div>

		<!-- Calendar Body -->
		<div class="grid grid-cols-7">
			{#each getWeekDays() as day}
				<div class="relative min-h-[200px] border-r border-b p-2">
					{#each getEventsForDate(day) as event}
						<a
							href="/events/{event.slug}"
							class={`mb-2 block rounded border p-2 ${getEventTypeStyle(event.type)} cursor-pointer transition-all hover:shadow-md`}
						>
							<div class="font-semibold">
								{event.title}
							</div>
							<div class="text-sm">
								{format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
							</div>
							<div class="text-sm">
								{event.location}
							</div>
						</a>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Legend -->
	<div class="mt-6 flex justify-end gap-4">
		{#each Object.entries(typeLabels) as [type, label]}
			<div class="flex items-center gap-2">
				<div class={`h-4 w-4 rounded border ${eventStyles[type as EventType]}`}></div>
				<span class="text-sm text-gray-600">{label}</span>
			</div>
		{/each}
	</div>
</div>
