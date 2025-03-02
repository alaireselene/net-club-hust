<script lang="ts">
	let { title = '', subtitle = '' } = $props();
</script>

<div class="mb-8">
	{#if title}
		<h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
			{title}
		</h1>
	{/if}
	{#if subtitle}
		<p class="mt-3 text-lg leading-8 text-slate-600">
			{subtitle}
		</p>
	{/if}
</div>
