<script lang="ts">
	import { page } from '$app/stores';

	const post = {
		id: '1',
		slug: 'new-research-lab-opening',
		title: 'New Research Lab Opening',
		content: `
      <p>We are excited to announce the opening of our new state-of-the-art research laboratory next month. This facility will be dedicated to advancing research in artificial intelligence and robotics.</p>
      
      <h2>Facility Features</h2>
      <ul>
        <li>Advanced AI Computing Cluster</li>
        <li>Robotics Testing Arena</li>
        <li>Collaborative Workspace</li>
        <li>Smart Sensors Lab</li>
      </ul>
      
      <h2>Research Focus Areas</h2>
      <p>The lab will focus on several key areas of research including:</p>
      <ul>
        <li>Machine Learning Applications</li>
        <li>Autonomous Systems</li>
        <li>Human-Robot Interaction</li>
        <li>Computer Vision</li>
      </ul>
      
      <h2>Student Opportunities</h2>
      <p>Students will have access to cutting-edge equipment and mentorship from leading researchers in the field. Research positions will be available for both undergraduate and graduate students.</p>
    `,
		category: 'research',
		publishedAt: '2025-03-01',
		author: 'Dr. Sarah Chen',
		image: 'https://placehold.co/1200x600'
	};
</script>

<article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header -->
	<header class="mb-12 text-center">
		<div
			class="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
		>
			<span
				class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-800 dark:text-teal-100"
			>
				Research
			</span>
			<time datetime={post.publishedAt}>
				{new Date(post.publishedAt).toLocaleDateString()}
			</time>
		</div>
		<h1 class="mb-4 font-serif text-4xl text-gray-900 dark:text-gray-100">
			{post.title}
		</h1>
		<p class="text-gray-500 dark:text-gray-400">
			By {post.author}
		</p>
	</header>

	<!-- Featured Image -->
	{#if post.image}
		<div class="mb-12">
			<img
				src={post.image}
				alt={post.title}
				class="h-[400px] w-full rounded-lg object-cover shadow-lg"
			/>
		</div>
	{/if}

	<!-- Content -->
	<div class="prose dark:prose-invert prose-teal mx-auto">
		{@html post.content}
	</div>

	<!-- Navigation -->
	<div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
		<a
			href="/news"
			class="inline-flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
		>
			<svg class="mr-1 h-4 w-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
			Back to News
		</a>
	</div>
</article>
