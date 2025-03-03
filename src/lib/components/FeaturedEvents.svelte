<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import { fade } from 'svelte/transition';
	import BaseCard from './BaseCard.svelte';
	import { Users, Calendar, MapPin, ChevronRight } from 'lucide-svelte';
	interface Event {
		id: string;
		slug: string;
		title: string;
		summary: string;
		startDate: number;
		endDate: number;
		location: string;
		image: string;
		category: string;
		participants: number;
	}

	const categories = ['All', 'Workshop', 'Conference', 'Symposium', 'Competition'];
	let selectedCategory = 'All';

	let featuredEvents: Event[] = [
		{
			id: '1',
			slug: 'research-symposium-2025',
			title: 'Annual Research Symposium 2025',
			summary:
				'Join us for our flagship research symposium showcasing groundbreaking student projects and innovations across multiple disciplines. Network with leading academics and industry professionals.',
			startDate: new Date('2025-04-15T09:00:00').getTime(),
			endDate: new Date('2025-04-15T17:00:00').getTime(),
			location: 'Main Auditorium',
			image: 'https://placehold.co/1200x800',
			category: 'Symposium',
			participants: 450
		},
		{
			id: '2',
			slug: 'ai-workshop-series',
			title: 'AI Workshop Series',
			summary:
				'Hands-on workshops covering the latest developments in artificial intelligence and machine learning',
			startDate: new Date('2025-04-20T14:00:00').getTime(),
			endDate: new Date('2025-04-22T17:00:00').getTime(),
			location: 'Innovation Lab',
			image: 'https://placehold.co/800x600',
			category: 'Workshop',
			participants: 120
		},
		{
			id: '3',
			slug: 'tech-hackathon',
			title: 'Innovation Hackathon 2025',
			summary:
				'48-hour hackathon challenging students to solve real-world problems with technology',
			startDate: new Date('2025-05-01T09:00:00').getTime(),
			endDate: new Date('2025-05-03T09:00:00').getTime(),
			location: 'Engineering Building',
			image: 'https://placehold.co/800x600',
			category: 'Competition',
			participants: 200
		},
		{
			id: '4',
			slug: 'robotics-conference',
			title: 'Student Robotics Conference',
			summary: 'Annual conference featuring student research in robotics and automation',
			startDate: new Date('2025-05-10T10:00:00').getTime(),
			endDate: new Date('2025-05-11T17:00:00').getTime(),
			location: 'Conference Center',
			image: 'https://placehold.co/800x600',
			category: 'Conference',
			participants: 300
		},
		{
			id: '5',
			slug: 'data-science-workshop',
			title: 'Applied Data Science Workshop',
			summary: 'Practical workshop on data analysis and visualization techniques',
			startDate: new Date('2025-05-15T13:00:00').getTime(),
			endDate: new Date('2025-05-15T17:00:00').getTime(),
			location: 'Computer Lab B',
			image: 'https://placehold.co/800x600',
			category: 'Workshop',
			participants: 80
		}
	];

	$: filteredEvents =
		selectedCategory === 'All'
			? featuredEvents
			: featuredEvents.filter((event) => event.category === selectedCategory);

	$: smallEvents = filteredEvents.slice(0, 4);
	$: heroEvent = filteredEvents[4] || filteredEvents[filteredEvents.length - 1];

	function formatParticipants(count: number): string {
		return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
	}
</script>

