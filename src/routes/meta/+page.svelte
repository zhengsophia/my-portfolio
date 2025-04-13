<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import Bar from "$lib/Bar.svelte";
  import FileLines from "./FileLines.svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  import Scrolly from "svelte-scrolly";
  import StackedBar from "../../lib/StackedBar.svelte";

  let data = [];
  let commits = [];
  let max_depth = 0;
  let avg_depth = 0;

  onMount(async () => {
    data = await d3.csv("/loc.csv", (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime),
    }));

    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: "https://github.com/vis-society/lab-7/commit/" + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };

        // Like ret.lines = lines
        // but non-enumerable so it doesn’t show up in JSON.stringify
        Object.defineProperty(ret, "lines", {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });

        return ret;
      });

    commits = commits.filter((commit) => !/^0+$/.test(commit.id));

    max_depth = d3.max(filteredLines, (d) => d.depth);
    avg_depth = d3.mean(filteredLines, (d) => d.depth);
  });

  let width = 1000,
    height = 600;

  let margin = { top: 10, right: 10, bottom: 30, left: 20 };

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  $: minDate = d3.min(commits.map((d) => d.date));
  $: maxDate = d3.max(commits.map((d) => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  let commitProgress = 100;

  $: timeScale = d3
    .scaleTime()
    .domain([minDate, maxDatePlusOne])
    .range([0, 100])
    .nice();

  $: commitMaxTime = timeScale.invert(commitProgress);
  $: timeFilterLabel = commitMaxTime.toLocaleString("en", {
    dateStyle: "long",
    timeStyle: "short",
  });

  $: filteredCommits = commits.filter(
    (commit) => commit.datetime <= commitMaxTime
  );
  $: filteredLines = data.filter((data) => data.datetime <= commitMaxTime);

  let linesCommitProgress = 100;

  $: linesCommitMaxTime = timeScale.invert(linesCommitProgress);

  $: linesFilteredCommits = commits.filter(
    (commit) => commit.datetime <= linesCommitMaxTime
  );
  $: linesFilteredLines = data.filter(
    (data) => data.datetime <= linesCommitMaxTime
  );

  $: filteredMinDate = d3.min(filteredCommits.map((d) => d.date));
  $: filteredMaxDate = d3.max(filteredCommits.map((d) => d.date));
  $: filteredMaxDatePlusOne = new Date(filteredMaxDate);
  $: filteredMaxDatePlusOne.setDate(filteredMaxDatePlusOne.getDate() + 1);

  $: xScale = d3
    .scaleTime()
    .domain([filteredMinDate, filteredMaxDatePlusOne])
    .range([usableArea.left, usableArea.right])
    .nice();

  $: yScale = d3
    .scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);

  let xAxis, yAxis, yAxisGridlines;

  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale));
    d3.select(yAxis).call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
    );
  }

  $: {
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width)
    );
  }

  let hoveredIndex = -1;
  $: hoveredCommit = filteredCommits[hoveredIndex] ?? hoveredCommit ?? {};

  let cursor = { x: 0, y: 0 };

  let clickedCommits = [];

  async function dotInteraction(index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      cursor = { x: evt.x, y: evt.y };
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement(), // see https://floating-ui.com/docs/autoplacement
        ],
      });
    } else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    } else if (evt.type === "click") {
      let commit = commits[index];
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      } else {
        // Remove the commit from the array
        clickedCommits = clickedCommits.filter((c) => c !== commit);
      }
    }
  }

  $: allTypes = Array.from(new Set(data.map((d) => d.type)));
  $: selectedLines = (
    filteredCommits.length > 0 ? filteredCommits : commits
  ).flatMap((d) => d.lines);
  $: selectedCounts = d3.rollup(
    selectedLines,
    (v) => v.length,
    (d) => d.type
  );
  $: languageBreakdown = allTypes.map((type) => [
    type,
    selectedCounts.get(type) || 0,
  ]);

  let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
</script>

<p>Total lines of code: {data.length}</p>

<dl class="stats">
  <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
  <dd>{data.length}</dd>
  <dd>{max_depth}</dd>
  <dd>{avg_depth}</dd>
</dl>

<h3>Commits by time of day</h3>

<!-- lab 9 -->

