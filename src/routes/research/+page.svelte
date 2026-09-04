<script lang="ts">
    import Card from '$lib/card.svelte'
    import Contents from '$lib/contents.svelte'
</script>

<div class="container mx-auto flex flex-col xl:flex-row">

    <Contents sections={[
        { id: 'publications_academic', label: 'Academic Publications' },
        { id: 'publications_public', label: 'Public Philosophy' },
        { id: 'wip', label: 'Works in Progress' },
    ]} />

    <!-- Content -->
    <div class="w-full xl:w-auto xl:ml-72
        text-gray-600 dark:text-gray-300">

        <!-- PUBLICATIONS -->
        <div id="publications_academic" class="section">
            <h2> Academic Publications </h2>
            <Card
                publisher="MA Thesis"
                title="De Re Beliefs and Evidence in Legal Cases"
                link="https://philpapers.org/rec/THODRB"
                date="2021"
                text="For the past half-century, both jurisprudence and epistemology have been haunted by questions about why individual evidence (i.e., evidence which picks out a specific individual) can sufficiently justify a guilty or liable verdict while bare statistical evidence (i.e., statistical evidence which does not pick out a specific individual) does not sufficiently justify such a verdict. This thesis examines three popular justifications for such a disparity in verdicts – Judith Jarvis Thomson’s causal account, Enoch et al.’s sensitivity account, and Sarah Moss’ knowledge-first account, before critiquing each in turn. After such an analysis, the thesis then defends the claim that legal verdicts require the factfinder (e.g., the judge or jury) to have a justified de re belief (i.e., a belief about a specific object – namely the defendant), and that this doxastic requirement justifies the disparity in rulings, as it is epistemically insufficient to justify a de re belief based on bare statistical evidence alone. A brief account of how these beliefs are formed and spread is also given. After making such a distinction, the thesis then formalizes the burdens of proof of the preponderance of the evidence and beyond a reasonable doubt using the de re/de dicto distinction. Finally, the thesis pre-empts possible objections, namely by providing an account of DNA evidence as individual evidence and giving an account of how false convictions can occur on the de re view of legal proof."
            />
        </div>

        <!-- PUBLIC PUBLICATIONS -->
        <div id="publications_public" class="section">
            <h2> Public Philosophy </h2>
            Works of mine which lie outside the ivory tower.

            <Card
                publisher="Margin Notes"
                title="On the Falsity of Prevailing Ideas: The Concept of Ideology in Early Critical Theory"
                link="https://ctwgwebsite.github.io/projects/1_project/"
                date="Fall 2024"
                text="Margin Notes is the journal of the Critical Theory Working Group, of which I am a member. For more information, please see the CTWG tab."
                pdf="https://ctwgwebsite.github.io/assets/pdf/journal/Margin_notes_1_final_full.pdf"
                creativecommons="fa-creative-commons-by"
            />
            <Card
                publisher="Cosmonaut Mag"
                title="The Machiavellian State, Fascism, and the Tribune of the Proletariat"
                link="https://cosmonautmag.com/2022/04/the-machiavellian-state-fascism-and-the-tribune-of-the-proletariat/"
                date="29 April 2022"
                text="How Machiavelli can help us understand the bourgeois nature of fascism, and how anti-fascism must empower the proletariat"
                audio
            />
            <Card
                publisher="Diginativ"
                title="Spinoza with a Beard: Spinoza’s Influence on Marxism"
                link="https://diginativ.com/spinoza-with-a-beard-spinozas-influence-on-marxism/"
                date="5 May 2018 (the 200th birthday of Herr Marx)"
                text="The purpose of this essay is to analyze the effect Spinoza’s insights have had on Marxism. Thus, it will ignore similar but unrelated questions. It will not analyze the current of thinkers who came after Marx’s death who drew upon both Spinoza and Marx to form a new line of thought. This paper will not touch on the personal lives of the two men. The fact that Spinoza was a lens grinder or that Marx was a newspaper editor does not affect the argument. This paper will not touch on the points of difference between the two. The fact that two thinkers differ on a certain point does not entail that one cannot have influenced the other."
            />
        </div>
        <div id="wip" class="section">
            <h2> Works in Progress </h2>
            <Card
                title="Untitled Paper on Marx and Ideology"
                text="Title redacted for purposes of review."
            />
            <Card
                title="Paper on Democratic Backsliding and Stability"
                text="Title redacted for purposes of review."
            />
            <Card
                title="Untitled Paper on Backsliding and Labor Unions"
                text="Title redacted for purposes of review."
            />
        </div>
    </div>
</div>

