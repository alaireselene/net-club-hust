<script lang="ts">
	import { Calendar, Users, Lightbulb, Flag } from 'lucide-svelte';
	import FeaturedNews from '$lib/components/FeaturedNews.svelte';

	const stats = [
		{ icon: Calendar, value: '15+', label: 'Câu lạc bộ' },
		{ icon: Users, value: '500+', label: 'Thành viên' },
		{ icon: Lightbulb, value: '30+', label: 'Dự án' },
		{ icon: Flag, value: '50+', label: 'Sự kiện' }
	];
</script>

<!-- Hero Section -->
<section
	class="relative -mt-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 pt-16 pb-24 sm:px-6 lg:px-8"
>
	<div class="relative mx-auto max-w-7xl">
		<div class="text-center">
			<h1
				class="text-navy-900 font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
			>
				Mạng lưới Câu lạc bộ Nghiên cứu Sinh viên
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				Kết nối cộng đồng sinh viên nghiên cứu, thúc đẩy sáng tạo và đổi mới tại Đại học Bách khoa
				Hà Nội
			</p>
			<div class="mt-10">
				<a
					href="/network"
					class="inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
				>
					Khám phá mạng lưới
				</a>
			</div>
		</div>
	</div>
	<div class="absolute inset-0 z-0 opacity-50">
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
</section>

<FeaturedNews />

<!-- Network Section -->
<section class="bg-slate-50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
			<div>
				<h2 class="text-navy-900 font-serif text-3xl font-bold sm:text-4xl">
					Mạng lưới nghiên cứu
				</h2>
				<p class="mt-4 text-lg text-slate-600">
					Khám phá mối liên kết giữa các câu lạc bộ, dự án và thành viên trong mạng lưới nghiên cứu
					sinh viên của chúng tôi.
				</p>
				<div class="mt-8">
					<a
						href="/network"
						class="inline-flex items-center rounded-md border border-teal-600 bg-white px-6 py-3 text-base font-medium text-teal-600 shadow-sm transition hover:bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
					>
						Xem biểu đồ mạng lưới
					</a>
				</div>
			</div>
			<div
				class="relative h-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:h-96"
			>
				<!-- Placeholder for D3.js Network Visualization -->
				<div class="absolute inset-0 bg-slate-50">
					<svg class="h-full w-full" viewBox="0 0 800 600">
						<defs>
							<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
								<circle cx="10" cy="10" r="2" fill="currentColor" class="text-slate-200" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#dots)" />
					</svg>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="bg-white py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each stats as { icon: Icon, value, label }}
				<div class="text-center">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
						<svelte:component this={Icon} class="h-6 w-6 text-teal-600" />
					</div>
					<p class="text-navy-900 mt-4 font-serif text-3xl font-bold">{value}</p>
					<p class="mt-1 text-sm text-slate-600">{label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
