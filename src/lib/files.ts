// One row in a document listing: the contract between the pages
// scripts/gen-browse.mjs generates into src/routes/browse/ and
// $lib/listing.svelte, so a drift in the generator's output is a
// `npm run check` error rather than a broken page.

export type Entry = {
    kind: 'dir' | 'file';
    name: string;
    /** Path relative to the archive root, e.g. `papers/thesis.pdf`. */
    path: string;
    /** Formatted size for a file, child count for a folder. */
    detail: string;
};
