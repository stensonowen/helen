<script lang="ts">
    import Contents from '$lib/contents.svelte'
</script>

<div class="container mx-auto flex flex-col xl:flex-row">

    <Contents sections={[{ id: 'ctwg', label: 'The Critical Theory Working Group' }]} />

    <!-- Content -->
    <div class="w-full xl:w-auto xl:ml-72
        text-gray-600 dark:text-gray-300">
        <!-- CTWG -->
        <div id="ctwg" class="section">
            <h2> The Critical Theory Working Group </h2>
            <p class="text-xl pb-1 dark:text-gray-200">
                In addition to my academic commitments, I am a member of the editorial board of the Critical Theory Working Group (CTWG). The CTWG is a collective of researchers dedicated to providing resources and open reading groups for collective study of early Critical Theory.

                We publish a journal on the topic titled <i>Margin Notes,</i> as well as 
                    <a class="text-blue-700 hover:underline" href="https://rss.com/podcasts/critique-of-the-podcast-form/"
                    >host a podcast on the topic</a> entitled <i>Critique of the Podcast Form.</i>

                For more information, please visit the CTWG
                <span class="text-xl py-1">
                    <a class="text-blue-700 hover:underline" href="https://ctwgwebsite.github.io"
                    >website</a>.
                </span>
            </p>
            <p class="text-xl py-1">
                We are a volunteer-run organization, and hence all our work is done <i>pro bono</i>. If you are interested in supporting our work, consider donating to the CTWG
                <span class="text-xl py-1">
                    <a class="text-blue-700 hover:underline" href="https://www.patreon.com/crittheoryworkgroup"
                    >Patreon</a>.
                </span>
            </p>
        </div>
    </div>
</div>
