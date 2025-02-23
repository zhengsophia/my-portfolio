<script>
  import { page } from "$app/stores";
  import "../style.css";
  let pages = [
    { url: "/", title: "Home" },
    { url: "/projects", title: "Projects" },
    { url: "/contact", title: "Contact" },
    { url: "/resume", title: "Resume" },
    { url: "https://github.com/zhengsophia", title: "GitHub" },
  ];
</script>

<nav>
  {#each pages as p}
    <a
      href={p.url}
      class:current={$page.route.id === p.url}
      target={p.url.startsWith("http") ? "_blank" : null}
    >
      {p.title}
    </a>
  {/each}
</nav>
<slot />

<style>
  nav ul {
    display: contents;
  }

  nav li {
    display: contents;
  }

  nav {
    --border-color: oklch(50% 10% 200 / 40%);
    display: flex;
    text-align: center;
    margin-bottom: 15px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--border-color);
  }

  nav a {
    flex: 1;
    text-decoration: none;
    color: inherit;
    padding: 0.5em;
  }

  nav a.current {
    border-bottom-width: 0.4em;
    border-bottom-style: solid;
    border-bottom-color: var(--border-color);
    padding-bottom: calc(10px - 0.4em);
  }

  nav a:hover {
    background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
    border-bottom: 0.4em solid var(--color-accent);
    border-bottom-width: 0.4em;
    border-bottom-style: solid;
    padding-bottom: calc(10px - 0.4em);
  }
</style>
