<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Download, FileType, Calendar, User, X } from 'lucide-svelte';

	import type { PageData } from './$types';

	interface Resource {
		id: number;
		title: string;
		description: string;
		type: string;
		size: string;
		downloadCount: number;
		updatedAt: string;
		uploader: string;
		category: string;
	}

	let { data } = $props<{ data: { resources: Resource[] } }>();
	let resources = data.resources;

	let searchQuery = '';
	let selectedFileType = 'all';
	let selectedCategory = 'all';
	let showModal = false;
	let selectedResource: Resource | null = null;

	// Example resource items
	const fileTypes = ['all', 'PDF', 'DOCX', 'ZIP'];
	const categories = ['all', ...new Set(resources.map((r: Resource) => r.category))];

	let filteredResources = resources.filter((resource: Resource) => {
		const matchesSearch =
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = selectedFileType === 'all' || resource.type === selectedFileType;
		const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
		return matchesSearch && matchesType && matchesCategory;
	});

	function openModal(resource: (typeof resources)[number]) {
		selectedResource = resource;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedResource = null;
	}

	// Close modal on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showModal) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

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
						{type === 'all' ? 'Định dạng' : type}
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
						{category === 'all' ? 'Danh mục' : category}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Resource Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredResources as resource}
			<BaseCard
				padding="p-6"
				background="bg-white"
				hover={true}
				shadow="shadow-md"
				hoverShadow="hover:shadow-lg"
			>
				<div
					class="cursor-pointer"
					on:click|stopPropagation={() => openModal(resource)}
					on:keydown|stopPropagation={(e) => e.key === 'Enter' && openModal(resource)}
					role="button"
					tabindex="0"
				>
					<div class="flex h-full flex-col">
						<div class="grow space-y-4">
							<div class="flex items-start justify-between">
								<div class="flex items-center space-x-2">
									<span class="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
										{resource.type}
									</span>
									<span class="text-xs text-slate-500">{resource.size}</span>
								</div>
								<span class="text-xs text-slate-500">{resource.downloadCount} lượt tải</span>
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
								Cập nhật: {resource.updatedAt}
							</span>
							<button
								class="rounded-md bg-teal-600 px-4 py-2 text-sm text-white transition-colors hover:bg-teal-700"
							>
								<Download class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div></BaseCard
			>
		{/each}
	</div>

	<!-- Modal Dialog -->
	{#if showModal}
		<div
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
			on:click={closeModal}
			transition:fade
		>
			<div
				class="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
				on:click|stopPropagation={() => {}}
				transition:scale
			>
				<BaseCard padding="p-6" background="bg-white" shadow="shadow-xl">
					{#if selectedResource}
						<div class="space-y-6">
							<div class="flex items-start justify-between">
								<div>
									<h3 class="mb-2 text-xl font-semibold text-slate-800">
										{selectedResource.title}
									</h3>
									<div class="flex items-center space-x-3">
										<span class="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600">
											{selectedResource.type}
										</span>
										<span class="text-sm text-slate-500">{selectedResource.size}</span>
									</div>
								</div>
								<button class="text-slate-400 hover:text-slate-600" on:click={closeModal}>
									<X class="h-6 w-6" />
								</button>
							</div>

							<div class="prose prose-slate max-w-none">
								<p>{selectedResource.description}</p>
							</div>

							<div class="grid grid-cols-2 gap-4 text-sm text-slate-600">
								<div>
									<span class="font-medium">Người đăng tải:</span>
									<p>{selectedResource.uploader}</p>
								</div>
								<div>
									<span class="font-medium">Danh mục:</span>
									<p>{selectedResource.category}</p>
								</div>
								<div>
									<span class="font-medium">Lượt tải:</span>
									<p>{selectedResource.downloadCount}</p>
								</div>
								<div>
									<span class="font-medium">Cập nhật:</span>
									<p>{selectedResource.updatedAt}</p>
								</div>
							</div>

							<div class="flex justify-end border-t pt-4">
								<button
									class="rounded-md bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700"
								>
									Tải xuống
								</button>
							</div>
						</div>
					{/if}
				</BaseCard>
			</div>
		</div>
	{/if}

	{#if filteredResources.length === 0}
		<div class="py-12 text-center text-slate-600">Không tìm thấy tài nguyên phù hợp</div>
	{/if}
</div>
