<script lang="ts">
	import PartnerCard from '$lib/components/PartnerCard.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import * as topojson from 'topojson-client';
	import { Globe2 } from 'lucide-svelte';

	interface Partner {
		logo: string;
		name: string;
		description: string;
		website: string;
		type: 'academic' | 'business';
		details: {
			region?: string;
			industry?: string;
			cooperationType?: string;
			internshipInfo?: string;
			coordinates: [number, number];
		};
	}

	const academicPartners: Partner[] = [
		{
			logo: 'https://brand.mit.edu/sites/default/files/styles/tile_narrow/public/2023-08/logo-colors-BG-mit-red.png?itok=Dk9W1mWh',
			name: 'Massachusetts Institute of Technology',
			description: 'Hợp tác nghiên cứu trong lĩnh vực công nghệ và đổi mới sáng tạo',
			website: 'https://www.mit.edu',
			type: 'academic',
			details: {
				region: 'Quốc tế',
				coordinates: [42.3601, -71.0942]
			}
		},
		{
			logo: 'https://logowik.com/content/uploads/images/tokyo-institute-of-technology-logo7969.logowik.com.webp',
			name: 'Tokyo Institute of Technology',
			description: 'Trao đổi sinh viên và nghiên cứu chung về khoa học vật liệu',
			website: 'https://www.titech.ac.jp/english',
			type: 'academic',
			details: {
				region: 'Quốc tế',
				coordinates: [35.6062, 139.6829]
			}
		},
		{
			logo: 'https://vnu.edu.vn/home/images/logo.png',
			name: 'Đại học Quốc gia Hà Nội',
			description: 'Hợp tác đào tạo và nghiên cứu trong nhiều lĩnh vực',
			website: 'https://vnu.edu.vn',
			type: 'academic',
			details: {
				region: 'Trong nước',
				coordinates: [21.0285, 105.8542]
			}
		}
	];

	const businessPartners: Partner[] = [
		{
			logo: 'https://viettel.com.vn/media/viettel/original_images/logo-color2.png',
			name: 'Tập đoàn Viettel',
			description: 'Hợp tác nghiên cứu và phát triển công nghệ 5G',
			website: 'https://viettel.com.vn',
			type: 'business',
			details: {
				industry: 'Công nghệ',
				cooperationType: 'R&D, Tuyển dụng',
				internshipInfo: 'Chương trình thực tập sinh hàng năm',
				coordinates: [21.0245, 105.8412]
			}
		},
		{
			logo: 'https://fpt.com/-/media/project/fpt-corporation/fpt/common/images/navigation/logo/fpt-logo.svg',
			name: 'FPT Corporation',
			description: 'Đối tác chiến lược trong đào tạo và chuyển giao công nghệ',
			website: 'https://fpt.com.vn',
			type: 'business',
			details: {
				industry: 'Công nghệ',
				cooperationType: 'Đào tạo, Tuyển dụng',
				internshipInfo: 'Thực tập sinh Full-stack Developer',
				coordinates: [21.0138, 105.8166]
			}
		},
		{
			logo: 'https://ashui.com/awards/wp-content/uploads/2015/08/Vingroup-720x405.jpg',
			name: 'Tập đoàn Vingroup',
			description: 'Hợp tác trong lĩnh vực nghiên cứu và phát triển xe điện',
			website: 'https://vingroup.net',
			type: 'business',
			details: {
				industry: 'Sản xuất',
				cooperationType: 'R&D, Tài trợ',
				internshipInfo: 'Chương trình Engineer Trainee',
				coordinates: [21.0259, 105.8241]
			}
		}
	];

	let selectedType = 'all';
	let selectedRegion = 'all';
	let selectedIndustry = 'all';
	let mapContainer: HTMLDivElement;

	$: filteredAcademicPartners = academicPartners.filter((partner) => {
		if (selectedType !== 'all' && selectedType !== 'academic') return false;
		if (selectedRegion !== 'all' && selectedRegion !== partner.details.region) return false;
		return true;
	});

	$: filteredBusinessPartners = businessPartners.filter((partner) => {
		if (selectedType !== 'all' && selectedType !== 'business') return false;
		if (selectedIndustry !== 'all' && selectedIndustry !== partner.details.industry) return false;
		return true;
	});

	onMount(async () => {
		if (!mapContainer) return;

		const width = mapContainer.clientWidth;
		const height = 400;

		const response = await fetch('https://unpkg.com/world-atlas/countries-50m.json');
		const world = await response.json();

		const svg = d3.select(mapContainer).append('svg').attr('width', width).attr('height', height);

		const projection = d3
			.geoMercator()
			.scale(width / 2 / Math.PI)
			.translate([width / 2, height / 2]);

		const geoPath = d3.geoPath().projection(projection);

		// Handle TopoJSON conversion
		const worldData = topojson.feature(world, world.objects.countries as any);
		const countries = Array.isArray(worldData) ? worldData : (worldData as any).features || [];

		svg
			.append('g')
			.selectAll('path')
			.data(countries)
			.join('path')
			.attr('d', geoPath as any)
			.attr('fill', '#e5e7eb')
			.attr('stroke', '#d1d5db')
			.attr('stroke-width', 0.5);

		const allPartners = [...academicPartners, ...businessPartners];

		// Add partner locations
		svg
			.selectAll('circle')
			.data(allPartners)
			.join('circle')
			.attr('cx', (d) => {
				const coords = projection([d.details.coordinates[1], d.details.coordinates[0]]);
				return coords ? coords[0] : 0;
			})
			.attr('cy', (d) => {
				const coords = projection([d.details.coordinates[1], d.details.coordinates[0]]);
				return coords ? coords[1] : 0;
			})
			.attr('r', 6)
			.attr('fill', (d) => (d.type === 'academic' ? '#0ea5e9' : '#14b8a6'))
			.attr('stroke', '#ffffff')
			.attr('stroke-width', 1.5)
			.attr('opacity', 0.8)
			.append('title')
			.text((d) => d.name);
	});
