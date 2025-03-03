<script lang="ts">
	type ElementType = 'a' | 'button' | 'div';

	interface $$Props {
		href?: string;
		onClick?: () => void;
		featured?: boolean;
		padding?: string;
		hover?: boolean;
		background?: string;
		border?: string;
		rounded?: string;
		shadow?: string;
		hoverShadow?: string;
		hoverScale?: boolean;
		transition?: string;
	}

	// Props for different card styles and behaviors
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let featured = false;
	export let padding = 'p-4';
	export let hover = true;
	export let background = 'bg-white dark:bg-slate-900';
	export let border = 'border border-slate-200 dark:border-slate-800';
	export let rounded = 'rounded-lg';
	export let shadow = 'shadow-sm';
	export let hoverShadow = 'hover:shadow-md';
	export let hoverScale = false;
	export let transition = 'transition-all';

	// Generate class string based on props
	$: cardClasses = [
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

	// Determine if the card should be a button/link or div
	$: isInteractive = href || onClick;
	$: element = (href ? 'a' : onClick ? 'button' : 'div') as ElementType;
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
		<slot />
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
		<slot />
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
		<slot />
	</div>
{/if}
