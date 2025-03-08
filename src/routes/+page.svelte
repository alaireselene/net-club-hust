<script lang="ts">
	import { Calendar, Users, Lightbulb, Flag } from 'lucide-svelte';
	import FeaturedNews from '$lib/components/FeaturedNews.svelte';
	import FeaturedEvents from '$lib/components/FeaturedEvents.svelte';
	import type { Post, Event } from '$lib/server/db/schema';

	interface PageData {
		stats: Array<{ value: string; label: StatLabel }>;
		featuredPosts: Post[];
		upcomingEvents: Event[];
	}

	type StatLabel = 'Câu lạc bộ' | 'Thành viên' | 'Dự án' | 'Sự kiện';

	let { data }: { data: PageData } = $props();

	const icons = {
		'Câu lạc bộ': Calendar,
		'Thành viên': Users,
		'Dự án': Lightbulb,
		'Sự kiện': Flag
	} as const;

	const stats = data.stats.map((stat) => ({
		Icon: icons[stat.label as keyof typeof icons],
		value: stat.value,
		label: stat.label
	}));

	console.log(data);
</script>

<!-- Hero Section -->
<section
	class="from-chalk-50 to-chalk-100 relative -mt-8 overflow-hidden bg-gradient-to-b px-4 pt-20 pb-28 sm:px-6 lg:px-8"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 -z-10 opacity-50">
		<svg class="h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
			<defs>
				<pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
					<path
						d="M0 30L30 0M0 0L30 30"
						stroke="currentColor"
						class="text-slate-200"
						stroke-width="1"
						fill="none"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	</div>

	<div class="relative mx-auto max-w-7xl">
		<div class="relative z-10 text-center">
			<h1 class="text-navy-900 font-sans text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
				Kết nối, Thúc đẩy, Đổi mới.
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				Mạng lưới kết nối các CLB sinh viên nghiên cứu, thúc đẩy sáng tạo và đổi mới tại Đại học
				Bách khoa Hà Nội
			</p>

			<!-- Stats Grid -->
			<div class="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:gap-x-12 md:grid-cols-4">
				{#each stats as { Icon, value, label }}
					<div class="text-center">
						<div
							class="bg-cardinal-50 ring-cardinal-200 mx-auto flex h-14 w-14 items-center justify-center rounded-xl ring-1"
						>
							<Icon class="text-cardinal-600 h-7 w-7" />
						</div>
						<p class="text-navy-800 mt-4 font-sans text-2xl font-bold">{value}</p>
						<p class="mt-2 text-sm font-medium text-slate-600">{label}</p>
					</div>
				{/each}
			</div>

			<div class="mt-12">
				<a
					href="/network"
					class="border-cardinal-200 bg-cardinal-600 hover:bg-cardinal-700 hover:border-cardinal-300 active:bg-cardinal-800 focus:ring-cardinal-600 inline-flex items-center justify-center rounded-md border px-6 py-3 text-base font-medium text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
				>
					Khám phá mạng lưới
				</a>
			</div>
		</div>
	</div>
</section>

<FeaturedNews posts={data.featuredPosts} />

<FeaturedEvents events={data.upcomingEvents} />
