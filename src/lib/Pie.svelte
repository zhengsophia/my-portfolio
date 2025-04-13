<script>
  import * as d3 from "d3";

  // Define arcData and arcs outside the reactive block
  let arcData;
  let arcs;
  let liveText = "";

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
  $: description = `A pie chart showing project counts by year. ${data.map((d) => `${d.label}: ${d.value} projects`).join(", ")}.`;

  let colors = d3.scaleQuantize().range(d3.schemeBlues[5]);
  export let selectedIndex = -1;

  function toggleWedge(index, event) {
    if (!event.key || event.key === "Enter") {
      selectedIndex = index;
      const d = data[index];
      liveText = `${d.label}: ${d.value} projects selected.`;
    }
  }
</script>

<div class="container">
  <svg
    viewBox="-50 -50 100 100"
    role="img"
    aria-labelledby="pie-title pie-desc"
  >
    <title id="pie-title">Projects by Year</title>
    <desc id="pie-desc">{description}</desc>
    <circle class="pie-outline" r="50" />
    {#each arcs as arc, index}
      <path
        d={arc}
        fill={colors(index)}
        class:selected={selectedIndex === index}
        on:click={(e) => toggleWedge(index, e)}
        on:keydown={(e) => toggleWedge(index, e)}
        tabindex="0"
        role="button"
        aria-label="Pie Chart"
      />
    {/each}
  </svg>
  <p aria-live="polite" class="sr-only">{liveText}</p>
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
  .pie-outline {
    stroke: black;
    fill: none;
    stroke-width: 1;
  }

  path:focus-visible {
    stroke: white;
    stroke-width: 2px;
    stroke-dasharray: 4; /* Adjust the dash length as needed */
  }

  svg:hover path:not(:hover),
  svg:focus-visible path:not(:focus-visible) {
    opacity: 50%;
  }

  path {
    transition: 300ms;
    outline: none;
  }

  .selected {
    --color: oklch(60% 45% 0) !important;

    &:is(path) {
      fill: var(--color);
    }
  }

  .sr-only {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
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
