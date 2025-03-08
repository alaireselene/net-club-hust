<script lang="ts">
	import PartnerCard from '$lib/components/PartnerCard.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Globe2 } from 'lucide-svelte';
	import * as d3 from 'd3';
	import * as topojson from 'topojson-client';
	import type { Partner } from '$lib/server/db/schema';
	import type { PageData } from './$types';

	interface UIPartner {
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

	function transformPartner(partner: Partner): UIPartner {
		const isAcademic = ['university', 'institute'].includes(partner.type);
		return {
			logo: partner.logoUrl || '',
			name: partner.name,
			description: partner.description,
			website: partner.website || '',
			type: isAcademic ? 'academic' : 'business',
			details: {
				region: isAcademic ? (partner.country === 'Vietnam' ? 'Trong nước' : 'Quốc tế') : undefined,
				industry: !isAcademic ? 'Công nghệ' : undefined,
				coordinates: [partner.latitude, partner.longitude]
			}
		};
	}

	let selectedType = $state('all');
	let selectedRegion = $state('all');
	let selectedIndustry = $state('all');
	let mapContainer: HTMLDivElement;

	let { data } = $props<{ data: PageData & { partners: Partner[] } }>();

	const partners = data.partners.map(transformPartner);
	const academicPartners = partners.filter((p: UIPartner) => p.type === 'academic');
	const businessPartners = partners.filter((p: UIPartner) => p.type === 'business');

	let filteredAcademicPartners = $derived(
		academicPartners.filter((partner: UIPartner) => {
			if (selectedType !== 'all' && selectedType !== 'academic') return false;
			if (selectedRegion !== 'all' && selectedRegion !== partner.details.region) return false;
			return true;
		})
	);

	let filteredBusinessPartners = $derived(
		businessPartners.filter((partner: UIPartner) => {
			if (selectedType !== 'all' && selectedType !== 'business') return false;
			if (selectedIndustry !== 'all' && selectedIndustry !== partner.details.industry) return false;
			return true;
		})
	);

	async function initMap() {
		if (!mapContainer) return;

		const width = mapContainer.clientWidth;
		const height = 400;

		try {
			const response = await fetch('https://unpkg.com/world-atlas/countries-50m.json');
			const world = await response.json();

			const svg = d3.select(mapContainer).append('svg').attr('width', width).attr('height', height);

			const projection = d3
				.geoMercator()
				.scale(width / 2 / Math.PI)
				.translate([width / 2, height / 2]);

			const geoPath = d3.geoPath().projection(projection);

			// Convert TopoJSON to GeoJSON with simple type assertion
			const geoJson = topojson.feature(world as any, (world as any).objects.countries);
			const features = (geoJson as any).features;

			svg
				.append('g')
				.selectAll('path')
				.data(features)
				.join('path')
				.attr('d', geoPath as any)
				.attr('fill', '#e5e7eb')
				.attr('stroke', '#d1d5db')
				.attr('stroke-width', 0.5);

			// Add partner locations
			svg
				.selectAll('circle')
				.data<UIPartner>(partners)
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
		} catch (error) {
			console.error('Error loading map data:', error);
		}
	}

	// Initialize map on mount
	$effect(() => {
		initMap();
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
