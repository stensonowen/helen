<script lang="ts">
    import { page } from '$app/state';
    import { base } from '$app/paths';

    // A missing PDF and a missing page need different advice: the generic copy
    // below tells people to use the menu, which is actively misleading for a
    // file, since files are not in the menu. `fallback: '404.html'` means
    // SvelteKit boots client-side for unknown URLs, so the attempted path is
    // available here to tell the two cases apart.
    let inFiles = $derived(
        ['/browse', '/files'].some(
            (p) =>
                page.url.pathname === `${base}${p}` ||
                page.url.pathname.startsWith(`${base}${p}/`)
        )
    );
</script>

<div class="container mx-auto">
    <div class="w-full lg:w-2/3 lg:mx-auto text-gray-600 dark:text-gray-300">
        <div class="section">
            <h2> {page.status} — {page.error?.message ?? 'Something went wrong'} </h2>
            {#if inFiles}
                <p class="text-xl pb-1 dark:text-gray-200">
                    That file or folder isn't here. It may have been renamed or removed,
                    or the link may have a typo in it. Browse what is available from
                    <a class="text-blue-700 hover:underline" href={`${base}/browse`}>files</a>.
                </p>
            {:else}
                <p class="text-xl pb-1 dark:text-gray-200">
                    That page isn't here. It may have moved, or the link may have a typo in it.
                    Every page is in the menu above, or start again from the
                    <a class="text-blue-700 hover:underline" href={`${base}/`}>home page</a>.
                </p>
            {/if}
        </div>
    </div>
</div>
