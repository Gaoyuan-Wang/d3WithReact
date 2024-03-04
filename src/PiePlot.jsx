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

function drawPieChart(data) {
    var sum = 0;
    for (const [key, value] of Object.entries(data)) {
        sum += value;
    }

    const width = 800,
        height = 800,
        margin = 150;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("body")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);


    const color = d3.scaleOrdinal()
    .range(d3.schemeDark2)

    const pie = d3.pie()
    .value(function(d) {return d[1]})
    const data_ready = pie(Object.entries(data))

    var arcGenerator = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8)

    svg
    .selectAll('whatever')
    .data(data_ready)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[1])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    // svg
    // .selectAll('mySlices')
    // .data(data_ready)
    // .join('text')
    // .text(function(d){ return d.data[0] + ':' + String(Math.round((d.data[1] / sum * 100000)/1000.00).toFixed(2)) + '%'})
    // .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
    // .style("text-anchor", "middle")
    // .style("font-size", 10)

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    svg.selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
            const posA = arcGenerator.centroid(d)
            const posB = outerArc.centroid(d)
            const posC = outerArc.centroid(d)
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
            return [posA, posB, posC]
        })

    svg.selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0] + ': ' + String((d.data[1] / sum * 100).toFixed(2)) + '%')
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
}


export default function Chart3() {
    var acc = {};
    acc['SmallBags'] = 0;
    acc['LargeBags'] = 0;
    acc['XLargeBags'] = 0;
    loadData().then((data) => {
        var count = data.forEach((d) => {
            //console.log(Number(d.LargeBags));
            if(!isNaN(parseFloat(d.SmallBags))){
                acc['SmallBags'] += parseFloat(d.SmallBags);
            }
            if(!isNaN(parseFloat(d.LargeBags))){
                acc['LargeBags'] += parseFloat(d.LargeBags);
            }
            if(!isNaN(parseFloat(d.XLargeBags))){
                acc['XLargeBags'] += parseFloat(d.XLargeBags);
            }
    })
    drawPieChart(acc);
    return data[0];
  });
  
  return (
    <div>
    </div>
  )
}