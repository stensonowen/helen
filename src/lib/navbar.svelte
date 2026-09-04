<script lang="ts">
    import logo from '../assets/Sketch.jpg'
    import PhilPeople from '$lib/philpeople.svelte'
    import { base } from '$app/paths';
    import '@fortawesome/fontawesome-free/css/all.min.css'

    // Add a page here and it appears in both the desktop bar and the mobile menu.
    const pages = [
        { href: `${base}/about`, label: 'about' },
        { href: `${base}/research`, label: 'research' },
        { href: `${base}/teaching`, label: 'teaching' },
        { href: `${base}/ctwg`, label: 'ctwg' },
    ];

    let open = $state(false);

    // Dark mode is a `dark` class on <body>: app.css paints the page off it, and
    // Tailwind's `dark:` variants are configured to key on it (darkMode: 'class').
    // The initial value is applied before first paint by the script in app.html;
    // this only runs when someone clicks the sun or the moon.
    function setTheme(dark: boolean) {
        document.body.classList.toggle('dark', dark);
        try {
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        } catch {
            // Private-browsing modes can make localStorage throw. The click still
            // takes effect, it just won't be remembered.
        }
    }
</script>

<style>
    /* Whichever theme is in effect is the lit one, underlined by an ::after that
       grows from the outside in. Both buttons start dim with no underline; the two
       `body.dark` blocks below swap which one is active. */
    .theme-toggle {
      position: relative;
      display: inline-block;
      cursor: pointer;
      color: gray;
    }
    .theme-toggle::after {
      content: '';
      position: absolute;
      bottom: -2px;
      width: 0;
      height: 2px;
      background-color: lightgray;
      transition: width 0.2s ease;
    }
    .theme-toggle-light::after { right: 0; }
    .theme-toggle-dark::after  { left: 0; }

    .theme-toggle-light { color: lightgray; }
    .theme-toggle-light::after { width: 100%; }

    :global(body.dark) .theme-toggle-light { color: gray; }
    :global(body.dark) .theme-toggle-light::after { width: 0; }
    :global(body.dark) .theme-toggle-dark { color: lightgray; }
    :global(body.dark) .theme-toggle-dark::after { width: 100%; }
</style>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') open = false; }} />

{#snippet pageLinks()}
    {#each pages as page (page.href)}
        <a class="hover:text-blue-500 transition-colors duration-200"
            href={page.href} onclick={() => (open = false)}> {page.label}
        </a>
    {/each}
{/snippet}

<!-- withLabels: the desktop bar is tight, so the marks stand alone there; the mobile
     menu is a list of words, so an unlabelled icon would read as an odd man out. -->
{#snippet contactLinks(withLabels: boolean)}
    <a class="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200"
        href="https://philpeople.org/profiles/samuel-j-thomas" aria-label="PhilPeople profile"
        onclick={() => (open = false)}>
        <PhilPeople />{#if withLabels}PhilPeople{/if}
    </a>
    <a class="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200"
        href="mailto:samuelthomas@arizona.edu" aria-label="email link"
        onclick={() => (open = false)}>
        <i class="fa-regular fa-envelope"></i>{#if withLabels}email{/if}
    </a>
{/snippet}

{#snippet themeToggle(extraClass: string)}
    <span class="{extraClass} whitespace-nowrap">
        <button onclick={() => setTheme(false)} aria-label="light mode"
            class="theme-toggle theme-toggle-light hover:text-blue-500 transition-colors duration-200">
            <i class="fa-solid fa-sun"></i>
        </button>
        /
        <button onclick={() => setTheme(true)} aria-label="dark mode"
            class="theme-toggle theme-toggle-dark hover:text-blue-500 transition-colors duration-200">
            <i class="fa-solid fa-moon"></i>
        </button>
    </span>
{/snippet}

<div class="mt-20 xl:mt-24">

    <!-- The bar and its dropdown are one landmark. `max-h-dvh` plus `flex-col` lets the
         dropdown take whatever is left below the bar and scroll inside it, so a short
         landscape-phone viewport can still reach the bottom items. -->
    <nav aria-label="Main" class="fixed top-0 left-0 right-0 z-10 flex flex-col max-h-dvh">

        <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center shrink-0 py-4 bg-gray-700/80 dark:bg-gray-900/80 backdrop-blur-md w-full">

            <!-- Left -->
            <div class="flex items-center pl-4">
                <a class="cursor-pointer" href={`${base}/`} onclick={() => (open = false)}>
                    <img class="h-10 object-cover" src={logo} alt="a self portrait doodled in my moleskin">
                </a>
            </div>

            <!-- Middle: centered against the full nav width, not just the space between Left and Right -->
            <div class="flex items-center justify-center px-2">
                <a class="text-gray-200 cursor-pointer text-lg xl:text-2xl whitespace-nowrap"
                    href={`${base}/`} onclick={() => (open = false)}>
                    Helen Eleonora Thomas
                </a>
            </div>

            <!-- Right (desktop) -->
            <div class="hidden xl:flex items-center justify-end space-x-5 text-gray-300 pr-4">
                {@render pageLinks()}
                {@render contactLinks(false)}
                {@render themeToggle('pl-5')}
            </div>

            <!-- Hamburger (below xl). Placed in column 3, the same cell as the desktop
                 links above, so it inherits the grid's vertical centring. `justify-self-end`
                 shrinks it to its own box: stretched across the whole column it would take
                 clicks far from the icon, and show a focus ring a third of the bar wide.
                 `p-3` then buys back a 44px touch target around the 17px glyph, and the
                 matching `mr-1` leaves the icon optically where `mr-4` alone put it. -->
            <button onclick={() => (open = !open)} aria-expanded={open} aria-label="Navigation menu"
                class="col-start-3 row-start-1 flex xl:hidden items-center justify-self-end p-3 mr-1 text-gray-300 hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                <i class="fa-solid {open ? 'fa-xmark' : 'fa-bars'} text-xl"></i>
            </button>
        </div>

        {#if open}
            <div class="flex xl:hidden flex-col items-center space-y-4 py-4 overflow-y-auto min-h-0 bg-gray-700/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-300">
                {@render pageLinks()}
                {@render contactLinks(true)}
                {@render themeToggle('')}
            </div>
        {/if}
    </nav>
</div>
