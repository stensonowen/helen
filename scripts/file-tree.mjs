// Walks the browsable document tree in `static/files/`.
//
// Deliberately reads the *source* directory, never `build/`. That is what
// guarantees a listing can only show documents someone actually put there:
// prerendering artifacts (`_app/`, `index.html`, `__data.json`) exist only in
// the output, so they are invisible here and can never appear as a row.

import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.join(process.cwd(), 'static', 'files');

// Non-dot names that would be confusing rather than useful if they turned up
// next to real documents. Dotfiles are excluded separately.
const HIDDEN = new Set(['index.html', '__data.json', 'README.md']);

const hidden = (name) => name.startsWith('.') || HIDDEN.has(name);

// Names are checked against an allowlist, and anything outside it fails the
// build (see `assertNamesAreSafe`). Two lists, because the constraints differ:
//
// Directories become route directories, and SvelteKit reads several characters
// there as syntax rather than text -- `[name]` is a parameter, `(name)` a layout
// group that vanishes from the URL, `+name` a reserved prefix, `#` is rejected
// outright, and an apostrophe breaks its generated code. Its documented `[x+HH]`
// escape does not resolve for directory routes in @sveltejs/kit 2.70, so rather
// than chase that list, allow only what is unambiguously safe.
//
// Files never become routes, so they can be more relaxed -- parentheses,
// apostrophes, ampersands and commas are all common in real document names. What
// they may not contain is anything with meaning in a URL (`#`, `?`, `%`, `&`,
// `=`, `+`) or any character that renders deceptively, notably the
// bidirectional controls that make `we<U+202E>rdp.pdf` display as `wefdp.pdr`.
//
// Excluding those is what lets prerendering keep its default link checking: the
// crawler decodes percent-escapes and re-parses the result, so a document called
// `a&b.pdf` becomes `a%26b.pdf` and is then read as though the `&` started a
// query string, reporting a 404 for a file that is sitting right there.
//
// Both lists are Unicode-aware, so `café` and `报告` pass.
const SAFE_DIR = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} ._-]*$/u;
const SAFE_FILE = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} ._(),'-]*$/u;

export const NAME_RULES = {
    dir: 'letters, digits, spaces, and . - _',
    file: "letters, digits, spaces, and . - _ ( ) ' ,"
};

/**
 * Walk the tree and collect every name that cannot be published, so the caller
 * can report them all at once instead of one per build.
 */
export function collectViolations(rel = '') {
    const abs = path.join(ROOT, rel);
    let dirents;
    try {
        dirents = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
        return [];
    }

    const bad = [];
    for (const d of dirents) {
        // Dotfiles are skipped rather than rejected: `.DS_Store` and `Thumbs.db`
        // appear on their own and it would be hostile to fail the build for them.
        if (hidden(d.name)) continue;
        const childRel = rel ? `${rel}/${d.name}` : d.name;

        if (d.isDirectory()) {
            if (SAFE_DIR.test(d.name)) bad.push(...collectViolations(childRel));
            else bad.push({ path: childRel, kind: 'dir' });
        } else if (d.isFile() && !SAFE_FILE.test(d.name)) {
            bad.push({ path: childRel, kind: 'file' });
        }
    }
    return bad;
}

/** Human-readable size. Binary units, matching what file managers show. */
export function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let n = bytes / 1024;
    let i = 0;
    // Compare the *rounded* value, not the raw one: 1,048,570 bytes is 1023.99 KB,
    // which fails a `n >= 1024` test and then rounds to a nonsensical "1024 KB".
    const rounded = (v) => (v < 10 ? Number(v.toFixed(1)) : Math.round(v));
    while (rounded(n) >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

/**
 * Read one directory. `rel` is relative to the browser root; '' is the root.
 * Returns null if it does not exist, which covers both a missing
 * `static/files/` and a bad path.
 */
export function readDir(rel) {
    const abs = path.join(ROOT, rel);

    // `withFileTypes` reports a symlink as its own kind rather than resolving
    // it, so symlinks are skipped below instead of followed out of the tree.
    let dirents;
    try {
        dirents = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
        return null;
    }

    const entries = [];
    for (const d of dirents) {
        if (hidden(d.name)) continue;
        const childRel = rel ? `${rel}/${d.name}` : d.name;

        if (d.isDirectory()) {
            const n = (readDir(childRel) ?? []).length;
            entries.push({
                kind: 'dir',
                name: d.name,
                path: childRel,
                detail: n === 1 ? '1 item' : `${n} items`
            });
        } else if (d.isFile()) {
            // A sync client or a copy still in progress can remove the file
            // between the readdir above and this stat. Skipping the row is far
            // better than an uncaught ENOENT, which would abort the generator
            // and, because the npm scripts chain with `&&`, stop the build or
            // dev server from starting at all.
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
        // Anything else (symlink, socket, device) is skipped.
    }

    // Directories first, then files. `sensitivity: 'base'` gives the natural
    // reading order but treats `Notes` and `notes` as equal, which would leave
    // ties resolved by readdir order -- filesystem-dependent, so the same tree
    // could produce differently ordered pages locally and in CI. The exact
    // comparison breaks those ties deterministically.
    return entries.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
        return (
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true }) ||
            (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        );
    });
}

/** Every directory in the tree, '' first for the root itself. */
export function allDirs(rel = '') {
    const entries = readDir(rel);
    if (!entries) return [];
    const dirs = [rel];
    for (const e of entries) if (e.kind === 'dir') dirs.push(...allDirs(e.path));
    return dirs;
}
