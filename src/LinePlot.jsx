import * as d3 from "d3";
//import { useState } from "react";

async function loadData() {
  var fileFath = "data/Avocado_HassAvocadoBoard_20152023v1.0.1.csv"
  const data = await d3.csv(fileFath);
  //console.log(data);
  return data
}

// [{
//   Date : data[0].Date,
//   AveragePrice : data[0].AveragePrice,
//   TotalVolume : data[0].TotalVolume,
//   plu4046 : data[0].plu4046,
//   plu4225 : data[0].plu4225,
//   plu4770 : data[0].plu4770,
//   TotalBags : data[0].TotalBags,
//   SmallBags : data[0].SmallBags,
//   LargeBags : data[0].LargeBags,
//   XLargeBags : data[0].XLargeBags,
//   type : data[0].type,
//   region : data[0].region,
// }]

function drawChart(data) {
  // const width = 800;
  // const height = 600;
  // const marginTop = 20;
  // const marginRight = 20;
  // const marginBottom = 30;
  // const marginLeft = 40;

  // const svg = d3.select("body").append("svg")
  // .attr("width", width)
  // .attr("height", height);

  // const x = d3.scaleUtc()
  //   .domain(d3.extent(data, d => new Date(d.Date)))
  //   .range([marginLeft, width - marginRight]);

  // const y = d3.scaleLinear()
  //   .domain([0, d3.max(data, d => d.AveragePrice)])
  //   .range([height - marginBottom, marginTop]);

  //   // Add the x-axis.
  // svg.append("g")
  // .attr("transform", `translate(0,${height - marginBottom})`)
  // .call(d3.axisBottom(x));

  // // Add the y-axis.
  // svg.append("g")
  //   .attr("transform", `translate(${marginLeft},0)`)
  //   .call(d3.axisLeft(y));

  // // Add the line.

  // // Declare the line generator.
  // const line = d3.line()
  //     .x(d => x(new Date(d.Date)))
  //     .y(d => y(d.AveragePrice));

  // svg.append("path")
  // .attr("fill", "none")
  // .attr("stroke", "steelblue")
  // .attr("stroke-width", 1.5)
  // .attr("d", line(data));

// set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 860 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.region); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleUtc()
  .domain(d3.extent(data, d => new Date(d.Date)))
  .range([ 0, width ]);
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.AveragePrice)])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
  .range(['#e41a1c','#377eb8'])

  // Draw the line
  svg.selectAll(".line")
    .data(sumstat)
    .join("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d[0]) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(new Date(d.Date)); })
          .y(function(d) { return y(+d.AveragePrice); })
          (d[1])
      })

}

export default function Chart1() {
  loadData().then((data) => {
    var b1 = data.filter(d => (d.region === "Chicago" || d.region === "Atlanta") && d.type === "conventional");
    var b2 = data.filter(d => (d.region === "Chicago" || d.region === "Atlanta") && d.type === "organic");
    drawChart(b1);
    drawChart(b2);
    return data[0];
  });
  
  return (
    <div>
    </div>
  )
}