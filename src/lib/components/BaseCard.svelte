<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		href?: string;
		onclick?: (event: MouseEvent) => void;
		onkeydown?: (event: KeyboardEvent) => void;
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
		class?: ClassValue;
		children: () => any;
	};

	type ElementType = 'a' | 'button' | 'div';

	let props: Props = $props();
	let isInteractive = $derived(Boolean(props.href || props.onclick));
	let element = $derived(props.href ? 'a' : props.onclick ? 'button' : ('div' as ElementType));

	const baseClasses = [
		'group relative flex flex-col overflow-hidden',
		props.padding ?? 'p-4',
		props.background ?? 'bg-white dark:bg-slate-900',
		props.border ?? 'border border-slate-200 dark:border-slate-800',
		props.rounded ?? 'rounded-lg',
		props.shadow ?? 'shadow-sm',
		{ [props.hoverShadow ?? 'hover:shadow-md']: props.hover },
		{ 'hover:scale-105': props.hoverScale },
		props.transition ?? 'transition-all',
		props.class
	];

	const featuredBadgeClasses = [
		'absolute top-2 right-2 z-10',
		'rounded-full bg-teal-500',
		'px-2 py-0.5',
		'text-xs font-medium text-white'
	];
</script>

{#if element === 'a'}
	<a
		href={props.href}
		class={baseClasses}
		onclick={props.onclick}
		onkeydown={props.onkeydown}
		role="button"
		tabindex="0"
	>
		{#if props.featured}
			<div class={featuredBadgeClasses}>Nổi bật</div>
		{/if}
		{@render props.children()}
	</a>
{:else if element === 'button'}
	<button class={baseClasses} onclick={props.onclick} onkeydown={props.onkeydown}>
		{#if props.featured}
			<div class={featuredBadgeClasses}>Nổi bật</div>
		{/if}
		{@render props.children()}
	</button>
{:else}
	<div class={baseClasses}>
		{#if props.featured}
			<div class={featuredBadgeClasses}>Nổi bật</div>
		{/if}
		{@render props.children()}
	</div>
{/if}
