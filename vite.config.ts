import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	server: {
		port: 3000,
		hmr: {
			clientPort: 3000
		}
	}
});
