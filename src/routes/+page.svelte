<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
</script>

<svelte:head>
  <title>Sophia's Portfolio</title>
</svelte:head>
<h1>Sophia Zheng</h1>
<p>Hi! Excited to work with you all this semester.</p>
<img src="./images/kirby.jpg" alt="This is Kirby sitting." />
<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>
