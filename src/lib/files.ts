// Shape of one row in a file listing. Shared by the generated pages in
// src/routes/browse/ and by $lib/listing.svelte, so a change to the generator's
// output is a type error rather than a silent mismatch.
export type Entry = {
    kind: 'dir' | 'file';
    name: string;
    /** Path relative to the browser root, e.g. `papers/thesis.pdf`. */
    path: string;
    /** Formatted size for files, child count for directories. */
    detail: string;
    /** Lowercased extension without the dot; files only. */
    ext?: string;
};
