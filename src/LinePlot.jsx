import * as d3 from "d3";
import { useState } from "react";

async function loadData() {
  var fileFath = "data/test.csv"
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

function drawChart(data) {
  const width = 600;
  const height = 400;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    
  // 创建一个g 当后面元素的group容器，移到（30，30）的位置
  // 定义上下左右边距给坐标轴文字距离
  const m = { top: 30, right: 30, bottom: 30, left: 30 };
  const g = svg.append("g").attr("transform", "translate(30, 30)");
  
  // 实际我们图的高度宽度
  const gW = width - m.left;
  const gH = height - m.top - m.bottom;

  // 定义x坐标轴的比例尺，gW为x轴的宽度，关于scaleBand参考上一篇文章以及相关文章
  // 这里我们会得到一个xScale.bandwidth()的距离，bandwidth()访问每个波段的宽度：
  const xScale = d3.scaleTime().range([0, gW]);
     
  // 定义好x轴定义域，画出x轴axisBottom，底部位置，year是值
  xScale.domain(data.map(item => new Date(item.Date)));
 
  g.append("g")
  .attr("transform", `translate(0, ${gH})`)
  .call(d3.axisBottom(xScale))
  .attr("stroke", "red");
    // 定义y坐标轴的比例尺，gH为y轴的宽度
  const yScale = d3.scaleLinear().range([gH, 0]);
 
  // 定义好y轴d定义域，画出y轴，y轴画在左边axisLeft，value是值
 
  yScale.domain([0, d3.max(data, item => item.AveragePrice)]);
 
  g.append("g")
  .call(d3.axisLeft(yScale))
  .attr("stroke", "red");
  // 先给点画上小圆圈和文字，创建一个文字和圆圈的group
  // join那句可以改为以前v4写法.enter().append('circle')

  const group1 = g.selectAll(".group-circle-text")
  .data(data)
  .join("g")
  .attr("class", "group-circle-text");

  // 画出圆点即是圆圈，xScale.bandwidth()就用到了,bandwidth()访问每个波段的宽度,
  // xScale.bandwidth() / 2 我们把元素位置居中

  group1.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => {
    return xScale(new Date(d.Date));
  })
  .attr("cy", d => {
    return yScale(d.AveragePrice);
  }).attr("r", 3)
  .attr("fill", "red");
   
   
  // 绘制出文字
	
  // group1.selectAll("text")
  // .data(data)
  // .join("text")
  // .attr("x", d => {
  //   return xScale(d.Date) + xScale.bandwidth() / 2;
  // })
  // .attr("y", d => yScale(d.AveragePrice) - 2)
  // .text(d => d.AveragePrice);

  // 创建一个line的生成器 用d3.line,把所有点连起来
	const line = d3.line().x(d => {
    // 这里是d3.scaleBand自带比例尺
    return xScale(new Date(d.Date));
  }).y(d => {
    return yScale(d.value);
  }).curve(d3.curveCatmullRom);  //这里有多种形态可以选择

  g.append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "purple");
}

export default function Chart1() {
  const [dataset, setState] = useState([]);
  var datas
  loadData().then((data) => {
    datas = data
    setState(JSON.stringify(data[0]));
    //console.log(data)
    drawChart(data);
    return data[0];
  });
  //drawChart(datas);
  return (
    <div>
      {dataset}
    </div>
  )
}