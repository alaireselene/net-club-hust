<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BaseCard from '$lib/components/BaseCard.svelte';
	import { Users, Search, ChevronsUpDown, ChevronsUp, ChevronsDown, Check } from 'lucide-svelte';
	import { page } from '$app/state';
	import type { School } from '$lib/server/db/schema';
	import { Select } from 'bits-ui';

	let { data } = $props();
	const { schools, clubsBySchool } = data;

	// Convert schools to select options
	const schoolOptions = [
		{ value: '', label: 'Tất cả', data: null },
		...schools.map((school) => ({
			value: school.id.toString(),
			label: school.name,
			data: school
		}))
	];

	let searchQuery = $state('');
	let value = $state('');

	const selectedLabel = $derived(
		schoolOptions.find((option) => option.value === value)?.label ?? 'Chọn trường'
	);

	const selectedSchool = $derived(schoolOptions.find((option) => option.value === value)?.data);

	// Update URL when filter changes
	$effect(() => {
		const url = new URL(window.location.href);
		if (selectedSchool) {
			url.searchParams.set('school', selectedSchool.slug);
		} else {
			url.searchParams.delete('school');
		}
		history.replaceState({}, '', url);
	});

	// Filter based on search and school selection
	let filteredData = $derived(
		schools.filter((school) => {
			const matchesSchool = !selectedSchool || school.id === selectedSchool.id;
			const matchesSearch =
				searchQuery === '' ||
				school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(clubsBySchool[school.id] || []).some((club) =>
					club.name.toLowerCase().includes(searchQuery.toLowerCase())
				);
			return matchesSchool && matchesSearch;
		})
	);
</script>

<PageHeader title="Mạng lưới thành viên" />

<div class="container mx-auto px-4 py-8">
	<!-- Search and filters -->
	<div class="mb-6 flex gap-4">
		<div class="relative flex-1">
			<input
				type="text"
				placeholder="Tìm kiếm câu lạc bộ..."
				bind:value={searchQuery}
				class="focus:border-cardinal-500 focus:ring-cardinal-500 dark:focus:border-cardinal-400 dark:focus:ring-cardinal-400 w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
			/>
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
		</div>

		<Select.Root type="single" bind:value onValueChange={(v) => (value = v)}>
			<Select.Trigger
				class="focus:border-cardinal-500 focus:ring-cardinal-500 dark:focus:border-cardinal-400 dark:focus:ring-cardinal-400 flex h-10 min-w-[200px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:ring-1 focus:outline-none data-[placeholder]:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
			>
				<span>{selectedLabel}</span>
				<ChevronsUpDown class="h-4 w-4 text-gray-500" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 min-w-[var(--bits-select-anchor-width)] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
					sideOffset={4}
				>
					<Select.ScrollUpButton class="flex h-6 w-full items-center justify-center">
						<ChevronsUp class="h-4 w-4" />
					</Select.ScrollUpButton>
					<Select.Viewport class="p-1">
						{#each schoolOptions as option}
							<Select.Item
								value={option.value}
								class="relative flex h-9 cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
							>
								{#snippet children({ selected })}
									<span>{option.label}</span>
									{#if selected}
										<Check class="ml-auto h-4 w-4" />
									{/if}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
					<Select.ScrollDownButton class="flex h-6 w-full items-center justify-center">
						<ChevronsDown class="h-4 w-4" />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>

	<div class="grid gap-8">
		{#each filteredData as school}
			<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="flex items-center gap-3 text-2xl font-semibold text-gray-800 dark:text-white">
						<span
							class="rounded bg-teal-100 px-2 py-1 font-mono text-sm text-teal-800 dark:bg-teal-900 dark:text-teal-100"
						>
							{school.slug.toUpperCase()}
						</span>
						<span>{school.name}</span>
					</h2>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each clubsBySchool[school.id] || [] as club}
						<BaseCard
							background="bg-gray-50 dark:bg-gray-700"
							hover={true}
							hoverScale={true}
							shadow="shadow-sm"
							hoverShadow="hover:shadow-lg"
							padding="p-4"
							><a href={`/network/${club.slug}`}>
								<h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
									{club.name}
								</h3>
								<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
									<Users class="mr-1 h-4 w-4" />
									<span>{club.memberCount} thành viên</span>
								</div>
							</a>
						</BaseCard>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
