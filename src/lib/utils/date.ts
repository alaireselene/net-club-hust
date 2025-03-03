export function formatDate(date: number | Date): string {
	const timestamp = date instanceof Date ? date.getTime() : date;
	return new Date(timestamp).toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function formatDatetime(timestamp: number): string {
	const date = new Date(timestamp);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export function formatTime(timestamp: number): string {
	return new Date(timestamp).toLocaleTimeString('vi-VN', {
		hour: '2-digit',
		minute: '2-digit'
	});
}
