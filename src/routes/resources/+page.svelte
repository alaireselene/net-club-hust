<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let searchQuery = '';
	let selectedFileType = 'all';
	let selectedCategory = 'all';
	let showModal = false;
	let selectedResource: (typeof resources)[number] | null = null;

	// Example resource items
	const resources = [
		{
			id: 1,
			title: 'Hướng dẫn phương pháp nghiên cứu khoa học',
			description:
				'Tài liệu chi tiết về các phương pháp nghiên cứu phổ biến trong khoa học kỹ thuật, bao gồm các ví dụ thực tế và hướng dẫn thực hành. Phù hợp cho sinh viên và nghiên cứu viên mới.',
			type: 'PDF',
			size: '2.5 MB',
			downloadCount: 128,
			updatedAt: '2024-02-28',
			uploader: 'TS. Nguyễn Văn A',
			category: 'Tài liệu nghiên cứu'
		},
		{
			id: 2,
			title: 'Mẫu báo cáo nghiên cứu khoa học',
			description:
				'Template chuẩn cho việc viết báo cáo nghiên cứu khoa học, được thiết kế theo tiêu chuẩn quốc tế. Bao gồm hướng dẫn định dạng và cấu trúc nội dung.',
			type: 'DOCX',
			size: '1.2 MB',
			downloadCount: 256,
			updatedAt: '2024-02-25',
			uploader: 'ThS. Trần Thị B',
			category: 'Tài liệu nghiên cứu'
		},
		{
			id: 3,
			title: 'Bộ công cụ phân tích dữ liệu',
			description:
				'Tập hợp các công cụ hỗ trợ phân tích và xử lý dữ liệu nghiên cứu. Bao gồm scripts thống kê, visualization tools, và hướng dẫn sử dụng chi tiết.',
			type: 'ZIP',
			size: '45 MB',
			downloadCount: 75,
			updatedAt: '2024-02-20',
			uploader: 'TS. Lê Văn C',
			category: 'Công cụ và phần mềm'
		},
		{
			id: 4,
			title: 'Hướng dẫn sử dụng phòng thí nghiệm',
			description:
				'Quy trình và quy định về việc sử dụng các phòng thí nghiệm của trường. Bao gồm các biện pháp an toàn, quy trình vận hành thiết bị, và thủ tục đăng ký sử dụng.',
			type: 'PDF',
			size: '3.1 MB',
			downloadCount: 182,
			updatedAt: '2024-02-15',
			uploader: 'ThS. Phạm Thị D',
			category: 'Tài liệu hướng dẫn'
		},
		{
			id: 5,
			title: 'Quy trình đăng ký thiết bị',
			description:
				'Hướng dẫn chi tiết về quy trình đăng ký và sử dụng thiết bị nghiên cứu. Bao gồm mẫu đơn, thời gian xử lý, và các yêu cầu cần thiết.',
			type: 'PDF',
			size: '1.8 MB',
			downloadCount: 94,
			updatedAt: '2024-02-10',
			uploader: 'TS. Hoàng Văn E',
			category: 'Tài liệu hướng dẫn'
		}
	];

	const fileTypes = ['all', 'PDF', 'DOCX', 'ZIP'];
	const categories = ['all', ...new Set(resources.map((r) => r.category))];

	$: filteredResources = resources.filter((resource) => {
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
			<div
				class="min-h-[20rem] cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
				on:click={() => openModal(resource)}
				on:keypress={(e) => e.key === 'Enter' && openModal(resource)}
				tabindex="0"
				role="button"
			>
				<div class="flex h-full flex-col p-6">
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
							on:click|stopPropagation={() => {}}
						>
							Tải xuống
						</button>
					</div>
				</div>
			</div>
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
				class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
				on:click|stopPropagation={() => {}}
				transition:scale
			>
				{#if selectedResource}
					<div class="space-y-6 p-6">
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
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
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
			</div>
		</div>
	{/if}

	{#if filteredResources.length === 0}
		<div class="py-12 text-center text-slate-600">Không tìm thấy tài nguyên phù hợp</div>
	{/if}
</div>