<div class="slider-container">
  <div class="slider-row">
    <label for="time-slider">
      Filter by time:

      <input
        type="range"
        id="time-slider"
        min="0"
        max={commitMaxTime}
        bind:value={commitProgress}
      />
      <time datetime="20:00">{timeFilterLabel}</time>
    </label>
  </div>
</div>

<Scrolly bind:progress={commitProgress} --scrolly-viz-width="3fr">
  <!-- Story here -->
  {#each commits as commit, index}
    <p>
      On {commit.datetime.toLocaleString("en", {
        dateStyle: "full",
        timeStyle: "short",
      })},
      {index === 0
        ? "I set forth on my very first commit, beginning a magical journey of code. You can view it "
        : "I added another enchanted commit, each line sparkling with a touch of wonder. See it "}
      <a href={commit.url} target="_blank">
        {index === 0 ? "here" : "here"}
      </a>. This update transformed {commit.totalLines} lines across {d3.rollups(
        commit.lines,
        (D) => D.length,
        (d) => d.file
      ).length} files. With every commit, our project grows into a kingdom of dreams.
    </p>
  {/each}

  <svelte:fragment slot="viz">
    <!-- Visualizations here -->
    <svg viewBox="0 0 {width} {height}">
      <g
        class="gridlines"
        transform="translate({usableArea.left}, 0)"
        bind:this={yAxisGridlines}
      />
      <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
      <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
      <g class="dots">
        {#each filteredCommits as commit, index (commit.id)}
          <circle
            class:selected={clickedCommits.includes(commit)}
            on:mouseenter={(evt) => dotInteraction(index, evt)}
            on:mouseleave={(evt) => dotInteraction(index, evt)}
            on:click={(evt) => dotInteraction(index, evt)}
            cx={xScale(commit.datetime)}
            cy={yScale(commit.hourFrac)}
            r="5"
            fill="steelblue"
          />
        {/each}
      </g>
    </svg>

    <StackedBar data={languageBreakdown} width={0.4} {colorScale} />

    <dl
      class="info tooltip"
      hidden={hoveredIndex === -1}
      style="top: {cursor.y}px; left: {cursor.x}px"
    >
      <dt>Commit</dt>
      <dd>
        <a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a>
      </dd>

      <dt>Date</dt>
      <dd>
        {hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}
      </dd>

      <!-- Add: Time, author, lines edited -->
    </dl>
  </svelte:fragment>
</Scrolly>

<Scrolly bind:progress={linesCommitProgress} --scrolly-layout="viz-first">
  <!-- Story here -->
  {#each commits as commit, index}
    <p>
      On {commit.datetime.toLocaleString("en", {
        dateStyle: "full",
        timeStyle: "short",
      })},
      {index === 0
        ? "I set forth on my very first commit, beginning a magical journey of code. You can view it "
        : "I added another enchanted commit, each line sparkling with a touch of wonder. See it "}
      <a href={commit.url} target="_blank">
        {index === 0 ? "here" : "here"}
      </a>. This update transformed {commit.totalLines} lines across {d3.rollups(
        commit.lines,
        (D) => D.length,
        (d) => d.file
      ).length} files. With every commit, our project grows into a kingdom of dreams.
    </p>
  {/each}

  <svelte:fragment slot="viz">
    <!-- Visualizations here -->

    <FileLines
      lines={linesFilteredLines}
      {width}
      svgWidth={0.8 * width}
      {colorScale}
    />

    <dl
      class="info tooltip"
      hidden={hoveredIndex === -1}
      style="top: {cursor.y}px; left: {cursor.x}px"
    >
      <dt>Commit</dt>
      <dd>
        <a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a>
      </dd>

      <dt>Date</dt>
      <dd>
        {hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}
      </dd>

      <!-- Add: Time, author, lines edited -->
    </dl>
  </svelte:fragment>
</Scrolly>

<style>
  :global(body) {
    max-width: min(120ch, 80vw);
  }

  svg {
    overflow: visible;
  }

  .gridlines {
    stroke-opacity: 0.2;
  }

  circle {
    transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;

    &:hover {
      transform: scale(1.5);
    }

    @starting-style {
      r: 0;
    }
  }

  dl.info {
    /* ... other styles ... */
    background-color: oklch(100% 0% 0/80%);

    transition-duration: 500ms;
    transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  .selected {
    fill: var(--color-accent);
  }

  .slider-container {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    max-width: 500px;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .slider {
    flex: 1;
  }

  time {
    font-size: 0.9rem;
    color: #333;
  }
</style>
