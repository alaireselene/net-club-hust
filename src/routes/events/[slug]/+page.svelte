<script lang="ts">
	import { formatDatetime } from '$lib/utils/date';
	import type { PageData } from './$types';
	import {
		Calendar,
		MapPin,
		Users,
		Globe,
		Facebook,
		Twitter,
		Mail,
		ExternalLink
	} from 'lucide-svelte';

	// Extend base event type with additional properties
	interface EventExtended {
		id: string;
		slug: string;
		startDate: Date;
		endDate: Date;
		featured: boolean;
		translation: {
			title: string;
			summary: string;
			content: string;
			location: string;
			isAiTranslated: boolean;
		};
		// Optional extended properties
		categoryName?: string;
		imageUrl?: string;
		isOnline?: boolean;
		registrationUrl?: string;
		host?: {
			name: string;
			role?: string;
			avatarUrl?: string;
		};
		sponsors?: Array<{
			name: string;
			logoUrl?: string;
		}>;
	}

	export let data: PageData;
	const event: EventExtended = data.event;

	$: startDate = event.startDate instanceof Date ? event.startDate.getTime() : event.startDate;
	$: endDate = event.endDate instanceof Date ? event.endDate.getTime() : event.endDate;

	function shareOnFacebook() {
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
			'_blank'
		);
	}

	function shareOnTwitter() {
		window.open(
			`https://twitter.com/intent/tweet?url=${encodeURIComponent(
				window.location.href
			)}&text=${encodeURIComponent(event.translation?.title ?? 'Event')}`,
			'_blank'
		);
	}

	function shareViaEmail() {
		window.location.href = `mailto:?subject=${encodeURIComponent(
			event.translation?.title ?? 'Event'
		)}&body=${encodeURIComponent(`Check out this event: ${window.location.href}`)}`;
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<article class="space-y-12">
		<!-- Banner Section -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-10 text-white shadow-xl transition-all hover:shadow-2xl"
		>
			{#if event.categoryName}
				<div
					class="absolute top-6 right-6 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors"
				>
					{event.categoryName}
				</div>
			{/if}
			<div class="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
				<div class="space-y-6 lg:w-1/2">
					<h1 class="text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
						{event.translation?.title ?? 'Untitled Event'}
					</h1>
					<p class="text-lg text-slate-200">
						{event.translation?.summary ?? 'No description available'}
					</p>
				</div>
				{#if event.imageUrl}
					<div class="lg:w-1/3">
						<img
							src={event.imageUrl}
							alt={event.translation?.title}
							class="h-64 w-full rounded-lg object-cover shadow-lg"
						/>
					</div>
				{/if}
			</div>
		</div>

		<!-- Main Content Layout -->
		<div class="lg:grid lg:grid-cols-3 lg:gap-12">
			<!-- Left Column: Main Content -->
			<div class="space-y-12 lg:col-span-2">
				<!-- Event Metadata Bar -->
				<div
					class="grid gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900"
				>
					<div class="flex items-start gap-3 text-slate-600 dark:text-slate-400">
						<Calendar class="h-5 w-5 text-teal-600 dark:text-teal-500" />
						<div>
							<span class="font-medium">Date & Time</span><br />
							{formatDatetime(startDate)} - {formatDatetime(endDate)}
						</div>
					</div>

					<div class="flex items-start gap-3 text-slate-600 dark:text-slate-400">
						<MapPin class="h-5 w-5 text-teal-600 dark:text-teal-500" />
						<div>
							<span class="font-medium">Location</span><br />
							{event.translation?.location ?? 'Location TBA'}
						</div>
					</div>

					<div class="flex items-start gap-3 text-slate-600 dark:text-slate-400">
						{#if event.isOnline}
							<Globe class="h-5 w-5 text-teal-600 dark:text-teal-500" />
							<div>
								<span class="font-medium">Format</span><br />
								Online Event
							</div>
						{:else}
							<Users class="h-5 w-5 text-teal-600 dark:text-teal-500" />
							<div>
								<span class="font-medium">Format</span><br />
								In-person Event
							</div>
						{/if}
					</div>
				</div>

				<!-- Event Content -->
				<div
					class="prose prose-slate prose-headings:text-slate-900 prose-a:text-teal-600 hover:prose-a:text-teal-500 prose-strong:text-slate-900 dark:prose-invert dark:prose-headings:text-white dark:prose-a:text-teal-500 dark:hover:prose-a:text-teal-400 dark:prose-strong:text-white max-w-none"
				>
					{@html event.translation?.content ?? ''}
				</div>

				{#if event.translation?.isAiTranslated}
					<div
						class="rounded-lg bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400"
					>
						<p>This content has been automatically translated and may not be 100% accurate.</p>
					</div>
				{/if}
			</div>

			<!-- Right Column: Sidebar -->
			<div class="mt-12 space-y-8 lg:mt-0">
				<!-- Event Organization Details -->
				{#if event.host || event.sponsors}
					<div
						class="space-y-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
					>
						{#if event.host}
							<div class="space-y-4">
								<h3 class="text-base font-medium text-slate-900 dark:text-white">Event Host</h3>
								<div class="flex items-center gap-4">
									{#if event.host.avatarUrl}
										<img
											src={event.host.avatarUrl}
											alt={event.host.name}
											class="h-12 w-12 rounded-full object-cover ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900"
										/>
									{/if}
									<div>
										<p class="font-medium text-slate-900 dark:text-white">{event.host.name}</p>
										{#if event.host.role}
											<p class="text-sm text-slate-600 dark:text-slate-400">{event.host.role}</p>
										{/if}
									</div>
								</div>
							</div>
						{/if}

						{#if event.sponsors}
							<div class="space-y-4">
								<h3 class="text-base font-medium text-slate-900 dark:text-white">Event Sponsors</h3>
								<div class="flex flex-wrap gap-4">
									{#each event.sponsors as sponsor}
										<div
											class="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
										>
											{#if sponsor.logoUrl}
												<img
													src={sponsor.logoUrl}
													alt={sponsor.name}
													class="h-8 w-auto object-contain"
												/>
											{/if}
											<span class="text-sm font-medium text-slate-600 dark:text-slate-300"
												>{sponsor.name}</span
											>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}
				<!-- Registration Section -->
				{#if event.registrationUrl}
					<div
						class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
					>
						<a
							href={event.registrationUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none dark:hover:bg-teal-400"
						>
							Join Event
							<ExternalLink class="h-4 w-4" />
						</a>
					</div>
				{/if}
			</div>
		</div>
	</article>
</div>
