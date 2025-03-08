<script lang="ts">
	import { Dialog } from 'bits-ui';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Download, X } from 'lucide-svelte';
	import type { Resource } from '$lib/server/db/schema';

	type FileType = Resource['type'];
	type CategoryType = Resource['category'];

	let { data } = $props<{ data: { resources: Resource[] } }>();
	let resources = data.resources;

	let searchQuery = $state('');
	let selectedFileType = $state<'all' | FileType>('all');
	let selectedCategory = $state<'all' | CategoryType>('all');
	let selectedResource = $state<Resource | null>(null);

	const fileTypes: ('all' | FileType)[] = ['all', 'document', 'presentation', 'video', 'link'];
	const categories: ('all' | CategoryType)[] = [
		'all',
		'tools',
		'training',
		'documentation',
		'paper'
	];

	let filteredResources = $derived(
		resources.filter((resource: Resource) => {
			const matchesSearch =
				resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				resource.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType = selectedFileType === 'all' || resource.type === selectedFileType;
			const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
			return matchesSearch && matchesType && matchesCategory;
		})
	);

	function handleDownload(event: MouseEvent) {
		event.stopPropagation();
		// TODO: Implement download logic
	}

	const typeLabels: Record<FileType, string> = {
		document: 'Tài liệu',
		presentation: 'Bài trình bày',
		video: 'Video',
		link: 'Liên kết'
	};

	const categoryLabels: Record<CategoryType, string> = {
		tools: 'Công cụ',
		training: 'Đào tạo',
		documentation: 'Tài liệu',
		paper: 'Bài báo'
	};

	function getTypeLabel(type: string): string {
		return typeLabels[type as FileType];
	}

	function getCategoryLabel(category: string): string {
		return categoryLabels[category as CategoryType];
	}
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
	<PageHeader title="Tài nguyên" subtitle="Tài liệu và công cụ hỗ trợ nghiên cứu" />

	<!-- Search and Filter Section -->
	<div class="mb-8 flex flex-wrap items-center gap-4">
		<div class="min-w-[200px] flex-1">
			<input
				type="text"
				placeholder="Tìm kiếm tài nguyên..."
				bind:value={searchQuery}
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
			/>
		</div>
		<div class="w-[140px]">
			<select
				bind:value={selectedFileType}
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
			>
				{#each fileTypes as type}
					<option value={type}>
						{type === 'all' ? 'Định dạng' : typeLabels[type]}
					</option>
				{/each}
			</select>
		</div>
		<div class="w-[180px]">
			<select
				bind:value={selectedCategory}
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
			>
				{#each categories as category}
					<option value={category}>
						{category === 'all' ? 'Danh mục' : categoryLabels[category]}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Resource Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredResources as resource}
			<Dialog.Root>
				<Dialog.Trigger>
					<BaseCard
						padding="p-6"
						background="bg-white"
						hover={true}
						shadow="shadow-md"
						hoverShadow="hover:shadow-lg"
					>
						<div class="flex h-full flex-col">
							<div class="grow space-y-4">
								<div class="flex items-start justify-between">
									<div class="flex items-center space-x-2">
										<span class="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
											{getTypeLabel(resource.type)}
										</span>
									</div>
									<span class="text-xs text-slate-500">{resource.accessLevel}</span>
								</div>

								<h3 class="line-clamp-2 text-lg font-medium text-slate-800">
									{resource.title}
								</h3>

								<p class="line-clamp-2 text-sm text-slate-600">
									{resource.description}
								</p>
							</div>

							<div class="mt-4 flex items-center justify-between border-t pt-4">
								<span class="text-xs text-slate-500">
									Cập nhật: {new Date(resource.updatedAt).toLocaleDateString('vi')}
								</span>
								<button
									class="rounded-md bg-teal-600 px-4 py-2 text-sm text-white transition-colors hover:bg-teal-700"
									onclick={handleDownload}
								>
									<Download class="h-4 w-4" />
								</button>
							</div>
						</div>
					</BaseCard>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
					/>
					<Dialog.Content
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg
            border bg-white p-6 shadow-xl sm:max-w-[600px] md:w-full"
					>
						<div class="space-y-6">
							<div class="flex items-start justify-between">
								<div>
									<Dialog.Title class="mb-2 text-xl font-semibold text-slate-800">
										{resource.title}
									</Dialog.Title>
									<div class="flex items-center space-x-3">
										<span class="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600">
											{getTypeLabel(resource.type)}
										</span>
										<span class="text-sm text-slate-500">{resource.accessLevel}</span>
									</div>
								</div>
								<Dialog.Close class="text-slate-400 hover:text-slate-600">
									<X class="h-6 w-6" />
									<span class="sr-only">Đóng</span>
								</Dialog.Close>
							</div>

							<Dialog.Description class="prose prose-slate max-w-none">
								<p>{resource.description}</p>
							</Dialog.Description>

							<div class="grid grid-cols-2 gap-4 text-sm text-slate-600">
								<div>
									<span class="font-medium">Danh mục:</span>
									<p>{getCategoryLabel(resource.category)}</p>
								</div>
								<div>
									<span class="font-medium">Cập nhật:</span>
									<p>{new Date(resource.updatedAt).toLocaleDateString('vi')}</p>
								</div>
								<div>
									<span class="font-medium">Quyền truy cập:</span>
									<p>{resource.accessLevel}</p>
								</div>
							</div>

							<div class="flex justify-end border-t pt-4">
								<a
									href={resource.url}
									target="_blank"
									rel="noopener noreferrer"
									class="rounded-md bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700"
								>
									{resource.type === 'link' ? 'Truy cập' : 'Tải xuống'}
								</a>
							</div>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		{/each}
	</div>

	{#if filteredResources.length === 0}
		<div class="py-12 text-center text-slate-600">Không tìm thấy tài nguyên phù hợp</div>
	{/if}
</div>
