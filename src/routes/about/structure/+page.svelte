<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl">
		<PageHeader title="Cơ cấu tổ chức" subtitle="Cơ cấu tổ chức của Mạng lưới" />

		<div class="prose max-w-none">
			<section class="mb-12">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Ban điều hành</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Giám đốc</h3>
						<p class="text-slate-600">Prof. Dr. Nguyen Van A</p>
						<p class="text-sm text-slate-500">
							Oversees strategic direction and network development
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Deputy Director</h3>
						<p class="text-slate-600">Assoc. Prof. Dr. Tran Thi B</p>
						<p class="text-sm text-slate-500">
							Manages day-to-day operations and program coordination
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
