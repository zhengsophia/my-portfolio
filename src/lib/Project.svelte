<script>
  export let data = {};
  export let hLevel = 2;
</script>

<article>
  <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
  <img src={data.image} alt="" />
  <div>
    <p>{data.description}</p>
    <p>{data.year}</p>
  </div>
</article>

<style>
  img {
    max-width: 100%;
  }

  article {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
  }

  article h2 {
    margin: 0;
  }
</style>
