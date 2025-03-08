<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Users } from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	interface Club {
		id: number;
		name: string;
		description: string;
		members: number;
	}

	interface School {
		id: number;
		name: string;
		shortName: string;
		clubs: Club[];
	}

	// Mock data for schools/faculties and their clubs
	const networkData: School[] = [
		{
			id: 1,
			name: 'Trường CNTT&TT',
			shortName: 'SOICT',
			clubs: [
				{
					id: 101,
					name: 'Data Science Club',
					description: 'Nghiên cứu phân tích dữ liệu và học máy',
					members: 45
				},
				{
					id: 102,
					name: 'Web Development Hub',
					description: 'Phát triển ứng dụng web hiện đại',
					members: 38
				}
			]
		},
		{
			id: 2,
			name: 'Trường Hóa & KHSS',
			shortName: 'SCLS',
			clubs: [
				{
					id: 201,
					name: 'Green Chemistry Club',
					description: 'Nghiên cứu quy trình hóa học bền vững',
					members: 32
				}
			]
		}
	];

	let schoolFilter = $state<string | null>(null);

	// Update schoolFilter when URL changes
	$effect(() => {
		schoolFilter = page.url.searchParams.get('school');
	});

	// Filter schools based on URL query
	let filteredData = $derived(
		schoolFilter
			? networkData.filter(
					(school) =>
						school.shortName.toLowerCase() === schoolFilter?.toLowerCase() ||
						school.id.toString() === schoolFilter
				)
			: networkData
	);

	function filterBySchool(school: School) {
		goto(`?school=${school.shortName}`);
	}

	function navigateToClub(clubId: number) {
		goto(`/network/${clubId}`);
	}
</script>

<PageHeader title="Mạng lưới thành viên" />

<div class="container mx-auto px-4 py-8">
	<!-- School filters -->
	<div class="mb-6 flex flex-wrap gap-2">
		<button
			class={[
				'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
				!schoolFilter
					? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
			]}
			onclick={() => goto('/network')}
		>
			Toàn bộ
		</button>
		{#each networkData as school}
			<button
				class={[
					'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
					schoolFilter === school.shortName
						? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
				]}
				onclick={() => filterBySchool(school)}
			>
				{school.shortName}
			</button>
		{/each}
	</div>

	<div class="grid gap-8">
		{#each filteredData as school}
			<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="flex items-center gap-3 text-2xl font-semibold text-gray-800 dark:text-white">
						<span
							class="rounded bg-teal-100 px-2 py-1 font-mono text-sm text-teal-800 dark:bg-teal-900 dark:text-teal-100"
						>
							{school.shortName}
						</span>
						<span>{school.name}</span>
					</h2>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each school.clubs as club}
						<BaseCard
							onclick={() => navigateToClub(club.id)}
							background="bg-gray-50 dark:bg-gray-700"
							hover={true}
							hoverScale={true}
							shadow="shadow-sm"
							hoverShadow="hover:shadow-lg"
							padding="p-4"
						>
							<h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
								{club.name}
							</h3>
							<p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
								{club.description}
							</p>
							<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
								<Users class="mr-1 h-4 w-4" />
								<span>{club.members} thành viên</span>
							</div>
						</BaseCard>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
