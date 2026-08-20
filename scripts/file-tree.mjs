// Reads the browsable document tree in `static/files/`.
//
// Deliberately reads the *source* directory, never `build/`. That is what
// guarantees a listing can only show documents someone actually put there:
// prerendering artifacts (`_app/`, `index.html`, `__data.json`) exist only in
// the output, so they are invisible here and can never appear as a row.

import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {import('../src/lib/files.js').Entry} Entry
 * @typedef {{ path: string, kind: 'dir' | 'file' | 'symlink' }} Violation
 */

const ROOT = path.join(process.cwd(), 'static', 'files');

// The folder's own instructions, which would be noise in its listing.
const HIDDEN = new Set(['README.md']);

/** @param {string} name */
const hidden = (name) => name.startsWith('.') || HIDDEN.has(name);

// Names are checked against an allowlist and anything outside it fails the
// build, in `scripts/gen-browse.mjs`. Two lists, because the constraints differ.
//
// Directories become route directories, where SvelteKit reads several
// characters as syntax rather than text: `[name]` is a parameter, `(name)` a
// layout group that vanishes from the URL, `+name` a reserved prefix, `#` is
// rejected outright, and an apostrophe breaks its generated code with an opaque
// SyntaxError. Its documented `[x+HH]` escape does not resolve for directory
// routes in @sveltejs/kit 2.70, so rather than chase that list, allow only what
// is unambiguously safe.
//
// Files never become routes, so they are looser -- parentheses, apostrophes and
// commas are all common in real document names. What they may not contain is
// anything with meaning in a URL (`#`, `?`, `%`, `&`, `=`, `+`) or anything that
// renders deceptively, notably the bidirectional controls that make
// `we<U+202E>rdp.pdf` display as `wefdp.pdr`.
//
// Excluding those is what lets prerendering keep its default link checking, so
// every document link is verified at build time: the crawler decodes
// percent-escapes and re-parses the result, so `a&b.pdf` becomes `a%26b.pdf` and
// is then read as though the `&` began a query string, reporting a 404 for a
// file that is sitting right there.
//
// Both lists are Unicode-aware, so `café` and `报告` pass. Keep NAME_RULES below
// in step with them -- it is what the error message tells the reader.
const SAFE_DIR = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} ._-]*$/u;
const SAFE_FILE = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} ._(),'-]*$/u;

/** Plain-English form of the two patterns above, for the build error. */
export const NAME_RULES = {
    dir: 'letters, digits, spaces, and . - _',
    file: "letters, digits, spaces, and . - _ ( ) ' ,"
};

/**
 * Human-readable size. Binary units, matching what file managers show.
 * @param {number} bytes
 */
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    // Compare the *rounded* value, not the raw one: 1,048,570 bytes is 1023.99
    // KB, which fails a `n >= 1024` test and then rounds to a bogus "1024 KB".
    const round = (/** @type {number} */ v) => (v < 10 ? Number(v.toFixed(1)) : Math.round(v));
    let n = bytes / 1024;
    let i = 0;
    while (round(n) >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${round(n)} ${units[i]}`;
}

/**
 * Read the whole tree in one pass.
 *
 * @returns {{ listings: Map<string, Entry[]>, violations: Violation[] }}
 *   `listings` is keyed by path relative to the archive root, `''` being the
 *   root itself, and always contains at least that key. `violations` lists
 *   everything that cannot be published; the caller decides what to do with it.
 */
export function readTree() {
    /** @type {Map<string, Entry[]>} */
    const listings = new Map();
    /** @type {Violation[]} */
    const violations = [];
    walk('', listings, violations);
    // A missing or unreadable `static/files/` still needs a root listing, or the
    // nav link to it 404s and fails the build.
    if (!listings.has('')) listings.set('', []);
    return { listings, violations };
}

/**
 * @param {string} rel
 * @param {Map<string, Entry[]>} listings
 * @param {Violation[]} violations
 * @returns {Entry[]}
 */
function walk(rel, listings, violations) {
    const abs = path.join(ROOT, rel);

    /** @type {fs.Dirent[]} */
    let dirents;
    try {
        dirents = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
        return [];
    }

    /** @type {Entry[]} */
    const entries = [];
    for (const d of dirents) {
        // Dotfiles are skipped rather than rejected: `.DS_Store` and `Thumbs.db`
        // appear on their own, and failing someone's build over one would be
        // hostile.
        if (hidden(d.name)) continue;
        const childRel = rel ? `${rel}/${d.name}` : d.name;

        // `withFileTypes` reports a symlink as its own kind rather than
        // resolving it. Following one could walk out of the archive entirely,
        // but silently dropping it would publish the target at its /files/ URL
        // while leaving it out of the listing, so report it instead.
        if (d.isSymbolicLink()) {
            violations.push({ path: childRel, kind: 'symlink' });
        } else if (d.isDirectory()) {
            if (!SAFE_DIR.test(d.name)) {
                violations.push({ path: childRel, kind: 'dir' });
                continue;
            }
            const children = walk(childRel, listings, violations);
            entries.push({
                kind: 'dir',
                name: d.name,
                path: childRel,
                detail: children.length === 1 ? '1 item' : `${children.length} items`
            });
        } else if (d.isFile()) {
            if (!SAFE_FILE.test(d.name)) {
                violations.push({ path: childRel, kind: 'file' });
                continue;
            }
            // A sync client or a copy still in progress can remove the file
            // between the readdir above and this stat. Skipping the row beats an
            // uncaught ENOENT, which would abort the generator and -- because the
            // npm scripts chain with `&&` -- stop the build or dev server dead.
            let size;
            try {
                size = fs.statSync(path.join(abs, d.name)).size;
            } catch {
                continue;
            }
            entries.push({
                kind: 'file',
                name: d.name,
                path: childRel,
                ext: path.extname(d.name).slice(1).toLowerCase(),
                detail: formatBytes(size)
            });
        }
        // Anything else (socket, device, fifo) is not a document; skip it.
    }

    // Directories first, then files. `sensitivity: 'base'` gives the natural
    // reading order but treats `Notes` and `notes` as equal, which would leave
    // ties resolved by readdir order -- filesystem-dependent, so the same tree
    // could produce differently ordered pages locally and in CI. The exact
    // comparison breaks those ties deterministically.
    entries.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
        return (
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true }) ||
            (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        );
    });

    listings.set(rel, entries);
    return entries;
}
