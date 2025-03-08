<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { Club, School } from '$lib/server/db/schema';
	import {
		Calendar,
		ChevronDownIcon,
		Mail,
		SearchIcon,
		MenuIcon,
		MapPin,
		Phone,
		Facebook,
		Youtube
	} from 'lucide-svelte';

	let mobileMenuOpen = $state(false);
	let currentLang = $state('VI');

	let { data, children } = $props();
	const { schools, clubs } = data;

	// Group clubs by schoolId for efficient lookup
	const clubsBySchool = clubs.reduce<Record<number, Club[]>>((acc, club) => {
		const schoolId = club.schoolId;
		if (schoolId) {
			if (!acc[schoolId]) {
				acc[schoolId] = [];
			}
			acc[schoolId].push(club);
		}
		return acc;
	}, {});

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
</script>

<div
	class="bg-chalk-100 flex min-h-screen flex-col font-sans"
	class:overflow-hidden={mobileMenuOpen}
>
	<!-- Primary Navigation -->
	<header class="bg-cardinal-700 fixed top-0 z-50 w-full shadow-md transition-shadow duration-200">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-20 items-center justify-between">
				<!-- Logo and Text -->
				<a href="/">
					<div class="flex items-center space-x-4">
						<img src="/hust-logo.png" alt="HUST Logo" class="h-16 w-auto" />
						<img src="/logo.svg" alt="HUST Research Clubs Network Logo" class="h-16 w-auto" />
						<div class="hidden sm:block">
							<p class="text-chalk-100 font-sans text-sm font-medium">
								Trung tâm Sáng tạo và Khởi nghiệp Sinh viên
							</p>
							<p class="text-chalk-100 font-sans text-lg font-bold uppercase">
								Mạng lưới CLB sinh viên nghiên cứu khoa học
							</p>
						</div>
					</div></a
				>

				<!-- Primary Nav Items -->
				<div class="hidden items-center space-x-6 md:flex">
					<a
						href="/calendar"
						class="group focus:ring-chalk-100 text-chalk-100 flex items-center transition-colors hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Lịch công tác"
					>
						<span class="flex items-center">
							<Calendar color="currentColor" class="h-5 w-5" />
							Lịch công tác
						</span>
					</a>
					<a
						href="/contact"
						class="group focus:ring-chalk-600 text-chalk-100 flex items-center transition-colors hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Liên hệ"
					>
						<span class="flex items-center">
							<Mail color="currentColor" class="h-5 w-5" />
							Liên hệ
						</span>
					</a>
					<button
						class="focus:ring-cardinal-600 text-chalk-100 transition-colors hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Tìm kiếm"
					>
						<SearchIcon color="currentColor" class="h-5 w-5" />
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
				</button>
			</div>
		</div>
	</header>

	<!-- Secondary Navigation -->
	<nav class="border-cardinal-100 bg-chalk-50 fixed top-20 z-40 w-full border-y shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="hidden h-14 items-center justify-between md:flex">
				<div class="flex flex-1 items-center justify-between space-x-8">
					<!-- About Dropdown -->
					<div class="group relative">
						<button
							class="hover:text-cardinal-600 focus:ring-cardinal-600 flex items-center font-medium text-slate-700 uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {page.url.pathname.startsWith(
								'/about'
							)
								? 'text-cardinal-600 font-bold'
								: ''}"
							aria-haspopup="true"
						>
							<span>Giới thiệu</span>
							<ChevronDownIcon color="currentColor" class="ml-1 h-4 w-4" />
						</button>
						<div
							class="invisible absolute left-0 z-50 mt-2 w-48 transform opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
						>
							<div class="ring-opacity-5 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black">
								<a
									href="/about"
									class="hover:text-cardinal-600 block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									Tổng quan
								</a>
								<a
									href="/about/structure"
									class="hover:text-cardinal-600 block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									Cơ cấu tổ chức
								</a>
							</div>
						</div>
					</div>

					{#each [{ href: '/news', text: 'Tin tức' }, { href: '/events', text: 'Sự kiện nổi bật' }] as { href, text }}
						<a
							{href}
							class="hover:text-cardinal-600 focus:ring-cardinal-600 text-slate-700 uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {page
								.url.pathname === href
								? 'text-cardinal-600 font-bold'
								: 'font-medium'}"
							aria-current={page.url.pathname === href ? 'page' : undefined}
						>
							{text}
						</a>
					{/each}

					<!-- Network Dropdown -->
					<div class="group relative">
						<button
							class="hover:text-cardinal-600 focus:ring-cardinal-600 flex items-center font-medium text-slate-700 uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {page.url.pathname.startsWith(
								'/network'
							)
								? 'text-cardinal-600 font-bold'
								: ''}"
							aria-haspopup="true"
						>
							<span>Mạng lưới</span>
							<ChevronDownIcon color="currentColor" class="ml-1 h-4 w-4" />
						</button>
						<!-- Schools Dropdown Menu -->
						<div
							class="invisible absolute left-0 z-50 mt-2 w-64 transform opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
						>
							<div class="ring-opacity-5 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black">
								{#each schools as school}
									<div class="group/school relative px-4 py-2 hover:bg-slate-50">
										<a
											href="/network?school={school.slug.toUpperCase()}"
											class="flex items-center justify-between"
										>
											<span class="text-sm text-slate-700">{school.name}</span>
											<span
												class="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
												>{school.slug.toUpperCase()}</span
											>
										</a>
										<!-- Clubs Submenu -->
										<div
											class="invisible absolute top-0 left-full ml-2 w-64 transform opacity-0 transition-all duration-200 group-hover/school:visible group-hover/school:opacity-100"
										>
											<div
												class="ring-opacity-5 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black"
											>
												{#each clubsBySchool[school.id] || [] as club}
													<a
														href="/network/{club.slug}"
														class="hover:text-cardinal-600 block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
													>
														{club.name}
													</a>
												{/each}
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					{#each [{ href: '/research', text: 'Đề tài SVNCKH' }, { href: '/partnerships', text: 'Hợp tác Đối ngoại' }, { href: '/resources', text: 'Tài nguyên' }, { href: '/facilities', text: 'Cơ sở vật chất' }] as { href, text }}
						<a
							{href}
							class="hover:text-cardinal-600 focus:ring-cardinal-600 font-medium text-slate-700 uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {page
								.url.pathname === href
								? 'text-cardinal-600 font-bold'
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
		<div
			class="bg-opacity-75 absolute inset-0 bg-slate-600 transition-opacity"
			onclick={toggleMobileMenu}
			aria-hidden="true"
		></div>
		<div
			class="absolute right-0 h-full w-64 transform overflow-y-auto bg-white shadow-xl transition-transform"
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
					<MenuIcon class="h-6 w-6" />
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

					<!-- About Section -->
					<div class="mb-2">
						<div class="px-3 py-2 text-base font-medium text-slate-700">Giới thiệu</div>
						<div class="ml-4">
							<a
								href="/about"
								class="hover:text-cardinal-600 block py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 {page
									.url.pathname === '/about'
									? 'text-cardinal-600 bg-slate-50'
									: ''}"
							>
								Tổng quan
							</a>
							<a
								href="/about/structure"
								class="hover:text-cardinal-600 block py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 {page
									.url.pathname === '/about/structure'
									? 'text-cardinal-600 bg-slate-50'
									: ''}"
							>
								Cơ cấu tổ chức
							</a>
						</div>
					</div>

					{#each [{ href: '/research', text: 'Nghiên cứu' }, { href: '/partnerships', text: 'Đối tác' }, { href: '/resources', text: 'Tài nguyên' }, { href: '/facilities', text: 'Cơ sở vật chất' }] as { href, text }}
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

					<!-- Network Section in Mobile Menu -->
					<div class="my-2">
						<div class="px-3 py-2 text-base font-medium text-slate-700">Mạng lưới</div>
						{#each schools as school}
							<div class="mb-3 ml-4">
								<a
									href="/network?school={school.slug.toUpperCase()}"
									class="hover:text-cardinal-600 block py-2 text-sm font-medium text-slate-600"
								>
									{school.name}
									<span
										class="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
									>
										{school.slug.toUpperCase()}
									</span>
								</a>
								<div class="ml-4">
									{#each clubsBySchool[school.id] || [] as club}
										<a
											href="/network/{club.slug}"
											class="hover:text-cardinal-600 block py-1.5 text-sm text-slate-600"
										>
											{club.name}
										</a>
									{/each}
								</div>
							</div>
						{/each}
					</div>

					{#each [{ href: '/research', text: 'Sinh viên NCKH' }, { href: '/resources', text: 'Tài nguyên' }, { href: '/facilities', text: 'Cơ sở vật chất' }] as { href, text }}
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
						<img src="/logo.svg" alt="HUST Research Clubs Network Logo" class="h-30 w-auto" />
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
								<Facebook class="h-6 w-6" />
							</a>
							<a
								href={null}
								class="hover:text-cardinal-600 text-slate-500 transition-colors"
								aria-label="Follow us on Youtube"
							>
								<Youtube class="h-6 w-6" />
							</a>
						</div>
					</div>

					<!-- Quick Links -->
					<div>
						<h3 class="text-cardinal-900 font-sans text-sm font-bold tracking-wide uppercase">
							Liên kết nhanh
						</h3>
						<ul class="mt-6 space-y-3">
							{#each [{ href: '/about', text: 'Giới thiệu' }, { href: '/news', text: 'Tin tức' }, { href: '/events', text: 'Sự kiện' }, { href: '/research', text: 'NSinh viên NCKH' }, { href: '/resources', text: 'Tài nguyên' }] as { href, text }}
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
								<MapPin class="mr-3 h-5 w-5 text-slate-400" />
								<div>
									Phòng 204 - C1<br />
									Đại học Bách khoa Hà Nội<br />
									Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
								</div>
							</li>
							<li class="flex items-center">
								<Mail class="mr-3 h-5 w-5 text-slate-400" />
								<a href="mailto:sv@hust.edu.vn" class="hover:text-cardinal-600 transition-colors">
									sv@hust.edu.vn
								</a>
							</li>
							<li class="flex items-center">
								<Phone class="mr-3 h-5 w-5 text-slate-400" />
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
							© {new Date().getFullYear()} Đại học Bách khoa Hà Nội. Bảo lưu mọi quyền.
						</p>
						<div class="flex items-center space-x-4 text-sm text-slate-600">
							<a href="/privacy" class="hover:text-cardinal-600 transition-colors"
								>Chính sách bảo mật</a
							>
							<span class="text-cardinal-200">|</span>
							<a href="/terms" class="hover:text-cardinal-600 transition-colors"
								>Điều khoản dịch vụ</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
