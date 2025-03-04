<script lang="ts">
	// Props for different card styles and behaviors
	let {
		href = undefined,
		onClick = undefined,
		featured = false,
		padding = 'p-4',
		hover = 'true',
		background = 'bg-white dark:bg-slate-900',
		border = 'border border-slate-200 dark:border-slate-800',
		rounded = 'rounded-lg',
		shadow = 'shadow-sm',
		hoverShadow = 'hover:shadow-md',
		hoverScale = false,
		transition = 'transition-all',
		children
	} = $props();

	type ElementType = 'a' | 'button' | 'div';

	// Using Svelte 5 Runes syntax
	$effect(() => {
		cardClasses = [
			'group relative flex flex-col overflow-hidden',
			padding,
			background,
			border,
			rounded,
			shadow,
			hover && hoverShadow,
			hoverScale && 'hover:scale-105',
			transition
		]
			.filter(Boolean)
			.join(' ');
	});

	let cardClasses = $state('');
	let isInteractive = $state(false);
	let element: ElementType = $state('div');

	$effect(() => {
		isInteractive = Boolean(href || onClick);
		element = (href ? 'a' : onClick ? 'button' : 'div') as ElementType;
	});
</script>

{#if element === 'a'}
	<a {href} class={cardClasses} on:click on:keydown role="button" tabindex="0">
		{#if featured}
			<div
				class="absolute top-2 right-2 z-10 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white"
			>
				Featured
			</div>
		{/if}
		{@render children()}
	</a>
{:else if element === 'button'}
	<button class={cardClasses} on:click={onClick} on:keydown>
		{#if featured}
			<div
				class="absolute top-2 right-2 z-10 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white"
			>
				Featured
			</div>
		{/if}
		{@render children()}
	</button>
{:else}
	<div class={cardClasses}>
		{#if featured}
			<div
				class="absolute top-2 right-2 z-10 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white"
			>
				Featured
			</div>
		{/if}
		{@render children()}
	</div>
{/if}
