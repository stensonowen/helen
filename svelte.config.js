import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Empty locally; set to `/<repo>` by CI so the site works under GitHub Pages'
// subdirectory. Used for `paths.base` and to recognise document URLs below.
const base = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.

        adapter: adapter({
            pages: 'build',
            assets: 'build',
            // GitHub Pages serves this file for any URL it doesn't recognise, which
            // is how `src/routes/+error.svelte` becomes the site's 404 page.
            fallback: '404.html',
            precompress: false,
            strict: true
        }),
        paths: {
            base
        },
        prerender: {
            // Defaults everywhere: `handleHttpError` and `handleMissingId` both
            // fail the build, which is what catches a typo in a route name or in
            // a Contents section id. The document links are covered too, because
            // scripts/file-tree.mjs rejects any name containing a character the
            // crawler would misread.
        }
    }
};

export default config;
