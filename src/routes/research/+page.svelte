<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Users, ArrowUpRight } from 'lucide-svelte';

	// Hardcoded research data
	const research = [
		{
			id: '1',
			year: 2024,
			featured: true,
			title: 'Machine Learning Applications in Renewable Energy',
			titleVi: 'Ứng dụng Machine Learning trong năng lượng tái tạo',
			abstract:
				'A comprehensive study on applying ML algorithms to optimize renewable energy systems.',
			abstractVi:
				'Nghiên cứu toàn diện về việc áp dụng các thuật toán ML để tối ưu hóa các hệ thống năng lượng tái tạo.',
			link: 'https://example.com/research1',
			authors: ['Dr. Nguyen Van A', 'MSc. Tran Thi B']
		},
		{
			id: '2',
			year: 2024,
			featured: true,
			title: 'Smart City Infrastructure Development',
			titleVi: 'Phát triển cơ sở hạ tầng thành phố thông minh',
			abstract:
				'Analysis of modern smart city infrastructure requirements and implementation strategies.',
			abstractVi:
				'Phân tích yêu cầu và chiến lược triển khai cơ sở hạ tầng thành phố thông minh hiện đại.',
			link: 'https://example.com/research2',
			authors: ['Prof. Le Van C']
		},
		{
			id: '3',
			year: 2023,
			title: 'Blockchain in Supply Chain Management',
			titleVi: 'Blockchain trong quản lý chuỗi cung ứng',
			abstract: 'Exploring blockchain technology applications in modern supply chain systems.',
			abstractVi: 'Khám phá ứng dụng công nghệ blockchain trong hệ thống chuỗi cung ứng hiện đại.',
			link: 'https://example.com/research3',
			authors: ['Dr. Pham Van D', 'MSc. Hoang Thi E']
		},
		{
			id: '4',
			year: 2023,
			title: 'IoT Security Framework',
			titleVi: 'Khung bảo mật IoT',
			abstract: 'Development of a comprehensive security framework for IoT devices and networks.',
			abstractVi: 'Phát triển khung bảo mật toàn diện cho thiết bị và mạng IoT.',
			link: 'https://example.com/research4',
			authors: ['Dr. Vo Van F']
		},
		{
			id: '5',
			year: 2022,
			title: 'AI in Healthcare Diagnostics',
			titleVi: 'AI trong chẩn đoán y tế',
			abstract: 'Implementation of AI algorithms for improving medical diagnostic accuracy.',
			abstractVi: 'Triển khai thuật toán AI để cải thiện độ chính xác trong chẩn đoán y tế.',
			link: 'https://example.com/research5',
			authors: ['Prof. Nguyen Van G', 'Dr. Tran Thi H']
		}
	];

	// Group research by year
	const researchByYear = research.reduce(
		(acc, item) => {
			if (!acc[item.year]) {
				acc[item.year] = [];
			}
			if (!item.featured) {
				acc[item.year].push(item);
			}
			return acc;
		},
		{} as Record<number, typeof research>
	);

	// Get featured research
	const featuredResearch = research.filter((item) => item.featured);

	// Sort years in descending order
	const years = Object.keys(researchByYear)
		.map(Number)
		.sort((a, b) => b - a);
</script>

<PageHeader title="Nghiên cứu" subtitle="Các nghiên cứu nổi bật" />

<div class="container mx-auto px-4 py-8">
	{#if featuredResearch.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Featured Research</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each featuredResearch as item}
					<BaseCard
						href={item.link}
						padding="p-6"
						background="bg-white dark:bg-gray-800"
						border="border border-gray-200 dark:border-gray-700"
						shadow="shadow-lg"
						hover={true}
					>
						<div class="space-y-4">
							<div>
								<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
									{item.title}
								</h3>
								<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
									{item.abstract}
								</p>
								<div class="mb-2 text-lg font-semibold text-teal-600 dark:text-teal-400">
									{item.titleVi}
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									{item.abstractVi}
								</p>
							</div>
							<div class="flex flex-wrap gap-2">
								{#each item.authors as author}
									<span
										class="inline-block rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
									>
										{author}
									</span>
								{/each}
							</div>
							<div
								class="flex items-center gap-1 text-sm text-teal-600 group-hover:text-teal-500 dark:text-teal-400"
							>
								<span>View Research</span>
								<ArrowUpRight class="h-4 w-4" />
							</div>
						</div>
					</BaseCard>
				{/each}
			</div>
		</section>
	{/if}

	{#each years as year}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
				{year}
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each researchByYear[year] as item}
					<BaseCard
						href={item.link}
						padding="p-4"
						background="bg-white dark:bg-gray-800"
						border="border border-gray-200 dark:border-gray-700"
						shadow="shadow"
						hover={true}
					>
						<div class="space-y-4">
							<div>
								<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
									{item.title}
								</h3>
								<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
									{item.abstract}
								</p>
								<div class="mb-2 text-base font-semibold text-teal-600 dark:text-teal-400">
									{item.titleVi}
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									{item.abstractVi}
								</p>
							</div>
							<div class="flex flex-wrap gap-2">
								{#each item.authors as author}
									<span
										class="inline-block rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
									>
										{author}
									</span>
								{/each}
							</div>
							<div
								class="flex items-center gap-1 text-sm text-teal-600 group-hover:text-teal-500 dark:text-teal-400"
							>
								<span>View Research</span>
								<ArrowUpRight class="h-4 w-4" />
							</div>
						</div>
					</BaseCard>
				{/each}
			</div>
		</section>
	{/each}
</div>
