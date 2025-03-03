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

{#await fetch("https://api.github.com/users/zhengsophia")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
        <dt>Followers:</dt>
        <dd>{data.followers}</dd>
        <dt>Following:</dt>
        <dd>{data.following}</dd>
        <dt>Public Repositories:</dt>
        <dd>{data.public_repos}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>
