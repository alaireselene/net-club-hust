<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Users } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Mock data for schools/faculties and their clubs
	const networkData = [
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
		},
		{
			id: 3,
			name: 'Trường Cơ khí',
			shortName: 'SME',
			clubs: [
				{
					id: 301,
					name: 'Robotics Research Club',
					description: 'Nghiên cứu robot và tự động hóa nâng cao',
					members: 50
				},
				{
					id: 302,
					name: 'CAD/CAM Innovation',
					description: 'Công nghệ sản xuất số',
					members: 28
				}
			]
		},
		{
			id: 4,
			name: 'Trường Điện-Điện tử',
			shortName: 'SEEE',
			clubs: [
				{
					id: 401,
					name: 'Renewable Energy Club',
					description: 'Nghiên cứu giải pháp năng lượng bền vững',
					members: 40
				}
			]
		},
		{
			id: 5,
			name: 'Trường Vật liệu',
			shortName: 'SMSE',
			clubs: [
				{
					id: 501,
					name: 'Materials Science Society',
					description: 'Thúc đẩy nghiên cứu và phát triển vật liệu',
					members: 35
				}
			]
		},
		{
			id: 6,
			name: 'Trường Kinh tế',
			shortName: 'SEM',
			clubs: [
				{
					id: 601,
					name: 'Economics Research Group',
					description: 'Phân tích xu hướng và chính sách kinh tế',
					members: 25
				}
			]
		},
		{
			id: 7,
			name: 'Khoa Toán-Tin',
			shortName: 'FAMI',
			clubs: [
				{
					id: 701,
					name: 'Mathematics Society',
					description: 'Thúc đẩy nghiên cứu và giáo dục toán học',
					members: 30
				}
			]
		},
		{
			id: 8,
			name: 'Khoa VLKT',
			shortName: 'SEP',
			clubs: [
				{
					id: 801,
					name: 'Physics Club',
					description: 'Khám phá các khái niệm vật lý cơ bản',
					members: 20
				}
			]
		},
		{
			id: 9,
			name: 'Khoa Ngoại ngữ',
			shortName: 'FOFL',
			clubs: [
				{
					id: 901,
					name: 'Language Exchange Club',
					description: 'Thực hành kỹ năng ngoại ngữ',
					members: 15
				}
			]
		},
		{
			id: 10,
			name: 'Khoa Khoa học & CNGD',
			shortName: 'FED',
			clubs: [
				{
					id: 1001,
					name: 'Environmental Science Club',
					description: 'Nghiên cứu các vấn đề và giải pháp môi trường',
					members: 18
				}
			]
		}
	];

	// Get school filter from URL query
	$: schoolFilter = $page.url.searchParams.get('school');

	// Filter schools based on URL query
	$: filteredData = schoolFilter
		? networkData.filter(
				(school) =>
					school.shortName.toLowerCase() === schoolFilter.toLowerCase() ||
					school.id.toString() === schoolFilter
			)
		: networkData;

	// Handle school filter click
	function filterBySchool(school: { id: number; shortName: string }) {
		goto(`?school=${school.shortName}`);
	}

	// Handle club click
	function navigateToClub(clubId: number) {
		goto(`/network/${clubId}`);
	}
</script>

<PageHeader title="Mạng lưới thành viên" />

<div class="container mx-auto px-4 py-8">
	<!-- School filters -->
	<div class="mb-6 flex flex-wrap gap-2">
		<button
			class="rounded-lg px-4 py-2 text-sm font-medium transition-colors
        {!schoolFilter
				? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
				: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
			on:click={() => goto('/network')}
		>
			Toàn bộ
		</button>
		{#each networkData as school}
			<button
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors
          {schoolFilter === school.shortName
					? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
				on:click={() => filterBySchool(school)}
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
							onClick={() => navigateToClub(club.id)}
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
