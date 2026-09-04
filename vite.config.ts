import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	// Vite rejects requests whose Host header it does not recognise, so reaching
	// `npm run preview -- --host` from another machine by hostname needs that
	// name listed here. Local-network names only; this has no effect on the
	// deployed site, which is served by GitHub Pages.
	preview: {
		allowedHosts: ['media']
	}
});