<section class="bg-chalk-100 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-navy-800 mb-4 font-sans text-4xl font-bold uppercase">Sự kiện sắp diễn ra</h2>
			<p class="font-sans text-lg text-slate-600">
				Tham gia cùng cộng đồng nghiên cứu của chúng tôi
			</p>

			<!-- Category Tabs -->
			<div class="mt-8 flex flex-wrap justify-center gap-2">
				{#each categories as category}
					<button
						class="rounded-full px-4 py-2 text-sm font-medium transition-colors
                {selectedCategory === category
							? 'bg-cardinal-600 text-chalk-100'
							: 'bg-chalk-200 hover:bg-cardinal-50 hover:text-cardinal-600 active:bg-cardinal-100 text-slate-600'}"
						on:click={() => (selectedCategory = category)}
					>
						{category}
					</button>
				{/each}
			</div>
		</div>

		{#if filteredEvents.length > 0}
			<div class="grid gap-8 lg:grid-cols-12" in:fade>
				<!-- Small Events Grid -->
				<div class="grid gap-6 lg:col-span-7 lg:grid-cols-2">
					{#each smallEvents as event}
						<BaseCard
							href="/events/{event.slug}"
							padding="p-0"
							background="bg-chalk-100"
							hover={true}
							hoverScale={true}
						>
							<img
								src={event.image}
								alt={event.title}
								class="h-48 w-full object-cover transition-transform group-hover:scale-105"
								loading="lazy"
							/>
							<div class="flex h-full flex-col p-5">
								<div class="flex-1">
									<div class="mb-3 space-y-3">
										<div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
											<span
												class="bg-cardinal-50 text-cardinal-600 ring-cardinal-200 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1"
											>
												{event.category}
											</span>
											<span class="flex items-center gap-1">
												<Users class="h-4 w-4" />
												{formatParticipants(event.participants)}
											</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
											<Calendar class="h-4 w-4" />
											<span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
											<MapPin class="h-4 w-4" />
											<span>{event.location}</span>
										</div>
									</div>
									<h3 class="text-navy-800 mb-3 font-sans text-lg font-bold uppercase">
										{event.title}
									</h3>
								</div>
								<div
									class="text-cardinal-600 hover:text-cardinal-700 mt-auto inline-flex items-center font-medium transition-colors"
								>
									Xem chi tiết
									<ChevronRight class="h-4 w-4" />
								</div>
							</div>
						</BaseCard>
					{/each}
				</div>

				<!-- Hero Event -->
				{#if heroEvent}
					<div class="lg:col-span-5">
						<BaseCard
							href="/events/{heroEvent.slug}"
							padding="p-0"
							background="bg-chalk-100"
							hover={true}
							rounded="rounded-xl"
							hoverScale={true}
						>
							<img
								src={heroEvent.image}
								alt={heroEvent.title}
								class="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-96"
								loading="eager"
							/>
							<div class="flex flex-1 flex-col p-6">
								<div class="flex-1">
									<div class="mb-4 space-y-3">
										<div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
											<span
												class="bg-cardinal-50 text-cardinal-600 ring-cardinal-200 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1"
											>
												{heroEvent.category}
											</span>
											<span class="flex items-center gap-1">
												<Users class="h-4 w-4" />
												{formatParticipants(heroEvent.participants)}
											</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
											<Calendar class="h-4 w-4" />
											<span
												>{formatDate(heroEvent.startDate)} - {formatDate(heroEvent.endDate)}</span
											>
										</div>
										<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
											<MapPin class="h-4 w-4" />
											<span>{heroEvent.location}</span>
										</div>
									</div>
									<h3 class="text-navy-800 mb-3 font-sans text-2xl font-bold uppercase">
										{heroEvent.title}
									</h3>
									<p class="mb-6 font-sans text-slate-600">
										{heroEvent.summary}
									</p>
								</div>
								<div
									class="text-cardinal-600 hover:text-cardinal-700 mt-auto inline-flex items-center font-medium transition-colors"
								>
									Xem chi tiết
									<ChevronRight class="h-4 w-4" />
								</div>
							</div>
						</BaseCard>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center text-slate-500 dark:text-slate-400">
				No events found for this category.
			</div>
		{/if}

		<div class="mt-16 text-center">
			<a
				href="/events"
				class="border-cardinal-200 bg-cardinal-600 hover:bg-cardinal-700 hover:border-cardinal-300 active:bg-cardinal-800 inline-flex items-center rounded-md border px-6 py-3 text-base font-medium text-white transition-all"
			>
				Xem tất cả sự kiện
			</a>
		</div>
	</div>
</section>
