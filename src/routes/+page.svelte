<script lang="ts">
    import { base } from '$app/paths';
    import portrait from '../assets/GWX.jpg'
</script>

<div class="container mx-auto">
    <div class="w-full lg:w-2/3 lg:mx-auto text-gray-600 dark:text-gray-300">

        <!-- ABOUT -->
        <div id="about" class="section">
            <img class="w-1/5 float-left mr-4 mb-4 rounded-lg" src={portrait} alt="Playing the bass" />
            <h2> About Helen </h2>
            <p class="text-xl pb-1 dark:text-gray-200">
                PhD student and Graduate TA at the
                <a class="text-blue-700 hover:underline" href="https://philosophy.arizona.edu/person/samuel-thomas"
                >University of Arizona</a>,
                and an adjunct in Political Science at <a class="text-blue-700 hover:underline" href="https://www.pima.edu/"
                >Pima Community College</a>.
                My main areas of study are in political philosophy and 19th century philosophy. I additionally have areas of concentration in environmental ethics, critical theory, and philosophy of law.
            </p>
        </div>

        <!-- EXPLORE -->
        <div id="explore" class="section">
            <h2> Explore </h2>
            <ul class="text-xl space-y-2 list-disc list-inside">
                <li><a class="text-blue-700 hover:underline" href={`${base}/about`}>Full bio</a></li>
                <li><a class="text-blue-700 hover:underline" href={`${base}/research`}>Publications and works in progress</a></li>
                <li><a class="text-blue-700 hover:underline" href={`${base}/teaching`}>Teaching</a></li>
                <li><a class="text-blue-700 hover:underline" href={`${base}/ctwg`}>Critical Theory Working Group</a></li>
            </ul>
        </div>
    </div>
</div>
