<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';

	type ClubId = 101 | 102 | 201 | 301 | 302;
	type Club = {
		id: ClubId;
		name: string;
		description: string;
		members: number;
		schoolName: string;
		schoolShortName: string;
		leadFaculty: string;
		established: string;
		meetingSchedule: string;
		location: string;
		activities: string[];
	};

	// Mock data - in real app this would come from the server
	const clubsData: Record<ClubId, Club> = {
		101: {
			id: 101,
			name: 'Data Science Club',
			description: 'Exploring data analytics and machine learning',
			members: 45,
			schoolName: 'School of Information and Communication Technology',
			schoolShortName: 'SOICT',
			leadFaculty: 'Dr. John Smith',
			established: '2022',
			meetingSchedule: 'Every Tuesday, 3:00 PM',
			location: 'Room 305, Building B1',
			activities: [
				'Weekly workshops on ML algorithms',
				'Monthly hackathons',
				'Industry collaboration projects'
			]
		},
		102: {
			id: 102,
			name: 'Web Development Hub',
			description: 'Building modern web applications',
			members: 38,
			schoolName: 'School of Information and Communication Technology',
			schoolShortName: 'SOICT',
			leadFaculty: 'Dr. Jane Doe',
			established: '2021',
			meetingSchedule: 'Every Wednesday, 2:00 PM',
			location: 'Room 405, Building B1',
			activities: [
				'Frontend development workshops',
				'Open source contributions',
				'Web accessibility training'
			]
		},
		201: {
			id: 201,
			name: 'Green Chemistry Club',
			description: 'Sustainable chemical processes research',
			members: 32,
			schoolName: 'School of Chemical Engineering',
			schoolShortName: 'SCE',
			leadFaculty: 'Dr. Maria Garcia',
			established: '2023',
			meetingSchedule: 'Every Monday, 4:00 PM',
			location: 'Lab 2, Building C3',
			activities: [
				'Eco-friendly synthesis research',
				'Environmental impact studies',
				'Green tech workshops'
			]
		},
		301: {
			id: 301,
			name: 'Robotics Research Club',
			description: 'Advanced robotics and automation',
			members: 50,
			schoolName: 'School of Mechanical Engineering',
			schoolShortName: 'SME',
			leadFaculty: 'Dr. Robert Chen',
			established: '2020',
			meetingSchedule: 'Every Thursday, 3:30 PM',
			location: 'Robotics Lab, Building A2',
			activities: [
				'Robot design and programming',
				'AI integration projects',
				'Automation competitions'
			]
		},
		302: {
			id: 302,
			name: 'CAD/CAM Innovation',
			description: 'Digital manufacturing technologies',
			members: 28,
			schoolName: 'School of Mechanical Engineering',
			schoolShortName: 'SME',
			leadFaculty: 'Dr. Sarah Johnson',
			established: '2021',
			meetingSchedule: 'Every Friday, 2:30 PM',
			location: 'CAD Lab, Building A2',
			activities: [
				'3D modeling workshops',
				'Manufacturing process optimization',
				'Industry 4.0 projects'
			]
		}
	};

	$: clubId = parseInt($page.params.club_id) as ClubId;
	$: club = clubsData[clubId];
</script>

{#if club}
	<PageHeader title={club.name} />

	<div class="container mx-auto px-4 py-8">
		<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
			<!-- School badge -->
			<div class="mb-6">
				<span
					class="rounded bg-teal-100 px-2 py-1 font-mono text-sm text-teal-800 dark:bg-teal-900 dark:text-teal-100"
				>
					{club.schoolShortName}
				</span>
				<span class="ml-2 text-gray-600 dark:text-gray-300">
					{club.schoolName}
				</span>
			</div>

			<!-- Club info -->
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<p class="mb-4 text-lg text-gray-600 dark:text-gray-300">
						{club.description}
					</p>

					<div class="space-y-3">
						<div class="flex items-center text-gray-600 dark:text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<circle cx="12" cy="10" r="3" />
								<path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
							</svg>
							<span>{club.members} members</span>
						</div>

						<div class="flex items-center text-gray-600 dark:text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
							<span>Established {club.established}</span>
						</div>

						<div class="flex items-center text-gray-600 dark:text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							<span>{club.location}</span>
						</div>

						<div class="flex items-center text-gray-600 dark:text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M12 8v4l3 3" />
								<circle cx="12" cy="12" r="10" />
							</svg>
							<span>{club.meetingSchedule}</span>
						</div>

						<div class="flex items-center text-gray-600 dark:text-gray-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>Lead Faculty: {club.leadFaculty}</span>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
					<h3 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
						Activities & Focus Areas
					</h3>
					<ul class="space-y-3">
						{#each club.activities as activity}
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mt-0.5 mr-2 h-5 w-5 text-teal-500 dark:text-teal-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
								<span class="text-gray-600 dark:text-gray-300">{activity}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{:else}
	<PageHeader title="Club Not Found" />
	<div class="container mx-auto px-4 py-8">
		<div class="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
			The requested club could not be found.
		</div>
	</div>
{/if}
