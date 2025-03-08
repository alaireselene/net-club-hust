<script lang="ts">
	import { page } from '$app/state';
	import { LucideAlertTriangle } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
		// Log error for tracking (you can integrate with your preferred error tracking service)
		console.error('Page Error:', {
			status: page.status,
			error: page.error,
			url: page.url.pathname,
			timestamp: new Date().toISOString()
		});
	});

	const getErrorMessage = (status: number) => {
		switch (status) {
			case 404:
				return 'Trang bạn đang tìm kiếm không tồn tại.';
			case 403:
				return 'Bạn không có quyền truy cập trang này.';
			case 500:
				return 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.';
			default:
				return 'Đã xảy ra lỗi không mong muốn.';
		}
	};
</script>

<div
	class="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center"
	class:opacity-0={!mounted}
	class:opacity-100={mounted}
	style="transition: opacity 0.3s ease-in-out"
>
	{#if mounted}
		<div
			in:fly={{ y: 50, duration: 500, delay: 100 }}
			class="mx-auto flex max-w-lg flex-col items-center"
		>
			<div class="text-crimson-600 mb-6 animate-bounce">
				<LucideAlertTriangle size={64} strokeWidth={1.5} class="outline-current" />
			</div>

			<h1
				class="text-cardinal-900 mb-4 text-4xl font-bold"
				in:fly={{ y: 50, duration: 500, delay: 200 }}
			>
				Lỗi {page.status}
			</h1>

			<p class="text-charcoal-600 mb-8 text-lg" in:fly={{ y: 50, duration: 500, delay: 300 }}>
				{getErrorMessage(page.status)}
			</p>

			{#if page.error?.message}
				<div
					class="text-charcoal-600 mb-8 rounded-lg border border-red-100 bg-red-50 p-4 text-sm"
					in:fly={{ y: 50, duration: 500, delay: 400 }}
				>
					<code class="font-mono">
						{page.error.message}
					</code>
				</div>
			{/if}

			<a
				href="/"
				class="bg-cardinal-red hover:bg-cardinal-red/90 text-cardinal-900 inline-flex items-center rounded-lg px-6 py-3 text-base font-medium transition-colors duration-200"
				in:fly={{ y: 50, duration: 500, delay: 500 }}
			>
				Về Trang Chủ
			</a>
		</div>
	{/if}
</div>

<style lang="postcss">
	/* Custom animation for the alert icon bounce */
	.animate-bounce {
		animation: gentleBounce 2s infinite;
	}

	@keyframes gentleBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
		}
	}
</style>
