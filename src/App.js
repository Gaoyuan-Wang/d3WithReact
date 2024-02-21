import * as d3 from "d3";
import { useState } from "react";
//import Chart2 from "./line";
import Chart2 from "./BarPlot";
import Chart1 from "./LinePlot";

export default function App() {
  console.log("App");
  return (
    <div>
      <Chart2/>
      <Chart1/>
    </div>
  );
}