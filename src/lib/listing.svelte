<script lang="ts">
    import { base } from '$app/paths';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import type { Entry } from '$lib/files';

    // Both required: every caller is generated, so a missing prop is a bug worth
    // catching at compile time rather than rendering an empty page.
    let { path, entries }: { path: string; entries: Entry[] } = $props();

    // Font Awesome glyph per file type. Anything unrecognised falls back to a
    // plain page icon rather than nothing, so the rows stay aligned.
    const icons: Record<string, string> = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word', docx: 'fa-file-word', odt: 'fa-file-word',
        xls: 'fa-file-excel', xlsx: 'fa-file-excel', csv: 'fa-file-csv',
        ppt: 'fa-file-powerpoint', pptx: 'fa-file-powerpoint',
        txt: 'fa-file-lines', md: 'fa-file-lines', rtf: 'fa-file-lines',
        zip: 'fa-file-zipper', gz: 'fa-file-zipper', tar: 'fa-file-zipper',
        png: 'fa-file-image', jpg: 'fa-file-image', jpeg: 'fa-file-image',
        gif: 'fa-file-image', webp: 'fa-file-image', svg: 'fa-file-image',
        mp3: 'fa-file-audio', wav: 'fa-file-audio', m4a: 'fa-file-audio',
        mp4: 'fa-file-video', mov: 'fa-file-video'
    };

    // Encode per segment, so that the `/` separators survive while spaces and
    // non-ASCII in each name are escaped.
    //
    // encodeURIComponent over-encodes, though: it escapes the sub-delims
    // `!'()*,`, which RFC 3986 allows raw in a path segment and which
    // SvelteKit's static-asset manifest stores raw -- so `O'Brien (2024), x.pdf`
    // would be linked as `%27`/`%28`/`%2C` and fail to match the real file.
    // Put those six back.
    const encSeg = (s: string) =>
        encodeURIComponent(s).replace(/%(21|27|28|29|2A|2C)/gi, (m) => decodeURIComponent(m));

    const enc = (p: string) => p.split('/').map(encSeg).join('/');

    // Two namespaces on purpose: listing pages under /browse/, the documents
    // themselves under /files/. Keeping them apart is what stops prerendering
    // artifacts from ever landing among the documents.
    const browseHref = (p: string) => (p ? `${base}/browse/${enc(p)}` : `${base}/browse`);
    const fileHref = (p: string) => `${base}/files/${enc(p)}`;

    // The trail stops at the browser root: nothing above it is ever generated,
    // so following it up cannot wander into the site's internals.
    let crumbs = $derived(
        path
            ? path.split('/').map((name, i, all) => ({ name, path: all.slice(0, i + 1).join('/') }))
            : []
    );

    let title = $derived(path ? path.split('/').pop() : 'Files');
</script>

<svelte:head>
    <title>{path ? `${path} — files` : 'Files'}</title>
</svelte:head>

<div class="container mx-auto">
    <div class="w-full lg:w-2/3 lg:mx-auto text-gray-600 dark:text-gray-300">
        <div class="section">
            <h2>
                {title}
                {#if path}<span class="subtitle">in files</span>{/if}
            </h2>

            <!-- Breadcrumbs. Home is the only step above the browser root. -->
            <p class="text-xl pb-4">
                <a class="text-blue-700 hover:underline" href={`${base}/`}>Home</a>
                <span class="px-2 text-gray-400">/</span>
                {#if crumbs.length}
                    <a class="text-blue-700 hover:underline" href={browseHref('')}>Files</a>
                {:else}
                    <span>Files</span>
                {/if}
                {#each crumbs as crumb, i}
                    <span class="px-2 text-gray-400">/</span>
                    {#if i === crumbs.length - 1}
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
                                    {entry.kind === 'dir'
                                    ? 'fa-folder'
                                    : (icons[entry.ext] ?? 'fa-file')}"
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
