// Generates one ordinary static route per folder under `static/files/`, so the
// document archive gets browsable listing pages.
//
// Static routes rather than a single `[...path]` rest route: a rest route does
// not compose with this site's `paths.relative` prerendering. The prerenderer
// resolves the listings' relative hrefs against the wrong base, feeds the
// resulting phantom URLs back into the route, and recurses -- emitting pages
// with ~2000-character parameters, and hanging outright under
// `trailingSlash: 'always'`. Static routes cannot be fed back into themselves,
// and they inherit the site layout, styling and dark mode for free.
//
// Everything it writes lives under src/routes/browse/, which is gitignored and
// deleted at the start of every run. Do not put hand-written routes there; any
// other route in src/routes/ is unaffected.
//
// Runs once at the start of `npm run dev`, `build` and `check`: `vite dev` will
// not notice documents added to or removed from static/files/ while it is
// running. Restart it to pick them up.

import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {import('../src/lib/files.js').Entry} Entry
 * @typedef {{ path: string, kind: 'dir' | 'file' | 'nfd' | 'symlink' }} Violation
 */

// Both resolved from this file's location rather than process.cwd(), so the
// script behaves the same however it is invoked. Reading the *source* directory
// and never `build/` is what keeps prerendering artifacts (`_app/`,
// `index.html`, `__data.json`) from ever appearing as a row: they exist only in
// the output.
const ROOT = path.join(import.meta.dirname, '..', 'static', 'files');
const OUT = path.join(import.meta.dirname, '..', 'src', 'routes', 'browse');

// Names that fail these checks fail the build, below.
//
// A file never becomes a route, so almost anything goes. It may not contain
// punctuation that means something in a URL, which is what lets prerendering
// keep its default link checking: the crawler re-parses percent-escapes, so
// `a&b.pdf` comes back as a 404 for a file sitting right there. A backslash is
// rejected for the same reason -- something between the manifest and the
// crawler reads it as a path separator -- and it cannot occur on Windows. Nor
// may it
// contain the invisible direction controls that make `we<U+202E>rdp.pdf`
// display as `wefdp.pdr`. Everything else real documents are named -- accents,
// non-Latin scripts, `’`, `–`, `…` -- is left alone, because a rule that
// rejects them costs a rename for no gain.
//
// A folder is checked the other way round, against a small allowlist, because
// its name becomes a route directory where SvelteKit reads `[name]` as a
// parameter, `(name)` as a layout group and `+` as a reserved prefix, and an
// ASCII apostrophe breaks its generated code. `\p{L}` and `\p{N}` keep it
// Unicode-aware, so `café` and `报告` still pass.
//
// A name must also be in composed (NFC) form. macOS hands out decomposed names
// -- `ü` as `u` + U+0308 -- which look identical and compare unequal, and a
// static server that indexes by normalised name then 404s the file sitting
// right there. Composed is the only form that resolves everywhere.
//
// PROBLEMS is the plain-English form, for the build error; README.md states the
// same thing for whoever is adding the documents.
const BAD_FILE = /[#?%&=+\\\p{Cc}\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;
const SAFE_DIR = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} ._’-]*$/u;
const PROBLEMS = {
    file: 'File names may not contain  # ? % & = + \\  -- each means something in a URL.',
    dir:
        'Folder names must start with a letter or digit and use only letters,\n' +
        '  digits, spaces, and . - _ ’ -- a folder name becomes part of a route.',
    nfd:
        'These names store an accent in a form that looks right but does not match\n' +
        '  as a web address -- macOS names files this way. Rename the file, retyping\n' +
        '  the accented letters, and it will work.',
    symlink:
        'These are shortcuts to files elsewhere. The build would publish whatever\n' +
        '  they point at without listing it on the page, so copy the real file in\n' +
        '  instead.'
};

/**
 * Human-readable size. Binary units, matching what file managers show.
 * @param {number} bytes
 */
