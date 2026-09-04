<script lang="ts">
    import { base } from '$app/paths';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import type { Entry } from '$lib/files';

    let { path, entries }: { path: string; entries: Entry[] } = $props();

    // `encodeURI`, not `encodeURIComponent`. SvelteKit's asset manifest stores
    // names raw and resolves a link by running `decodeURI` over it, and
    // `decodeURI` leaves the reserved set (`$&+,/:;=?@#`) escaped -- so a name
    // encoded per component 404s against the file sitting right there, over an
    // apostrophe or a semicolon. `encodeURI` is that function's exact inverse:
    // it escapes spaces and non-ASCII, leaves `'()`, `,`, `;`, `:` and `@`
    // alone, which RFC 3986 allows raw in a path, and leaves `/` alone, so a
    // whole path encodes in one go. The characters it would *not* escape but
    // should -- `#?%&=+` -- cannot occur, because gen-browse.mjs rejects them.

    // Two namespaces on purpose: listing pages under /browse/, the documents
    // themselves under /files/. Keeping them apart is what stops prerendering
    // artifacts from ever landing among the documents.
    const browseHref = (p: string) => (p ? `${base}/browse/${encodeURI(p)}` : `${base}/browse`);
    const fileHref = (p: string) => `${base}/files/${encodeURI(p)}`;

    // The trail stops at the archive root: nothing above it is ever generated.
    let trail = $derived([
        { name: 'Files', path: '' },
        ...path.split('/').filter(Boolean).map((name, i, all) => ({
            name,
            path: all.slice(0, i + 1).join('/')
        }))
    ]);
</script>

<svelte:head>
    <title>{path ? `${path} — files` : 'Files'}</title>
</svelte:head>

<div class="container mx-auto">
    <div class="w-full lg:w-2/3 lg:mx-auto text-gray-600 dark:text-gray-300">
        <div class="section">
            <h2>{path ? path.split('/').pop() : 'Files'}</h2>

            <p class="text-xl pb-4">
                <a class="text-blue-700 hover:underline" href={`${base}/`}>Home</a>
                {#each trail as crumb, i}
                    <span class="px-2 text-gray-400">/</span>
                    {#if i === trail.length - 1}
                        <span>{crumb.name}</span>
                    {:else}
                        <a class="text-blue-700 hover:underline" href={browseHref(crumb.path)}
                            >{crumb.name}</a>
                    {/if}
                {/each}
            </p>

            {#if entries.length === 0}
                <p class="text-xl dark:text-gray-200">This folder is empty.</p>
            {:else}
                <ul class="text-xl">
                    {#each entries as entry (entry.path)}
                        <li class="flex items-baseline gap-3 py-2
                            border-t border-gray-300 dark:border-gray-700">
                            <i
                                class="fa-solid w-5 shrink-0 text-center text-gray-400
                                    {entry.kind === 'dir' ? 'fa-folder' : 'fa-file'}"
                                aria-hidden="true"
                            ></i>
                            <a
                                class="text-blue-700 hover:underline break-all"
                                href={entry.kind === 'dir'
                                    ? browseHref(entry.path)
                                    : fileHref(entry.path)}
                            >{entry.name}</a>
                            <span class="ml-auto shrink-0 text-base text-gray-400">
                                {entry.detail}
                            </span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>
