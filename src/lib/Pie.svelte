<script>
  import * as d3 from "d3";

  // Define arcData and arcs outside the reactive block
  let arcData;
  let arcs;

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  //   let arc = arcGenerator({
  //     startAngle: 0,
  //     endAngle: 2 * Math.PI,
  //   });
  export let data = [];
  let sliceGenerator = d3.pie().value((d) => d.value);
  $: {
    // Reactively calculate arcData and arcs the same way we did before with sliceGenerator and arcGenerator
    arcData = sliceGenerator(data);
    arcs = arcData.map((d) => arcGenerator(d));
  }
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  export let selectedIndex = -1;
</script>

<div class="container">
  <svg viewBox="-50 -50 100 100">
    {#each arcs as arc, index}
      <path
        d={arc}
        fill={colors(index)}
        class:selected={selectedIndex === index}
        on:click={(e) => (selectedIndex = selectedIndex === index ? -1 : index)}
      />
    {/each}
  </svg>
  <ul class="legend">
    {#each data as d, index}
      <li style="--color: {colors(index)}">
        <span class="swatch"></span>
        {d.label} <em>({d.value})</em>
      </li>
    {/each}
  </ul>
</div>

<style>
  svg:has(path:hover) path:not(:hover) {
    opacity: 50%;
  }

  path {
    transition: 300ms;
  }

  .selected {
    --color: oklch(60% 45% 0) !important;

    &:is(path) {
      fill: var(--color);
    }
  }

  svg {
    max-width: 20em;
    margin-block: 2em;

    /* Do not clip shapes outside the viewBox */
    overflow: visible;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
    gap: 1rem;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend {
    border: 1px solid black;
    padding: 0.2rem;
    margin: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .swatch {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-color: var(--color);
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
