<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let mobileMenuOpen = $state(false);
	let currentLang = $state('VI');

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function toggleLanguage() {
		currentLang = currentLang === 'VI' ? 'EN' : 'VI';
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (mobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
			mobileMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	let { children } = $props();
</script>

<div
	class="bg-chalk-100 flex min-h-screen flex-col font-sans"
	class:overflow-hidden={mobileMenuOpen}
>
	<!-- Primary Navigation -->
	<header class="bg-chalk-100 fixed top-0 z-50 w-full shadow-md transition-shadow duration-200">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-20 items-center justify-between">
				<!-- Logo and Text -->
				<a href="/">
					<div class="flex items-center space-x-4">
						<img src="/logo.svg" alt="HUST Research Clubs Network Logo" class="h-12 w-auto" />
						<div class="hidden sm:block">
							<p class="font-sans text-sm font-medium text-slate-600">
								Trung tâm Sáng tạo và Khởi nghiệp Sinh viên
							</p>
							<p class="text-navy-800 font-sans text-lg font-bold uppercase">
								Mạng lưới CLB sinh viên nghiên cứu khoa học
							</p>
						</div>
					</div></a
				>

				<!-- Primary Nav Items -->
				<div class="hidden items-center space-x-6 md:flex">
					<a
						href="/calendar"
						class="group hover:text-cardinal-600 focus:ring-cardinal-600 flex items-center text-slate-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Lịch công tác"
					>
						<span class="flex items-center">
							<svg
								class="group-hover:stroke-cardinal-600 mr-2 h-5 w-5 transition-colors"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Lịch công tác
						</span>
					</a>
					<a
						href="/contact"
						class="group hover:text-cardinal-600 focus:ring-cardinal-600 flex items-center text-slate-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Liên hệ"
					>
						<span class="flex items-center">
							<svg
								class="group-hover:stroke-cardinal-600 mr-2 h-5 w-5 transition-colors"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Liên hệ
						</span>
					</a>
					<button
						class="hover:text-cardinal-600 focus:ring-cardinal-600 text-slate-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Tìm kiếm"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</button>
					<button
						class="border-cardinal-200 bg-chalk-100 text-cardinal-600 hover:bg-cardinal-50 hover:border-cardinal-300 active:bg-cardinal-100 focus:ring-cardinal-600 rounded-md border px-3 py-1.5 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
						onclick={toggleLanguage}
						aria-label={`Switch to ${currentLang === 'VI' ? 'English' : 'Vietnamese'}`}
					>
						{currentLang}
					</button>
				</div>

				<!-- Mobile Menu Button -->
				<button
					class="menu-button hover:text-cardinal-600 focus:ring-cardinal-600 rounded-md p-2 text-slate-600 hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus:outline-none md:hidden"
					onclick={toggleMobileMenu}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-menu"
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
						/>
					</svg>
				</button>
			</div>
		</div>
	</header>

	<!-- Secondary Navigation -->
	<nav class="border-cardinal-100 bg-chalk-50 fixed top-20 z-40 w-full border-y shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="hidden h-14 items-center justify-between md:flex">
				<div class="flex flex-1 items-center justify-between space-x-8">
					{#each [{ href: '/about', text: 'Giới thiệu' }, { href: '/news', text: 'Tin tức' }, { href: '/events', text: 'Sự kiện nổi bật' }, { href: '/network', text: 'Mạng lưới' }, { href: '/resources', text: 'Tài nguyên' }, { href: '/facilities', text: 'Cơ sở vật chất' }] as { href, text }}
						<a
							{href}
							class="hover:text-cardinal-600 focus:ring-cardinal-600 text-slate-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {page
								.url.pathname === href
								? 'text-cardinal-600 font-medium'
								: ''}"
							aria-current={page.url.pathname === href ? 'page' : undefined}
						>
							{text}
						</a>
					{/each}
					<a
						href="https://student.hust.edu.vn"
						target="_blank"
						rel="noopener noreferrer"
						class="text-cardinal-600 hover:text-cardinal-700 focus:ring-cardinal-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Open eHUST in new tab"
					>
						eHUST
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Mobile Menu -->
	<div
		id="mobile-menu"
		class="mobile-menu fixed inset-0 z-30 transform md:hidden"
		class:translate-x-0={mobileMenuOpen}
		class:translate-x-full={!mobileMenuOpen}
		transition:slide={{ duration: 200 }}
	>
		<!-- Previous mobile menu content unchanged -->
		<div
			class="bg-opacity-75 absolute inset-0 bg-slate-600 transition-opacity"
			onclick={toggleMobileMenu}
			aria-hidden="true"
		></div>
		<div
			class="absolute right-0 h-full w-64 transform bg-white shadow-xl transition-transform"
			role="dialog"
			aria-modal="true"
			aria-label="Mobile menu"
		>
			<div class="flex h-20 items-center justify-between border-b border-slate-200 px-4">
				<div class="text-lg font-medium text-slate-900">Menu</div>
				<button
					onclick={toggleMobileMenu}
					class="hover:text-cardinal-600 focus:ring-cardinal-600 rounded-md p-2 text-slate-600 hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					aria-label="Close menu"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<nav class="px-2 py-3">
				<div class="space-y-1">
					{#each [{ href: '/calendar', text: 'Lịch công tác' }, { href: '/contact', text: 'Liên hệ' }] as { href, text }}
						<a
							{href}
							class="hover:text-cardinal-600 block rounded-md px-3 py-2 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 {page
								.url.pathname === href
								? 'text-cardinal-600 bg-slate-50'
								: ''}"
							aria-current={page.url.pathname === href ? 'page' : undefined}
						>
							{text}
						</a>
					{/each}
					<div class="my-4 border-t border-slate-200"></div>
					{#each [{ href: '/about', text: 'Giới thiệu' }, { href: '/news', text: 'Tin tức' }, { href: '/events', text: 'Sự kiện nổi bật' }, { href: '/network', text: 'Mạng lưới' }, { href: '/resources', text: 'Tài nguyên' }, { href: '/facilities', text: 'Cơ sở vật chất' }] as { href, text }}
						<a
							{href}
							class="hover:text-cardinal-600 block rounded-md px-3 py-2 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 {page
								.url.pathname === href
								? 'text-cardinal-600 bg-slate-50'
								: ''}"
							aria-current={page.url.pathname === href ? 'page' : undefined}
						>
							{text}
						</a>
					{/each}
					<a
						href="https://student.hust.edu.vn"
						target="_blank"
						rel="noopener noreferrer"
						class="text-cardinal-600 mt-2 block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-slate-50"
						aria-label="Open eHUST in new tab"
					>
						eHUST
					</a>
				</div>
			</nav>
		</div>
	</div>

	<!-- Main Content Area -->
	<main class="mt-32 flex-grow pb-20">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<Breadcrumb />
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-cardinal-100 bg-chalk-50 border-t">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="py-16 lg:py-20">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<!-- Brand Column -->
					<div class="space-y-6">
						<img src="/logo.svg" alt="HUST Research Clubs Network Logo" class="h-12 w-auto" />
						<p class="text-base text-slate-600">
							Trung tâm Sáng tạo và Khởi nghiệp Sinh viên<br />
							Đại học Bách khoa Hà Nội
						</p>
						<div class="flex space-x-4">
							<a
								href={null}
								class="hover:text-cardinal-600 text-slate-500 transition-colors"
								aria-label="Follow us on Facebook"
							>
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
									/>
								</svg>
							</a>
							<a
								href={null}
								class="hover:text-cardinal-600 text-slate-500 transition-colors"
								aria-label="Follow us on Youtube"
							>
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
									/>
								</svg>
							</a>
						</div>
					</div>

					<!-- Quick Links -->
					<div>
						<h3 class="text-cardinal-900 font-sans text-sm font-bold tracking-wide uppercase">
							Liên kết nhanh
						</h3>
						<ul class="mt-6 space-y-3">
							{#each [{ href: '/about', text: 'Giới thiệu' }, { href: '/news', text: 'Tin tức' }, { href: '/events', text: 'Sự kiện' }, { href: '/resources', text: 'Tài nguyên' }] as { href, text }}
								<li>
									<a
										{href}
										class="hover:text-cardinal-600 text-sm text-slate-600 transition-colors"
									>
										{text}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Resources -->
					<div>
						<h3 class="text-cardinal-900 font-sans text-sm font-bold tracking-wide uppercase">
							Tài nguyên
						</h3>
						<ul class="mt-6 space-y-3">
							{#each [{ href: '/resources/facilities', text: 'Cơ sở vật chất' }, { href: '/resources/docs', text: 'Tài liệu' }, { href: '/resources/templates', text: 'Biểu mẫu' }, { href: '/faq', text: 'Câu hỏi thường gặp' }] as { href, text }}
								<li>
									<a
										{href}
										class="hover:text-cardinal-600 text-sm text-slate-600 transition-colors"
									>
										{text}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Contact Info -->
					<div>
						<h3 class="text-cardinal-900 font-sans text-sm font-bold tracking-wide uppercase">
							Liên hệ
						</h3>
						<ul class="mt-6 space-y-4 text-sm text-slate-600">
							<li class="flex items-start">
								<svg
									class="mt-0.5 mr-3 h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<div>
									Phòng 204 - C1<br />
									Đại học Bách khoa Hà Nội<br />
									Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
								</div>
							</li>
							<li class="flex items-center">
								<svg
									class="mr-3 h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<a href="mailto:sv@hust.edu.vn" class="hover:text-cardinal-600 transition-colors">
									sv@hust.edu.vn
								</a>
							</li>
							<li class="flex items-center">
								<svg
									class="mr-3 h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								<a href="tel:02438692122" class="hover:text-cardinal-600 transition-colors">
									(024) 3869 2122
								</a>
							</li>
						</ul>
					</div>
				</div>

				<!-- Bottom Bar -->
				<div class="border-cardinal-100 mt-16 border-t pt-8">
					<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p class="text-sm text-slate-600">
							© 2024 Đại học Bách khoa Hà Nội. All rights reserved.
						</p>
						<div class="flex items-center space-x-4 text-sm text-slate-600">
							<a href="/privacy" class="hover:text-cardinal-600 transition-colors">Privacy Policy</a
							>
							<span class="text-cardinal-200">|</span>
							<a href="/terms" class="hover:text-cardinal-600 transition-colors">Terms of Service</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