function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let n = bytes;
    let i = 0;
    // Compare the *rounded* value: 1,048,570 bytes is 1023.99 KB, which passes
    // a `n >= 1024` test and then displays as a bogus "1024 KB".
    while (Math.round(n) >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${i === 0 || n >= 10 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

/**
 * Read the whole archive in one pass.
 *
 * @returns {{ listings: Map<string, Entry[]>, violations: Violation[] }}
 *   `listings` is keyed by path relative to the archive root, `''` being the
 *   root itself, and always contains at least that key.
 */
function readTree() {
    /** @type {Map<string, Entry[]>} */
    const listings = new Map();
    /** @type {Violation[]} */
    const violations = [];

    /**
     * @param {string} rel
     * @returns {Entry[]}
     */
    function walk(rel) {
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
            // Dotfiles are skipped rather than rejected: `.DS_Store` and
            // `Thumbs.db` appear on their own, and failing someone's build over
            // one would be hostile.
            if (d.name.startsWith('.')) continue;
            const childRel = rel ? `${rel}/${d.name}` : d.name;

            if (d.name !== d.name.normalize('NFC')) {
                violations.push({ path: childRel, kind: 'nfd' });
                continue;
            }

            // A symlink is reported, not skipped: `withFileTypes` reports it as
            // its own kind so it never reaches a listing, but Vite copies
            // `static/` by following links, so its target would be published at
            // its /files/ URL with nothing on the page to show for it. Anything
            // else that is neither file nor directory (a socket, a device) is
            // not a document and is simply never listed.
            if (d.isSymbolicLink()) {
                violations.push({ path: childRel, kind: 'symlink' });
            } else if (d.isDirectory()) {
                if (!SAFE_DIR.test(d.name)) {
                    violations.push({ path: childRel, kind: 'dir' });
                    continue;
                }
                const children = walk(childRel);
                entries.push({
                    kind: 'dir',
                    name: d.name,
                    path: childRel,
                    detail: children.length === 1 ? '1 item' : `${children.length} items`
                });
            } else if (d.isFile()) {
                if (BAD_FILE.test(d.name)) {
                    violations.push({ path: childRel, kind: 'file' });
                    continue;
                }
                entries.push({
                    kind: 'file',
                    name: d.name,
                    path: childRel,
                    detail: formatBytes(fs.statSync(path.join(abs, d.name)).size)
                });
            }
        }

        // Folders first, then files, each in reading order. `localeCompare` at
        // its default sensitivity is a total order, so the same tree always
        // produces the same page rather than one that depends on readdir order.
        entries.sort((a, b) =>
            a.kind === b.kind
                ? a.name.localeCompare(b.name, undefined, { numeric: true })
                : a.kind === 'dir'
                  ? -1
                  : 1
        );

        listings.set(rel, entries);
        return entries;
    }

    walk('');
    // A missing or unreadable `static/files/` still needs a root listing, or the
    // nav link to it 404s and fails the build.
    if (!listings.has('')) listings.set('', []);
    return { listings, violations };
}

/**
 * Serialise data for embedding in a `<script>` block: `</script>` inside a
 * filename would close the block early.
 * @param {unknown} value
 */
const embed = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const { listings, violations } = readTree();

// Refuse to publish an unusable name rather than skipping it: a document that
// silently never appears is a worse failure than a build that stops and says
// why. Everything is reported at once, so one rename pass can fix the lot.
if (violations.length > 0) {
    console.error(`\ngen-browse: ${violations.length} name(s) cannot be published.\n`);
    for (const [kind, problem] of Object.entries(PROBLEMS)) {
        const group = violations.filter((v) => v.kind === kind);
        if (group.length === 0) continue;
        console.error(problem);
        for (const v of group) console.error(`    static/files/${v.path}`);
        console.error('');
    }
    console.error(
        'Rename or remove them, then run the build again.\n' +
            "See README.md, 'Adding documents to the Files page'.\n"
    );
    process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });

for (const [dir, entries] of listings) {
    // Folder names SvelteKit would read as route syntax are rejected above, so
    // every segment here is safe to use verbatim.
    const target = dir ? path.join(OUT, ...dir.split('/')) : OUT;
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(
        path.join(target, '+page.svelte'),
        '<!-- Generated by scripts/gen-browse.mjs. Do not edit; it is overwritten. -->\n' +
            '<script lang="ts">\n' +
            "    import Listing from '$lib/listing.svelte';\n" +
            "    import type { Entry } from '$lib/files';\n" +
            `    const path: string = ${embed(dir)};\n` +
            `    const entries: Entry[] = ${embed(entries)};\n` +
            '</script>\n\n' +
            '<Listing {path} {entries} />\n'
    );
}

console.log(`gen-browse: ${listings.size} listing page(s)`);
