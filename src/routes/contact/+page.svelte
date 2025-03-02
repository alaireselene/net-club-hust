<script lang="ts">
	import { LucidePhone, LucideMapPin, LucideMail, LucideGlobe } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Contact Us - Student Research Clubs Network</title>
	<meta
		name="description"
		content="Get in touch with the Student Research Clubs Network at Hanoi University of Technology"
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
		<!-- Contact Information -->
		<div class="space-y-8">
			<div>
				<h1 class="mb-6 text-3xl font-bold text-gray-900">Contact Us</h1>
				<p class="mb-8 text-lg text-gray-600">
					Have questions about our research clubs or want to get involved? We'd love to hear from
					you.
				</p>
			</div>

			<div class="space-y-6">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<LucideMapPin class="h-6 w-6 text-teal-600" />
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Address</h3>
						<p class="mt-1 text-gray-600">
							No. 1 Dai Co Viet Road, Hai Ba Trung District, Hanoi, Vietnam
						</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<LucidePhone class="h-6 w-6 text-teal-600" />
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Phone</h3>
						<p class="mt-1 text-gray-600">+84 24 3869 4242</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<LucideMail class="h-6 w-6 text-teal-600" />
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Email</h3>
						<p class="mt-1 text-gray-600">research.clubs@hust.edu.vn</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<LucideGlobe class="h-6 w-6 text-teal-600" />
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Office Hours</h3>
						<p class="mt-1 text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
						<p class="text-gray-600">Saturday: 8:00 AM - 12:00 PM</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Contact Form -->
		<div class="rounded-lg bg-white p-8 shadow-lg">
			<form class="space-y-6">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
					<input
						type="text"
						name="name"
						id="name"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
					/>
				</div>

				<div>
					<label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
					<input
						type="text"
						name="subject"
						id="subject"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
					/>
				</div>

				<div>
					<label for="message" class="block text-sm font-medium text-gray-700">Message</label>
					<textarea
						name="message"
						id="message"
						rows="4"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
					></textarea>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
					>
						Send Message
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
