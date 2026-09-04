<script lang="ts">
    import Contents from '$lib/contents.svelte'
    import photo from '../../assets/HelenE-480.webp'
</script>

<div class="container mx-auto flex flex-col xl:flex-row">

    <Contents sections={[{ id: 'about', label: 'About' }]} />

    <!-- Content -->
    <div class="w-full xl:w-auto xl:ml-72
        text-gray-600 dark:text-gray-300">
        <!-- ABOUT -->
        <div id="about" class="section">
            <h2> About Me </h2>
            <img class="mb-4" src={photo} alt="a transsexual shorty" />
            <p class="text-xl pb-1 dark:text-gray-200">
                I go by Helen around friends and Thomas around state apparatchiks, authority figures, and the like.

                I am a PhD student and Graduate TA at the
                <a class="text-blue-700 hover:underline" href="https://philosophy.arizona.edu/person/samuel-thomas"
                >University of Arizona</a>,
                as well as an adjunct in Political Science at <a class="text-blue-700 hover:underline" href="https://www.pima.edu/"
                >Pima Community College</a>.
            </p>
            <p class="text-xl py-1 dark:text-gray-200">
                My main areas of study are in political philosophy and 19th century philosophy. I additionally have areas of concentration in environmental ethics, critical theory, and philosophy of law.
            </p> 
            <p class="text-xl py-1">           
                My dissertation concerns what to do about democratic backsliding: that is, the process whereby a democratic society becomes authoritarian. To answer this, one must first answer the question of what the value of democracy is, as well as the causes of backsliding. To that end, the dissertation will decidedly be a monograph since the topic deserves careful and elongated exposition.
            </p> 
            <p class="text-xl py-1">
                In 19th century philosophy, I am mainly interested in the speculative and historical materialist methodologies of Hegel and Marx, respectively, and how such methods of philosophical analysis motivate these thinkers’ substantive political views. Of particular interest here is how later thinkers (e.g., the so-called Frankfurt School) use such methods of philosophical analysis to inform their critiques of everyday life. 
            </p> 
            <p class="text-xl py-1">
                In environmental ethics, I am concerned about how economic arrangements affect public environmental goods. The (mis)management of the Colorado River is one area of import for me as I am a lifelong Arizonan. I am also interested in debates around to what extent we should grant rights or socialize the natural world to deal with the effects of climate change.
            </p> 
            <p class="text-xl py-1">
                My MA thesis, gained from Arizona State University in 2021, concerned legal epistemology, specifically how judges and juries should evaluate different types of evidence. This thesis covered topics in philosophy of law, epistemology, and philosophy of language to give an account of individualized evidence as qualitatively different from bare statistical evidence. However, as the previous paragraphs indicate, my main areas of study have shifted since arriving at the University of Arizona in Fall 2022.
            </p> 
            <p class="text-xl py-1">
                Aside from my academic commitments, I am part of the Editorial Board for the
                <a class="text-blue-700 hover:underline" href="https://ctwgwebsite.github.io"
                >Critical Theory Working Group</a>, 
                and a <a class="text-blue-700 hover:underline" href="https://burialmask13.bandcamp.com/"
                >musician of sorts</a>.
            </p>
        </div>
    </div>
</div>
