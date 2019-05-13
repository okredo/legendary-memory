async function drawScatter() {
  // Step 1.
  const dataset = await d3.json("./my_weather.json");

  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;

  // Step 2.
  let cfg = {
    // scatterplots are easier to read if they're square
    width: 400,
    height: 400,
    margin: {
      top: 50,
      right: 10,
      bottom: 50,
      left: 50
    }
  };

  cfg.boundedWidth = cfg.width - cfg.margin.left - cfg.margin.right;
  cfg.boundedHeight = cfg.height - cfg.margin.top - cfg.margin.bottom;

  // Step 3.
  const wrapper = d3
    .select("#chart")
    .html("") // clear
    .append("svg")
    .attr("width", cfg.width)
    .attr("height", cfg.height);

  const bounds = wrapper
    .append("g")
    .style("transform", `translate(${cfg.margin.left}px, ${cfg.margin.top}px)`);

  // Step 4.
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, cfg.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([cfg.boundedHeight, 0])
    .nice();

  // Step 5.
  const dots = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 3)
    .attr("fill", d => "cornflowerblue");

  // Step 6.
  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .ticks(5);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${cfg.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", cfg.boundedWidth / 2)
    .attr("y", cfg.margin.bottom - 12)
    .html("dew point (&deg;F)");

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .ticks(5);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -cfg.boundedHeight / 2)
    .attr("y", -cfg.margin.left + 14)
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .text("relative humidity");
}
drawScatter();
