// Shape of one row in a document listing. Shared by the pages that
// scripts/gen-browse.mjs generates into src/routes/browse/ and by
// $lib/listing.svelte, so a change to the generator's output is a type error
// rather than a silent mismatch.

type Common = {
    name: string;
    /** Path relative to the archive root, e.g. `papers/thesis.pdf`. */
    path: string;
    /** Formatted size for a file, child count for a folder. */
    detail: string;
};

// A discriminated union rather than one type with an optional `ext`: it makes
// `ext` reachable only after narrowing on `kind`, so the listing cannot read it
// off a folder by accident.
export type Entry =
    | (Common & { kind: 'dir' })
    | (Common & {
          kind: 'file';
          /** Lowercased extension without the dot; `''` when there is none. */
          ext: string;
      });
