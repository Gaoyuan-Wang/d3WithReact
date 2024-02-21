import * as d3 from "d3";
//import { useState } from "react";

async function loadData() {
  var fileFath = "data/Avocado_HassAvocadoBoard_20152023v1.0.1.csv"
  const data = await d3.csv(fileFath);
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


function drawBarChart(data) {
  const width = 680;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

  const xAxis = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.AveragePrice)])
    .range([marginLeft, width - marginRight]);

  const x = d3.scaleBand()
  .range([marginLeft, width - marginRight])
  .domain(data.map(d => d.AveragePrice))
  .padding(0);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([height - marginBottom, marginTop]);

    // Add the x-axis.
  svg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(xAxis))
//   .selectAll("text")
//   .attr("transform", "translate(-10,0)rotate(-90)")
//   .style("text-anchor", "end");

  // Add the y-axis.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => x(d.AveragePrice))
  .attr("y", d => y(d.count))
  .attr("width", x.bandwidth())
  .attr("height", d => height - marginBottom - y(d.count))
  .attr("fill", "steelblue");

}

export default function Chart2() {
  loadData().then((data) => {
    var count = data.reduce((acc, d) => {
      acc[d.AveragePrice] = (acc[d.AveragePrice] || 0) + 1;
      return acc;
    }, {});
    var sortedKeys = Object.keys(count).sort((a, b) => Number(a) - Number(b));
    var sortedObj = [];
    sortedKeys.forEach(key => {
      sortedObj.push({AveragePrice: key, count: count[key]});
    });
    sortedObj = sortedObj.filter(d => d.count > 1);
    drawBarChart(sortedObj);
    return data[0];
  });
  
  return (
    <div>
    </div>
  )
}