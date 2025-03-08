<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data }: { data: PageData } = $props();
	let formError = $state('');

	let editingClub: any = $state(null);
	let showForm = $state(false);

	function startEdit(club: any) {
		editingClub = { ...club };
		showForm = true;
		formError = '';
	}

	function resetForm() {
		editingClub = null;
		showForm = false;
		formError = '';
	}
</script>

<PageHeader title="Quản lý CLB" />

<div class="container mx-auto px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-2xl font-bold text-gray-800">Câu lạc bộ</h2>
		<button
			class="bg-cardinal-red text-cardinal-500 hover:bg-crimson-red rounded px-4 py-2 transition-colors"
			onclick={() => {
				showForm = true;
				editingClub = null;
			}}
			aria-label="Thêm CLB mới"
		>
			Thêm CLB mới
		</button>
	</div>

	{#if showForm}
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-xl font-semibold">
				{editingClub ? 'Sửa CLB' : 'Thêm CLB mới'}
			</h3>
			<form
				method="POST"
				action={editingClub ? '?/update' : '?/create'}
				use:enhance={() => {
					formError = '';
					return async ({ result, update }) => {
						if (result.type === 'success') {
							resetForm();
							await update();
						} else if (result.type === 'failure') {
							formError = result.data?.error ?? 'Có lỗi xảy ra';
						}
					};
				}}
				class="space-y-4"
				aria-label={editingClub ? 'Form sửa CLB' : 'Form thêm CLB mới'}
			>
				{#if formError}
					<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600" role="alert">
						{formError}
					</div>
				{/if}

				{#if editingClub}
					<input type="hidden" name="id" value={editingClub.id} />
				{/if}

				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium text-gray-700">Tên CLB</label>
					<input
						type="text"
						id="name"
						name="name"
						value={editingClub?.name ?? ''}
						required
						minlength="3"
						maxlength="255"
						class="focus:border-cardinal-red focus:ring-cardinal-red w-full rounded-md border-gray-300 shadow-sm"
						aria-required="true"
					/>
				</div>

				<div class="space-y-2">
					<label for="description" class="block text-sm font-medium text-gray-700">Mô tả</label>
					<textarea
						id="description"
						name="description"
						required
						minlength="10"
						maxlength="1000"
						rows="4"
						class="focus:border-cardinal-red focus:ring-cardinal-red w-full rounded-md border-gray-300 shadow-sm"
						aria-required="true">{editingClub?.description ?? ''}</textarea
					>
				</div>

				<div class="space-y-2">
					<label for="schoolId" class="block text-sm font-medium text-gray-700"
						>Trường/Khoa/Viện</label
					>
					<select
						name="schoolId"
						id="schoolId"
						class="focus:border-cardinal-red focus:ring-cardinal-red w-full rounded-md border-gray-300 shadow-sm"
						value={editingClub?.schoolId?.toString() ?? ''}
					>
						<option value="">(trống)</option>
						{#each data.schools as school}
							<option value={school.id}>{school.name}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="logoUrl" class="block text-sm font-medium text-gray-700">Logo URL</label>
					<input
						type="url"
						id="logoUrl"
						name="logoUrl"
						value={editingClub?.logoUrl ?? ''}
						placeholder="https://"
						class="focus:border-cardinal-red focus:ring-cardinal-red w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>

				<div class="space-y-2">
					<label for="establishedAt" class="block text-sm font-medium text-gray-700"
						>Ngày thành lập</label
					>
					<input
						type="date"
						id="establishedAt"
						name="establishedAt"
						value={editingClub
							? new Date(editingClub.establishedAt * 1000).toISOString().split('T')[0]
							: ''}
						required
						class="focus:border-cardinal-red focus:ring-cardinal-red w-full rounded-md border-gray-300 shadow-sm"
						aria-required="true"
					/>
				</div>

				<div class="mt-6 flex justify-end gap-2">
					<button
						type="button"
						class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
						onclick={resetForm}
						aria-label="Hủy"
					>
						Hủy
					</button>
					<button
						type="submit"
						class="bg-cardinal-red text-cardinal-500 hover:bg-crimson-red rounded-md px-4 py-2"
						aria-label={editingClub ? 'Cập nhật CLB' : 'Tạo CLB mới'}
					>
						{editingClub ? 'Cập nhật' : 'Tạo'} CLB
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.clubs as club}
			<div class="rounded-lg bg-white p-4 shadow">
				<div class="mb-3 flex items-center gap-4">
					{#if club.logoUrl}
						<img src={club.logoUrl} alt={club.name} class="h-12 w-12 rounded object-cover" />
					{:else}
						<div class="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
							<span class="text-2xl font-bold text-gray-400">
								{club.name[0].toUpperCase()}
							</span>
						</div>
					{/if}
					<div>
						<h3 class="text-lg font-semibold">{club.name}</h3>
						{#if club.schoolId}
							<p class="text-sm text-gray-600">
								{data.schools.find((s) => s.id === club.schoolId)?.name ??
									'Trường/Khoa/Viện không tồn tại'}
							</p>
						{/if}
					</div>
				</div>

				<p class="mb-4 line-clamp-2 text-sm text-gray-600">
					{club.description}
				</p>

				<div class="flex justify-end gap-2">
					<button
						class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
						onclick={() => startEdit(club)}
						aria-label={`Sửa CLB ${club.name}`}
					>
						Sửa
					</button>
					<form
						method="POST"
						action="?/delete"
						use:enhance={({ cancel }) => {
							const confirmed = confirm('Bạn có chắc chắn muốn xóa CLB này không?');
							if (!confirmed) cancel();
							return async ({ result, update }) => {
								if (result.type === 'success') {
									await update();
								}
							};
						}}
						class="inline"
					>
						<input type="hidden" name="id" value={club.id} />
						<button
							type="submit"
							class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
							aria-label={`Xóa CLB ${club.name}`}
						>
							Xóa
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</div>
