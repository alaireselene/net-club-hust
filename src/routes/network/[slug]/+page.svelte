<script lang="ts">
	import type { Club, School } from '$lib/server/db/schema';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { CalendarHeart, FlagTriangleRight, User, GraduationCap } from 'lucide-svelte';

	let { data } = $props();
	const { club, school, leadership = { president: null, advisors: [] } } = $derived(data);

	// Format date to display year only
	const establishedYear = new Date(club.establishedAt).getFullYear();

	// Format member names with fallbacks
	const presidentName = leadership?.president?.fullName || 'Chưa có';
	const advisorNames =
		leadership?.advisors?.length > 0
			? leadership.advisors
					.map((a) => a?.fullName)
					.filter(Boolean)
					.join(', ')
			: 'Chưa có';
</script>

{#if club}
	<PageHeader title={club.name} />

	<div class="container mx-auto px-4 py-8">
		<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
			<!-- School badge -->
			<div class="mb-6">
				<span
					class="rounded bg-teal-100 px-2 py-1 font-mono text-sm text-teal-800 dark:bg-teal-900 dark:text-teal-100"
				>
					{school?.slug.toUpperCase()}
				</span>
				<span class="ml-2 text-gray-600 dark:text-gray-300">
					{school?.name}
				</span>
			</div>

			<!-- Leadership Section -->
			<div class="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
				<h3 class="mb-6 text-xl font-bold text-gray-800 dark:text-white">Ban điều hành</h3>

				<div class="grid gap-6 md:grid-cols-2">
					<!-- President -->
					<div>
						<div class="mb-2 flex items-center">
							<FlagTriangleRight class="text-cardinal-600 dark:text-cardinal-400 h-5 w-5" />
							<span class="ml-2 font-semibold text-gray-700 dark:text-gray-200">Chủ nhiệm</span>
						</div>
						<div class="ml-7 text-gray-600 dark:text-gray-300">{presidentName}</div>
					</div>

					<!-- Advisors -->
					<div>
						<div class="mb-2 flex items-center">
							<GraduationCap class="text-cardinal-600 dark:text-cardinal-400 h-5 w-5" />
							<span class="ml-2 font-semibold text-gray-700 dark:text-gray-200">Cố vấn</span>
						</div>
						<div class="ml-7 text-gray-600 dark:text-gray-300">{advisorNames}</div>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="mb-8 flex items-center space-x-8">
				<div class="flex items-center">
					<User class="text-cardinal-600 dark:text-cardinal-400 h-5 w-5" />
					<span class="ml-2 text-gray-700 dark:text-gray-200">
						<span class="font-semibold">{club.memberCount || 0}</span> thành viên
					</span>
				</div>

				<div class="flex items-center">
					<CalendarHeart class="text-cardinal-600 dark:text-cardinal-400 h-5 w-5" />
					<span class="ml-2 text-gray-700 dark:text-gray-200">
						Thành lập năm <span class="font-semibold">{establishedYear}</span>
					</span>
				</div>
			</div>

			<!-- Description -->
			<div class="prose prose-slate dark:prose-invert max-w-none">
				{@html club.description}
			</div>
		</div>
	</div>
{:else}
	<PageHeader title="Không thấy câu lạc bộ" />
	<div class="container mx-auto px-4 py-8">
		<div class="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
			Không tồn tại câu lạc bộ trong CSDL.
		</div>
	</div>
{/if}
