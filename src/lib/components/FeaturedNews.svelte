<script lang="ts">
	import { fade } from 'svelte/transition';
	import BaseCard from './BaseCard.svelte';
	import { Eye, ChevronRight } from 'lucide-svelte';
	import type { Post } from '$lib/server/db/schema';

	type PostCategory = Post['category'];
	type CategoryType = 'All' | PostCategory;

	const categories: CategoryType[] = ['All', 'news', 'announcement', 'research', 'achievement'];

	let { posts = [] }: { posts: Post[] } = $props();
	let selectedCategory = $state<CategoryType>('All');

	const categoryLabels: Record<CategoryType, string> = {
		All: 'Tất cả',
		news: 'Tin tức',
		announcement: 'Thông báo',
		research: 'Nghiên cứu',
		achievement: 'Thành tựu'
	};

	let filteredPosts = $derived(
		selectedCategory === 'All' ? posts : posts.filter((post) => post.category === selectedCategory)
	);

	let heroPost = $derived(filteredPosts[0]);
	let smallPosts = $derived(filteredPosts.slice(1, 5));

	// Placeholder view count until we add it to the schema
	const getViewCount = (post: Post) => Math.floor(Math.random() * 1000) + 100;

	function formatViews(views: number): string {
		return views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString();
	}

	function getCategoryLabel(category: PostCategory): string {
		return categoryLabels[category] || category;
	}
</script>

<section class="bg-chalk-100 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-navy-800 mb-4 font-sans text-4xl font-bold uppercase">Tin tức</h2>
			<p class="font-sans text-lg text-slate-600">Các thông tin mới nhất từ Mạng lưới</p>

			<!-- Category Tabs -->
			<div class="mt-8 flex flex-wrap justify-center gap-2">
				{#each categories as category}
					<button
						class={[
							'rounded-full px-4 py-2 text-sm font-medium transition-colors',
							{
								'bg-cardinal-600 text-chalk-100': selectedCategory === category,
								'bg-chalk-200 hover:bg-cardinal-50 hover:text-cardinal-600 active:bg-cardinal-100 text-slate-600':
									selectedCategory !== category
							}
						]}
						onclick={() => (selectedCategory = category)}
					>
						{categoryLabels[category]}
					</button>
				{/each}
			</div>
		</div>

		{#if filteredPosts.length > 0}
			<div class="grid gap-8 lg:grid-cols-12" in:fade>
				<!-- Hero Article -->
				{#if heroPost}
					<div class="lg:col-span-7">
						<BaseCard
							href="/news/{heroPost.slug}"
							padding="p-0"
							background="bg-chalk-100"
							hover={true}
							rounded="rounded-xl"
							hoverScale={true}
						>
							<img
								src={heroPost.featuredImageUrl || 'https://placehold.co/1200x800'}
								alt={heroPost.title}
								class="h-72 w-full object-cover transition-transform group-hover:scale-105 sm:h-96"
								loading="eager"
							/>
							<div class="flex flex-1 flex-col p-6">
								<div class="flex-1">
									<div class="mb-4 flex items-center gap-4 text-sm text-slate-500">
										<span
											class="bg-cardinal-50 text-cardinal-600 ring-cardinal-200 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1"
										>
											{getCategoryLabel(heroPost.category)}
										</span>
										{#if heroPost.publishedAt}
											<time datetime={heroPost.publishedAt?.toISOString()} class="font-medium">
												{heroPost.publishedAt.toLocaleDateString('vi-VN')}
											</time>
										{/if}
										<span class="flex items-center gap-1.5">
											<Eye class="h-4 w-4" />
											{formatViews(getViewCount(heroPost))}
										</span>
									</div>
									<h3 class="text-navy-800 mb-3 font-sans text-2xl font-bold uppercase">
										{heroPost.title}
									</h3>
									<p class="mb-6 font-sans text-slate-600">
										{heroPost.shortDescription || heroPost.excerpt || ''}
									</p>
								</div>
								<div
									class="text-cardinal-600 hover:text-cardinal-700 mt-auto inline-flex items-center font-medium transition-colors"
								>
									Xem thêm
									<ChevronRight class="ml-1 h-4 w-4" />
								</div>
							</div>
						</BaseCard>
					</div>
				{/if}

				<!-- Small Articles Grid -->
				<div class="grid gap-6 lg:col-span-5 lg:grid-cols-2">
					{#each smallPosts as post}
						<BaseCard
							href="/news/{post.slug}"
							padding="p-0"
							background="bg-chalk-100"
							hover={true}
							hoverScale={true}
						>
							<img
								src={post.featuredImageUrl || 'https://placehold.co/800x600'}
								alt={post.title}
								class="h-48 w-full object-cover transition-transform group-hover:scale-105"
								loading="lazy"
							/>
							<div class="flex flex-1 flex-col p-5">
								<div class="flex-1">
									<div class="mb-3 flex items-center gap-3 text-sm text-slate-500">
										<span
											class="bg-cardinal-50 text-cardinal-600 ring-cardinal-200 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1"
										>
											{getCategoryLabel(post.category)}
										</span>
										<span class="flex items-center gap-1">
											<Eye class="h-4 w-4" />
											{formatViews(getViewCount(post))}
										</span>
									</div>
									<h3 class="text-navy-800 mb-3 font-sans text-lg font-bold uppercase">
										{post.title}
									</h3>
								</div>
								<div
									class="text-cardinal-600 hover:text-cardinal-700 mt-auto inline-flex items-center font-medium transition-colors"
								>
									Xem thêm
									<ChevronRight class="ml-1 h-4 w-4" />
								</div>
							</div>
						</BaseCard>
					{/each}
				</div>
			</div>
		{:else}
			<div class="text-center text-gray-500 dark:text-gray-400">
				Không tìm thấy bài viết nào trong danh mục này.
			</div>
		{/if}

		<div class="mt-16 text-center">
			<a
				href="/news"
				class="border-cardinal-200 bg-cardinal-600 hover:bg-cardinal-700 hover:border-cardinal-300 active:bg-cardinal-800 inline-flex items-center rounded-md border px-6 py-3 text-base font-medium text-white transition-all"
			>
				Xem tất cả tin tức
			</a>
		</div>
	</div>
</section>
