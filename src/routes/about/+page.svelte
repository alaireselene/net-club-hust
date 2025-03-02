<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl">
		<PageHeader
			title="Về chúng tôi"
			subtitle="Thúc đẩy đổi mới sáng tạo và nghiên cứu trong cộng đồng sinh viên Đại học Bách Khoa Hà Nội"
		/>

		<div class="prose max-w-none">
			<section class="mb-12">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
				<p class="text-gray-600 dark:text-gray-300">
					To foster innovation and research excellence among students at Hanoi University of
					Technology through collaborative networks, mentorship, and hands-on research
					opportunities.
				</p>
			</section>

			<section class="mb-12">
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Research Areas</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Artificial Intelligence</h3>
						<p class="text-slate-600">
							Exploring cutting-edge AI technologies and applications in real-world scenarios.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Sustainable Technology</h3>
						<p class="text-slate-600">
							Developing eco-friendly solutions for a sustainable future.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Robotics & Automation</h3>
						<p class="text-slate-600">
							Building next-generation robotics systems and automated solutions.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="text-cardinal-600 mb-2 text-xl font-medium">Digital Innovation</h3>
						<p class="text-slate-600">
							Creating digital solutions that transform traditional processes.
						</p>
					</div>
				</div>
			</section>

			<section class="mb-12">
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Our History</h2>
				<div class="space-y-4">
					<p class="text-slate-600">
						Founded in 2020, the Student Research Clubs Network has grown from a small group of
						enthusiastic engineering students to a vibrant community of innovators and researchers.
					</p>
					<div class="relative">
						<div class="absolute inset-0 flex items-center" aria-hidden="true">
							<div class="w-full border-t border-slate-200"></div>
						</div>
						<div class="relative flex justify-start space-x-8">
							<div class="bg-white pr-4">
								<div class="text-cardinal-600 text-lg font-medium">2020</div>
								<div class="text-sm text-slate-500">
									Network foundation with 3 initial research clubs
								</div>
							</div>
							<div class="bg-white px-4">
								<div class="text-cardinal-600 text-lg font-medium">2022</div>
								<div class="text-sm text-slate-500">Expanded to 8 specialized research groups</div>
							</div>
							<div class="bg-white px-4">
								<div class="text-cardinal-600 text-lg font-medium">2024</div>
								<div class="text-sm text-slate-500">
									Established international research partnerships
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="mb-12">
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Contact Us</h2>
				<div class="bg-chalk-50 rounded-lg p-6">
					<div class="space-y-4">
						<p class="flex items-center text-slate-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-cardinal-500 mr-3 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							1 Dai Co Viet Street, Hai Ba Trung District, Hanoi, Vietnam
						</p>
						<p class="flex items-center text-slate-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-cardinal-500 mr-3 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								></path>
							</svg>
							+84 24 3869 4242
						</p>
						<p class="flex items-center text-slate-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-cardinal-500 mr-3 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
								></path>
								<polyline points="22,6 12,13 2,6"></polyline>
							</svg>
							research.clubs@hust.edu.vn
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
