# helen

The source for **<https://stensonowen.github.io/helen/>**.

It's a static website: a handful of pages built from text files, with no server,
no database, and nothing to log into. You edit a file, save it, and the page
changes. It's built with [SvelteKit](https://svelte.dev/docs/kit) and styled with
[Tailwind CSS](https://tailwindcss.com/), and it's published automatically by
GitHub whenever a change lands.

Three ways in, depending on what you're doing:

- **Fixing a typo or rewording a paragraph?** [Change it in your browser](#changing-words-without-installing-anything).
  Nothing to install.
- **Done web work before?** The [Quick start](#quick-start) is all you need.
- **Otherwise**, [Setting up on Windows](#setting-up-on-windows) assumes nothing is
  installed yet.

---

## Changing words without installing anything

GitHub can edit a file and open a pull request for you, and the robot will build a
private copy of the site so you can check the result. No Node, no Git, nothing on
your machine.

1. Open the file on GitHub — for the about page, that's
   [`src/routes/about/+page.svelte`](https://github.com/stensonowen/helen/blob/main/src/routes/about/+page.svelte).
   The [table below](#where-things-live) says which file is which page.
2. Click the **pencil** icon at the top right of the file.
3. Change the words. The text lives between the tags; leave the `<p>` and `</p>`
   bits alone.
4. Click **Commit changes…**. In the box that appears, choose **Create a new branch
   for this commit and start a pull request** — this is the important one, because the
   other option publishes straight to the live site with no preview. Then
   **Propose changes**, then **Create pull request**.
5. A minute or two later a comment appears with a link to your version of the site.
   Look at it, then click **Merge pull request** to make it live.

That's the whole loop for text. The preview link only appears if you have push access
to this repository — see [the note on forks](#how-deployment-works) if yours doesn't
show up.

The rest of this README is for when you want the site running on your own machine —
worth it if you're making a lot of changes, because you see each one the moment you
save instead of waiting a couple of minutes for a build.

---

## Quick start

Requires [Node.js](https://nodejs.org/) 22 or newer — any current LTS release works,
and npm enforces this itself (`engine-strict` in `.npmrc`), so an older version fails
with a clear error instead of behaving oddly. If you use a version manager, `.nvmrc`
pins the exact version CI runs (`nvm use`).

```bash
git clone https://github.com/stensonowen/helen.git
cd helen
npm install
npm run dev      # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally and reloads the browser as you edit. |
| `npm run build` | Produces the final site in `build/`. |
| `npm run preview` | Serves what `npm run build` produced, to check the real output. |
| `npm run check` | Type-checks the project. CI runs this too. |

---

## Setting up on Windows

Three installers, all of them next-next-finish, and then one window you type in.
You do this once.

### 1. Install three programs

Download each, run it, and accept every default:

| Program | Get it from | What it's for |
| --- | --- | --- |
| **Node.js** | <https://nodejs.org/> — take the **LTS** button | Runs the site on your machine |
| **Git** | <https://git-scm.com/download/win> | Gets the files, sends changes back |
| **Notepad++** | <https://notepad-plus-plus.org/downloads/> | Edits the files. A few megabytes, opens instantly |

> Prefer the command line? All three are in `winget`:
> `winget install OpenJS.NodeJS.LTS Git.Git Notepad++.Notepad++`

Whatever "LTS" gets you is fine — this project requires 22 or newer, and today's LTS
is well ahead of that. (That floor is enforced, not just a suggestion: `npm install`
refuses to run on anything older, with a clear error rather than a confusing one — see
[Troubleshooting](#troubleshooting) if you hit it.) `.nvmrc` has the specific version
CI tests against, if you ever want to match it exactly — see the box below.

> **Want the exact version CI uses, or to switch between projects that pin different
> ones?** Use [nvm-windows](https://github.com/coreybutler/nvm-windows) *instead of*
> the plain Node.js installer above — the two conflict if both are installed, so pick
> one. `winget install CoreyButler.NVMforWindows`, open a new window, then
> `nvm install 24` and `nvm use 24` (or whatever `.nvmrc` currently says). Most people
> don't need this; the plain installer is simpler and is what the rest of this guide
> assumes.

### 2. Open the Node.js command prompt

Installing Node adds a Start Menu shortcut. Press <kbd>Win</kbd>, type `node`, and open
**Node.js command prompt**. It greets you with something like:

```
Your environment has been set up for using Node.js v24.9.0 and npm.
```

**Use this window for everything below.** Opening it after the installers is the whole
trick: there's no `PATH` to configure, no window to close and reopen, and no version to
check by hand — the greeting already told you. (An ordinary PowerShell window can also
refuse to run `npm` until you change a security setting. This one won't.)

First, tell Git who you are. It stamps this on every change you make:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 3. Get the project

Pick somewhere to keep it. **Avoid a OneDrive-synced folder** — OneDrive fights
with the file watcher and live reload stops working.

```
cd %USERPROFILE%\Documents
git clone https://github.com/stensonowen/helen.git
cd helen
npm install
```

`npm install` downloads everything the site needs into a `node_modules` folder.
It takes a minute the first time, prints a lot of text, and may mention a few
vulnerabilities in build-time tools — that's normal and nothing to act on here.

### 4. Teach Notepad++ about the page files

The pages end in `.svelte`, which Notepad++ doesn't recognise, so they open as a wall
of black text. Fix it once: **Settings → Style Configurator**, pick **HTML** in the
language list, type `svelte` into the **User ext.** box at the bottom left, then
**Save & Close**. Tags now show up in colour. If a `.svelte` file is already open in a
tab, close and reopen it — Notepad++ only applies this to files opened afterward.

---

## Seeing your changes live

In the Node.js command prompt, from inside the `helen` folder:

```
npm run dev
```

It prints something like:

```
  ➜  Local:   http://localhost:5173/
```

<kbd>Ctrl</kbd>-click that link, or paste it into your browser. You're now looking
at the site running on your own machine.

Leave that window alone — the command keeps running as long as the site is up. Open
the project in Notepad++ in the meantime.

**Try it:** open `src/routes/about/+page.svelte`, change some wording, and save.
The browser updates on its own, without a refresh. That loop — edit, save, look —
is the whole workflow.

When you're finished, click back into the Node.js command prompt and press
<kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

### Where things live

| To change | Edit |
| --- | --- |
| Home page | `src/routes/+page.svelte` |
| About page | `src/routes/about/+page.svelte` |
| Research page | `src/routes/research/+page.svelte` |
| Teaching page | `src/routes/teaching/+page.svelte` |
| CTWG page | `src/routes/ctwg/+page.svelte` |
| The top navigation bar | `src/lib/navbar.svelte` |
| The "Contents" sidebar on the longer pages | `src/lib/contents.svelte` |
| The "page not found" page | `src/routes/+error.svelte` |
| Wrapper shared by every page | `src/routes/+layout.svelte` |
| Global styles and colours | `src/app.css`, `tailwind.config.ts` |
| Images used inside pages | `src/assets/` |
| Documents on the Files page | `static/files/` — see [below](#adding-documents-to-the-files-page) |
| Other files served as-is (e.g. the favicon) | `static/` |

A page's URL comes from its folder name: `src/routes/about/+page.svelte` is served
at `/about`. To add a page, make a new folder with a `+page.svelte` inside it, then add
a line to the `pages` list at the top of `src/lib/navbar.svelte` — that one list feeds
both the wide-screen bar and the phone menu.

Folder names are part of the URL, so keep them lowercase: `/research` and `/Research`
are different addresses, and only the one matching the folder will work.

On the longer pages, the "Contents" sidebar and the sections it lists are matched by
`id`. To add a section, add the block and a matching entry:

```svelte
<Contents sections={[
    { id: 'grading', label: 'Graderships' },
]} />
...
<div id="grading" class="section">
```

The entry then bolds itself whenever that section is on screen. If the two ids don't
match, `npm run build` fails and names the one that has no section, so a mismatch
can't reach the live site.

### Adding documents to the Files page

The **files** link in the navigation bar is a browsable index of the `static/files/`
folder. Nothing in it is written by hand: drop a PDF into that folder and it appears
on the page, with its size beside it. Delete it and it's gone. Sub-folders become
sub-pages, nested as deep as you like.

```
static/files/
    cv.pdf                       -->  shown on  /browse
    syllabi/
        Phil 101, fall 2025.pdf  -->  shown on  /browse/syllabi
```

The listing pages live at `/browse`, and the documents themselves are served from
`/files/`. So `cv.pdf` above is a real, linkable address —
`https://stensonowen.github.io/helen/files/cv.pdf` — that you can paste into a page
or send to someone. It keeps working as long as you don't rename the file.

The folder starts out with a single empty `.gitkeep` file in it. That is only there
so Git keeps track of an otherwise empty folder; ignore it, and don't delete it.

Two things worth knowing:

**`npm run dev` reads the folder once, when it starts.** Add or remove a document
while it's running and the listing won't notice. Press <kbd>Ctrl</kbd>+<kbd>C</kbd>
in that window and run it again.

**Names are checked when the site is built.** An unusable one stops the build with a
message naming the file, rather than quietly leaving it off the page. Documents can
be called almost anything:

| | Rule |
| --- | --- |
| **Files** | Any name, as long as it has no `#` `?` `%` `&` `=` `+` `\` in it |
| **Sub-folders** | Letters, digits, spaces, and `.` `-` `_` `’`, starting with a letter or digit |

So `Smith (2024), draft.pdf`, `café.pdf`, `报告.pdf` and `Anna’s copy.pdf` are all
fine as documents. The handful of banned characters mean something specific in a web
address, so a link to such a file would silently point at the wrong place.

Sub-folders are held to a stricter rule because a folder name becomes part of the
address itself, where a few more characters are reserved. If a name is rejected,
rename it and build again — the message tells you which one and why.

One oddity worth knowing about, because the error looks like nonsense when you hit
it: a file that came from a Mac can store an accent in a way that *looks* identical
but doesn't work in a web address. The build says so and names the file; renaming it,
retyping the accented letters yourself, is the whole fix.

---

## Making a change and getting it reviewed

Rather than editing the live site directly, you put changes on a **branch**, open a
**pull request**, and a robot builds a private copy of the site so everyone can look
at it before it goes public. (For a wording change, [the browser
route](#changing-words-without-installing-anything) does all of this for you.)

**1. Start a branch.** Name it after what you're doing.

```
git switch main
git pull
git switch -c fix-about-typo
```

**2. Make your edits** and check them with `npm run dev` as above.

**3. Save them to the branch.**

```
git add -A
git commit -m "Fix typo on the about page"
git push -u origin fix-about-typo
```

The first `git push` opens a browser window asking you to sign in to GitHub. That's
expected — it happens once, and Git remembers you afterwards.

**4. Open the pull request.** `git push` prints a GitHub link — open it and click
**Create pull request**. (Or go to the [repository](https://github.com/stensonowen/helen)
and use the banner at the top.)

**5. Wait a minute or two for the preview.** A comment appears on your pull request:

> ### ✅ Preview build passed
> **Preview:** https://stensonowen.github.io/helen/pr-preview/pr-42/

Open that link to see your change as a real website, at a URL you can send to
someone. It's a copy — the live site is untouched.

If something is broken instead, the comment says so and includes the actual error
message, so you can see what went wrong without digging through logs.

**6. Keep going.** More commits pushed to the same branch update the same preview
and edit that same comment — nothing piles up.

**7. Merge.** Click **Merge pull request**. The live site updates within a couple of
minutes, and the preview is taken down automatically.

### Checking your work before you push

Worth running if you've changed anything structural — this is exactly what CI runs,
so catching it here saves a round trip:

```
npm run check
npm run build
```

`npm run build` produces the final files in `build/`. To view them, note that the
real site lives at `/helen/` rather than the root of the domain, so set the base
path first. Most examples online show the Mac and Linux form,
`BASE_PATH=... npm run build`, which won't work here — on Windows it's a separate
`set` line:

```
set BASE_PATH=/helen
npm run build
npm run preview
```

Skipping `BASE_PATH` is fine for `npm run dev` and everyday work — it only matters
when you want to reproduce the exact links and asset paths of the deployed site.

---

## Troubleshooting

**`node` / `npm` is not recognized**
You're in the wrong window — commonly **Git Bash**, which the Git installer puts in
the right-click menu and is easy to reach for by habit. Press <kbd>Win</kbd>, type
`node`, and open **Node.js command prompt** instead. (`git` itself works in any
window, but only after you close and reopen it following the install. Note that Git
Bash also uses different command syntax than the rest of this README — `export`
instead of `set`, `$VAR` instead of `%VAR%` — so even once `node`/`npm` work there,
copy-pasting later commands as-is won't.)

**`npm error code EBADENGINE` / "Unsupported engine"**
Your Node is older than this project allows (22+) — `npm install`/`npm ci` refuse to
run rather than proceed on an untested version. Update Node the same way you installed
it: rerun the winget line, or download the LTS installer again from nodejs.org, then
reopen the Node.js command prompt and try again. If you're using nvm-windows instead,
`nvm install 24` (or whatever `.nvmrc` says) and `nvm use 24`.

**`npm : File ...\npm.ps1 cannot be loaded because running scripts is disabled`**
That's PowerShell refusing to run scripts. Use the Node.js command prompt instead and
it won't come up. If you'd rather stay in PowerShell, run
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, answer `Y`, and reopen it.

**`Port 5173 is in use`**
Either it's already running in another window, or something else grabbed the port:

```
npm run dev -- --port 5174
```

**Live reload doesn't fire when you save**
Almost always OneDrive. Move the project somewhere OneDrive doesn't sync
(`C:\dev\helen` works) and re-clone.

**`warning: LF will be replaced by CRLF`**
Harmless, and `.gitattributes` already normalises line endings on the way in.

**Something is broken and you don't know why**
Delete `node_modules` and reinstall from the exact locked versions:

```
rmdir /s /q node_modules
npm ci
```

`npm ci` installs precisely what `package-lock.json` specifies. Use it when you want
a known-good state; use `npm install` when you're deliberately adding a package.

---

## How deployment works

Everything is published from a branch called `gh-pages`, which is generated by CI —
you never edit it by hand.

```
gh-pages branch                  served at
  /                        -->   https://stensonowen.github.io/helen/
  /pr-preview/pr-42/       -->   https://stensonowen.github.io/helen/pr-preview/pr-42/
```

- **`.github/workflows/deploy.yml`** — on every merge to `main`, builds the site and
  replaces the branch root. It leaves `pr-preview/` alone, so open pull requests keep
  their previews.
- **`.github/workflows/pr-preview.yml`** — on every pull request, builds the site,
  publishes it under `pr-preview/pr-<number>/`, and posts the comment. When the pull
  request closes, the directory is deleted.

Because the site is served from a subdirectory rather than the root of the domain,
both workflows set a `BASE_PATH` environment variable, which `svelte.config.js` reads
into SvelteKit's `paths.base`. Get that wrong and the pages load without styling.

**One caveat about pull requests from forks.** GitHub gives them a read-only token, as
a security measure — so they get a build and a pass/fail check, but no hosted preview
and no comment. The results are on the run's summary page under the **Actions** tab
instead. If you're working on this regularly, ask for push access so you can branch
from this repository directly and get the full preview treatment.

---

## Reusing this setup for your own site

The two workflow files contain no account or repository names. The owner and repository
are read from the workflow context at run time, and the base path is worked out from
them — including the special case where a repository is named `<your-username>.github.io`
and therefore gets served from the root of the domain rather than a subdirectory. **So
after forking or renaming, there is nothing in `.github/workflows/` to edit.**

What you do need to do, once:

1. **Fork the repository**, or use **Use this template**.
2. **Enable Actions.** GitHub disables workflows on a new fork by default. Go to the
   **Actions** tab and click the button confirming you want them to run — until you do,
   nothing will build.
3. **Push one commit to `main`** and let the deploy workflow finish. This creates the
   `gh-pages` branch.
4. **Settings → Pages → Source: "Deploy from a branch" → `gh-pages` / `(root)`.**
   The branch has to exist before it appears in that menu, which is why this comes
   after step 3.
5. **Settings → Actions → General → Workflow permissions** → "Read and write
   permissions", so the workflow can publish and comment.

Then replace the content — the pages under `src/routes/`, the links in
`src/lib/navbar.svelte`, the images in `src/assets/` and `static/`, and this README.
The site URL is `https://<your-username>.github.io/<your-repo-name>/`.

Two smaller things worth knowing: `package.json` has a `name` field, cosmetic but worth
changing; and `.github/dependabot.yml` will start opening monthly dependency-update pull
requests, so delete it if you would rather not have them.
