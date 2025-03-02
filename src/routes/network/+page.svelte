<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	interface NodeInfo {
		name: string;
		leader: string;
		advisors: string[];
		members: number;
		description: string;
	}

	interface CustomNode extends d3.SimulationNodeDatum {
		id: string;
		group: number; // 1: School of ICT, 2: School of Mathematics, 3: Others
		school: string;
		info: NodeInfo;
		x?: number;
		y?: number;
	}

	interface CustomLink extends d3.SimulationLinkDatum<CustomNode> {
		value: number;
		source: CustomNode | string;
		target: CustomNode | string;
	}

	let svgContainer: SVGSVGElement;
	let selectedNode: CustomNode | null = null;
	let width = 800;
	let height = 600;

	const nodes: CustomNode[] = [
		// Khoa Toán - Tin
		{
			id: 'MathClubA',
			group: 2,
			school: 'Khoa Toán - Tin',
			info: {
				name: 'CLB Toán học',
				leader: 'Nguyễn Văn A',
				advisors: ['TS. Trần Minh Triết', 'ThS. Lê Thu Hà'],
				members: 45,
				description: 'Câu lạc bộ nghiên cứu về toán học ứng dụng và khoa học dữ liệu'
			}
		},
		{
			id: 'MathClubB',
			group: 2,
			school: 'Khoa Toán - Tin',
			info: {
				name: 'CLB Tin học',
				leader: 'Trần Thị B',
				advisors: ['PGS.TS. Phạm Đức Thắng'],
				members: 38,
				description: 'Câu lạc bộ chuyên về lập trình và giải thuật'
			}
		},

		// Trường CNTT & TT
		{
			id: 'GDGoC',
			group: 1,
			school: 'Trường CNTT & TT',
			info: {
				name: 'GDGoC - HUST',
				leader: 'Lê Văn C',
				advisors: ['TS. Nguyễn Quốc Bình', 'ThS. Lê Thanh Tùng'],
				members: 42,
				description: 'Game Development Club of HUST, phát triển game và ứng dụng đa phương tiện'
			}
		},
		{
			id: 'BKAI',
			group: 1,
			school: 'Trường CNTT & TT',
			info: {
				name: 'BKAI Lab',
				leader: 'Phạm Thị D',
				advisors: ['GS.TS. Hoàng Xuân Huấn', 'TS. Nguyễn Thị Phương'],
				members: 50,
				description: 'Phòng thí nghiệm về AI và học máy của Trường CNTT & TT'
			}
		},

		// Khác
		{
			id: 'BKE',
			group: 3,
			school: 'Khác',
			info: {
				name: 'Trung tâm Sáng tạo và Khởi nghiệp Sinh viên',
				leader: 'TS. Trương Công Tuấn',
				advisors: ['PGS.TS. Lương Xuân Điển', 'Phạm Hoài Anh'],
				members: 15,
				description: 'Trung tâm Đổi mới Sáng tạo và Khởi nghiệp Sinh viên'
			}
		}
	];

	const links: CustomLink[] = [
		{ source: 'BKE', target: 'MathClubB', value: 1 },
		{ source: 'BKE', target: 'BKAI', value: 1 },
		{ source: 'BKE', target: 'GDGoC', value: 1 },
		{ source: 'BKE', target: 'MathClubA', value: 1 }
	];

	onMount(() => {
		const svg = d3
			.select(svgContainer)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('class', 'bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg');

		const zoomToFit = () => {
			const bounds = {
				minX: Infinity,
				minY: Infinity,
				maxX: -Infinity,
				maxY: -Infinity
			};

			// Calculate bounds
			nodes.forEach((node) => {
				if (node.x && node.y) {
					bounds.minX = Math.min(bounds.minX, node.x);
					bounds.minY = Math.min(bounds.minY, node.y);
					bounds.maxX = Math.max(bounds.maxX, node.x);
					bounds.maxY = Math.max(bounds.maxY, node.y);
				}
			});

			// Add padding
			const padding = 40;
			const dx = bounds.maxX - bounds.minX;
			const dy = bounds.maxY - bounds.minY;
			const x = (bounds.minX + bounds.maxX) / 2;
			const y = (bounds.minY + bounds.maxY) / 2;

			// Calculate scale to fit
			const scale = 0.6 / Math.max(dx / width, dy / height);

			svg
				.transition()
				.duration(750)
				.call(
					zoom.transform,
					d3.zoomIdentity
						.translate(width / 2, height / 2)
						.scale(scale)
						.translate(-x, -y)
				);
		};

		const simulation = d3
			.forceSimulation<CustomNode>(nodes)
			.force(
				'link',
				d3.forceLink<CustomNode, CustomLink>(links).id((d) => d.id)
			)
			.force('charge', d3.forceManyBody().strength(-400))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force(
				'x',
				d3
					.forceX<CustomNode>()
					.strength(0.1)
					.x((d) => {
						switch (d.group) {
							case 1:
								return width * 0.3;
							case 2:
								return width * 0.7;
							default:
								return width * 0.5;
						}
					})
			)
			.force(
				'y',
				d3
					.forceY<CustomNode>()
					.strength(0.1)
					.y((d) => {
						switch (d.group) {
							case 1:
								return height * 0.3;
							case 2:
								return height * 0.3;
							default:
								return height * 0.7;
						}
					})
			);

		const defs = svg.append('defs');
		const pattern = defs
			.append('pattern')
			.attr('id', 'vietnamesePattern')
			.attr('width', 20)
			.attr('height', 20)
			.attr('patternUnits', 'userSpaceOnUse');

		pattern
			.append('path')
			.attr('d', 'M0,10 L20,10 M10,0 L10,20')
			.attr('stroke', 'rgba(220, 38, 38, 0.1)')
			.attr('stroke-width', 1);

		svg
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'url(#vietnamesePattern)');

		const link = svg
			.append('g')
			.attr('class', 'links')
			.selectAll<SVGLineElement, CustomLink>('line')
			.data(links)
			.join('line')
			.attr('stroke', '#64748b')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', (d) => Math.sqrt(d.value));

		const dragBehavior = drag(simulation);

		const nodeGroup = svg
			.append('g')
			.attr('class', 'nodes')
			.selectAll<SVGGElement, CustomNode>('g')
			.data(nodes)
			.join('g')
			.call((selection) => {
				(dragBehavior as any)(selection);
			})
			.on('click', (_event, d: CustomNode) => {
				handleNodeClick(d);
			});

		const getNodeColor = (d: CustomNode) => {
			switch (d.group) {
				case 1:
					return '#0ea5e9';
				case 2:
					return '#10b981';
				default:
					return '#6366f1';
			}
		};

		const circles = nodeGroup
			.append('circle')
			.attr('r', 8)
			.attr('fill', getNodeColor)
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)
			.on('mouseover', function () {
				d3.select(this).transition().duration(200).attr('r', 12);
			})
			.on('mouseout', function (event, d: CustomNode) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('r', selectedNode && (d.id === selectedNode.id || isConnectedNode(d)) ? 10 : 8);
			});

		const labels = nodeGroup
			.append('text')
			.text((d) => {
				const name = d.info.name;
				// For clubs, take the first part before "-" or limit to 15 chars
				return name.includes('-') ? name.split('-')[0].trim() : name.slice(0, 15);
			})
			.attr('x', 12)
			.attr('y', 4)
			.attr('class', 'text-sm fill-slate-700 dark:fill-slate-300')
			.style('font-size', '10px')
			.style('pointer-events', 'none');

		function handleNodeClick(node: CustomNode) {
			selectedNode = node;

			circles.attr('r', 8).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.5);
			link.attr('stroke-opacity', 0.2);
			labels.attr('opacity', 0.5);

			circles
				.filter((d: CustomNode) => d.id === node.id || isConnectedNode(d))
				.attr('r', 10)
				.attr('fill-opacity', 1)
				.attr('stroke-opacity', 1);

			link
				.filter((d: CustomLink) => d.source === node || d.target === node)
				.attr('stroke-opacity', 1);

			labels.filter((d: CustomNode) => d.id === node.id || isConnectedNode(d)).attr('opacity', 1);

			const transform = d3.zoomTransform(svg.node()!);
			const scale = transform.k;
			const x = width / 2 - (node.x || 0) * scale;
			const y = height / 2 - (node.y || 0) * scale;

			svg
				.transition()
				.duration(750)
				.call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
		}

		function isConnectedNode(node: CustomNode): boolean {
			if (!selectedNode) return false;
			return links.some(
				(link) =>
					(link.source === selectedNode && link.target === node) ||
					(link.target === selectedNode && link.source === node)
			);
		}

		simulation
			.on('tick', () => {
				link
					.attr('x1', (d) => (d.source as CustomNode).x!)
					.attr('y1', (d) => (d.source as CustomNode).y!)
					.attr('x2', (d) => (d.target as CustomNode).x!)
					.attr('y2', (d) => (d.target as CustomNode).y!);

				nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
			})
			.on('end', zoomToFit);

		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.2, 3])
			.on('zoom', (event) => {
				svg.selectAll('.nodes, .links').attr('transform', event.transform);
			});

		svg.call(zoom);
	});

	function drag(simulation: d3.Simulation<CustomNode, undefined>) {
		function dragstarted(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		return d3
			.drag<SVGGElement, CustomNode>()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	}
</script>

<div class="p-6">
	<h1 class="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
		Mạng lưới Câu lạc bộ Nghiên cứu
	</h1>

	<div class="mb-6">
		<p class="text-slate-600 dark:text-slate-300">
			Biểu đồ tương tác thể hiện mối quan hệ giữa các câu lạc bộ nghiên cứu theo khoa và trường.
			Nhấp vào một nút để xem thông tin chi tiết và các kết nối liên quan.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div
			class="relative rounded-lg bg-white p-4 shadow-lg lg:col-span-2 dark:bg-slate-800"
			style="height: 600px;"
		>
			<svg
				bind:this={svgContainer}
				width="100%"
				height="100%"
				class="h-full max-w-full cursor-move"
			/>

			<div
				class="absolute right-4 bottom-4 rounded-lg bg-white/80 p-3 shadow-lg backdrop-blur-sm dark:bg-slate-800/80"
			>
				<h2 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Chú thích</h2>
				<div class="space-y-2">
					<div class="flex items-center">
						<span class="mr-2 h-3 w-3 rounded-full bg-[#0ea5e9]"></span>
						<span class="text-xs text-slate-600 dark:text-slate-300">Trường CNTT & TT</span>
					</div>
					<div class="flex items-center">
						<span class="mr-2 h-3 w-3 rounded-full bg-[#10b981]"></span>
						<span class="text-xs text-slate-600 dark:text-slate-300">Khoa Toán - Tin</span>
					</div>
					<div class="flex items-center">
						<span class="mr-2 h-3 w-3 rounded-full bg-[#6366f1]"></span>
						<span class="text-xs text-slate-600 dark:text-slate-300">Khác</span>
					</div>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
			{#if selectedNode}
				<div class="space-y-6">
					<div class="border-b border-slate-200 pb-4 dark:border-slate-700">
						<div class="mb-2">
							<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
								{selectedNode.school}
							</p>
							<h2 class="text-xl font-semibold text-slate-900 dark:text-white">
								{selectedNode.info.name}
							</h2>
						</div>
						<div class="space-y-3">
							<div>
								<h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">Chủ nhiệm</h3>
								<p class="text-slate-600 dark:text-slate-400">{selectedNode.info.leader}</p>
							</div>

							<div>
								<h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">Ban cố vấn</h3>
								<ul class="list-inside list-disc text-slate-600 dark:text-slate-400">
									{#each selectedNode.info.advisors as advisor}
										<li>{advisor}</li>
									{/each}
								</ul>
							</div>

							<div>
								<h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">
									Số thành viên
								</h3>
								<p class="text-slate-600 dark:text-slate-400">{selectedNode.info.members}</p>
							</div>
						</div>
					</div>

					<div>
						<h3 class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Giới thiệu</h3>
						<p class="leading-relaxed text-slate-600 dark:text-slate-400">
							{selectedNode.info.description}
						</p>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-slate-500 dark:text-slate-400">
					<p>Chọn một nút trên biểu đồ để xem thông tin chi tiết</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.backdrop-blur-sm {
		transition: opacity 0.2s ease-in-out;
	}

	.backdrop-blur-sm:hover {
		opacity: 0.9;
	}
</style>