</script>

<PageHeader title="Hợp tác - Đối ngoại" subtitle="Quan hệ hợp tác quốc tế và doanh nghiệp" />

<div class="container mx-auto px-4 py-8">
	<!-- Interactive Map -->
	<div class="mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
		<div class="mb-4 flex items-center gap-2">
			<Globe2 class="h-6 w-6 text-teal-500" />
			<h2 class="text-xl font-semibold">Mạng lưới đối tác toàn cầu</h2>
		</div>
		<div class="relative">
			<div bind:this={mapContainer} class="h-[400px] w-full"></div>
			<div
				class="absolute right-4 bottom-4 flex gap-4 rounded-lg bg-white/90 p-2 text-sm dark:bg-gray-800/90"
			>
				<div class="flex items-center gap-2">
					<span class="h-3 w-3 rounded-full bg-[#0ea5e9]"></span>
					<span>Đối tác học thuật</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="h-3 w-3 rounded-full bg-[#14b8a6]"></span>
					<span>Đối tác doanh nghiệp</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mb-8 grid gap-4 md:grid-cols-3">
		<select
			bind:value={selectedType}
			class="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
		>
			<option value="all">Tất cả đối tác</option>
			<option value="academic">Đối tác học thuật</option>
			<option value="business">Đối tác doanh nghiệp</option>
		</select>

		{#if selectedType !== 'business'}
			<select
				bind:value={selectedRegion}
				class="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
			>
				<option value="all">Tất cả khu vực</option>
				<option value="Quốc tế">Quốc tế</option>
				<option value="Trong nước">Trong nước</option>
			</select>
		{/if}

		{#if selectedType !== 'academic'}
			<select
				bind:value={selectedIndustry}
				class="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
			>
				<option value="all">Tất cả ngành nghề</option>
				<option value="Công nghệ">Công nghệ</option>
				<option value="Sản xuất">Sản xuất</option>
				<option value="Tài chính">Tài chính</option>
			</select>
		{/if}
	</div>

	<!-- Academic Partners -->
	{#if selectedType !== 'business' && filteredAcademicPartners.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">Liên kết học thuật</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredAcademicPartners as partner}
					<PartnerCard {...partner} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Business Partners -->
	{#if selectedType !== 'academic' && filteredBusinessPartners.length > 0}
		<section>
			<h2 class="mb-6 text-2xl font-bold">Đối tác doanh nghiệp</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredBusinessPartners as partner}
					<PartnerCard {...partner} />
				{/each}
			</div>
		</section>
	{/if}
</div>
