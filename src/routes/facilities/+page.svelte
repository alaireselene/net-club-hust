<script lang="ts">
	import { Building2, Users, MapPin } from 'lucide-svelte';

	const facilities = [
		{
			name: 'Phòng họp A101',
			manager: 'ThS. Nguyễn Văn A',
			location: 'Tầng 1, Tòa nhà A, Trường ĐHBK Hà Nội',
			type: 'Phòng họp',
			capacity: '30 người'
		},
		{
			name: 'Phòng Lab B203',
			manager: 'TS. Trần Thị B',
			location: 'Tầng 2, Tòa nhà B, Trường ĐHBK Hà Nội',
			type: 'Phòng thí nghiệm',
			capacity: '20 người'
		},
		{
			name: 'Thiết bị âm thanh',
			manager: 'KS. Lê Văn C',
			location: 'Phòng thiết bị, Tầng 1, Tòa nhà C',
			type: 'Thiết bị',
			capacity: 'Bao gồm: 2 loa, 2 micro không dây, 1 bàn mixer'
		},
		{
			name: 'Máy chiếu',
			manager: 'KS. Phạm Thị D',
			location: 'Phòng thiết bị, Tầng 1, Tòa nhà C',
			type: 'Thiết bị',
			capacity: '2 bộ máy chiếu di động'
		}
	];
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="space-y-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Cơ sở vật chất</h1>
			<p class="mt-4 text-lg text-gray-600">
				Trung tâm ĐMST&KN Sinh viên cung cấp các cơ sở vật chất phục vụ hoạt động nghiên cứu và sinh
				hoạt CLB.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			{#each facilities as facility}
				<div
					class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-colors hover:border-teal-500"
				>
					<div class="space-y-4">
						<div class="flex items-center space-x-2">
							<Building2 class="h-5 w-5 text-teal-600" />
							<h3 class="text-xl font-semibold text-gray-900">{facility.name}</h3>
						</div>

						<div class="space-y-2">
							<div class="flex items-center space-x-2 text-gray-600">
								<Users class="h-4 w-4" />
								<span>{facility.manager}</span>
							</div>

							<div class="flex items-center space-x-2 text-gray-600">
								<MapPin class="h-4 w-4" />
								<span>{facility.location}</span>
							</div>

							<div class="mt-2 text-sm text-gray-500">
								<span class="font-semibold">Loại: </span>{facility.type}<br />
								<span class="font-semibold">Sức chứa/Thông số: </span>{facility.capacity}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
			<h2 class="mb-4 text-2xl font-semibold text-gray-900">Quy trình đăng ký sử dụng</h2>
			<div class="space-y-4 text-gray-600">
				<p class="font-medium">
					Để đăng ký sử dụng cơ sở vật chất, sinh viên cần thực hiện các bước sau:
				</p>
				<ol class="ml-4 list-inside list-decimal space-y-2">
					<li>
						Điền đầy đủ thông tin vào <a
							href="#"
							class="font-medium text-teal-600 hover:text-teal-700"
							>Mẫu đăng ký sử dụng cơ sở vật chất</a
						>
					</li>
					<li>Gửi form đăng ký và đợi phản hồi từ Trung tâm (trong vòng 24h làm việc)</li>
					<li>Sau khi được duyệt, sinh viên sẽ nhận email xác nhận cùng hướng dẫn chi tiết</li>
					<li>Đến đúng giờ và địa điểm đã đăng ký để nhận và sử dụng cơ sở vật chất</li>
				</ol>
				<div class="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm">
					<p class="font-semibold text-yellow-800">Lưu ý:</p>
					<ul class="mt-2 list-inside list-disc space-y-1 text-yellow-700">
						<li>Vui lòng đăng ký trước ít nhất 3 ngày làm việc</li>
						<li>Sử dụng đúng mục đích và thời gian đã đăng ký</li>
						<li>Giữ gìn và bảo quản tài sản theo hướng dẫn</li>
						<li>Báo cáo ngay khi có sự cố xảy ra</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
