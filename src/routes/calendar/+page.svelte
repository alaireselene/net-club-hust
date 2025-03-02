<script lang="ts">
	import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
	import { vi } from 'date-fns/locale';
	import PageHeader from '$lib/components/PageHeader.svelte';

	// Sample data structure for events
	interface CalendarEvent {
		id: string;
		title: string;
		start: Date;
		end: Date;
		location: string;
		type: 'meeting' | 'workshop' | 'seminar' | 'other';
	}

	let currentDate = new Date();
	let currentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start week on Monday

	// Hardcoded sample events
	const sampleEvents: CalendarEvent[] = [
		{
			id: '1',
			title: 'Họp Câu Lạc Bộ Nghiên Cứu AI',
			start: new Date(2025, 2, 3, 14, 0), // March 3, 2025, 2 PM
			end: new Date(2025, 2, 3, 16, 0),
			location: 'Phòng B1-701',
			type: 'meeting'
		},
		{
			id: '2',
			title: 'Hội Thảo Robotics',
			start: new Date(2025, 2, 4, 9, 0),
			end: new Date(2025, 2, 4, 12, 0),
			location: 'Phòng Lab Đổi Mới',
			type: 'workshop'
		},
		{
			id: '3',
			title: 'Hội Thảo Phương Pháp Nghiên Cứu',
			start: new Date(2025, 2, 5, 15, 30),
			end: new Date(2025, 2, 5, 17, 30),
			location: 'Hội Trường',
			type: 'seminar'
		}
	];

	function nextWeek() {
		currentWeek = addWeeks(currentWeek, 1);
	}

	function previousWeek() {
		currentWeek = subWeeks(currentWeek, 1);
	}

	function getWeekDays() {
		return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
	}

	function getEventsForDate(date: Date) {
		return sampleEvents.filter(
			(event) => format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
		);
	}

	function getEventTypeStyle(type: string) {
		const styles = {
			meeting: 'bg-blue-100 border-blue-300 text-blue-800',
			workshop: 'bg-green-100 border-green-300 text-green-800',
			seminar: 'bg-purple-100 border-purple-300 text-purple-800',
			other: 'bg-gray-100 border-gray-300 text-gray-800'
		};
		return styles[type] || styles.other;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<PageHeader title="Lịch công tác" subtitle="Lịch công tác của Mạng lưới" />
		<div class="flex items-center gap-4">
			<button
				class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				on:click={previousWeek}
			>
				Tuần trước
			</button>
			<span class="text-lg font-semibold">
				{format(currentWeek, 'MMMM/yyyy', { locale: vi })}
			</span>
			<button
				class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				on:click={nextWeek}
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
						<div
							class={`mb-2 rounded border p-2 ${getEventTypeStyle(event.type)} cursor-pointer transition-all hover:shadow-md`}
						>
							<div class="font-semibold">
								{event.title}
							</div>
							<div class="text-sm">
								{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
							</div>
							<div class="text-sm">
								{event.location}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Legend -->
	<div class="mt-6 flex justify-end gap-4">
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
			<span class="text-sm text-gray-600">Họp</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 rounded border border-green-300 bg-green-100"></div>
			<span class="text-sm text-gray-600">Hội thảo</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 rounded border border-purple-300 bg-purple-100"></div>
			<span class="text-sm text-gray-600">Hội nghị</span>
		</div>
	</div>
</div>
