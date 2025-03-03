<script lang="ts">
	export let logo: string;
	export let name: string;
	export let description: string;
	export let website: string;
	export let type: 'academic' | 'business';
	export let details: {
		region?: string;
		industry?: string;
		cooperationType?: string;
		internshipInfo?: string;
	};
	import { ChevronRight } from 'lucide-svelte';
</script>

<div
	class="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
>
	<div class="aspect-[4/3] overflow-hidden">
		<img
			src={logo}
			alt={`${name} logo`}
			class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
		/>
	</div>

	<div class="p-4">
		<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
			{name}
		</h3>

		<p class="mb-4 text-gray-600 dark:text-gray-300">
			{description}
		</p>

		<div class="mb-4 space-y-2">
			{#if type === 'academic'}
				<div class="text-sm text-gray-500 dark:text-gray-400">
					<span class="font-medium">Khu vực:</span>
					{details.region}
				</div>
			{:else}
				<div class="text-sm text-gray-500 dark:text-gray-400">
					<span class="font-medium">Ngành nghề:</span>
					{details.industry}
				</div>
				<div class="text-sm text-gray-500 dark:text-gray-400">
					<span class="font-medium">Hình thức hợp tác:</span>
					{details.cooperationType}
				</div>
				{#if details.internshipInfo}
					<div class="text-sm text-gray-500 dark:text-gray-400">
						<span class="font-medium">Cơ hội thực tập:</span>
						{details.internshipInfo}
					</div>
				{/if}
			{/if}
		</div>

		<a
			href={website}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
		>
			Xem thêm
			<ChevronRight class="h-4 w-4" />
		</a>
	</div>
</div>
