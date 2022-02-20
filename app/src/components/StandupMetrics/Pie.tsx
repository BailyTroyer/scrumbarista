import React from "react";

import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";

const data = [{ name: "%", value: 88 }];
const dataDummy = [{ name: "", value: 100 }];

const COLORS = ["#4bf490", "#434f64"];

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text
        className="text-value"
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize="30px"
        fontWeight={500}
      >
        {payload.value}
        {payload.name}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={50}
        stroke="none"
      />
    </g>
  );
};

const PercentPie = () => (
  <ResponsiveContainer aspect={2} height="230px">
    <PieChart>
      <Pie
        data={dataDummy}
        isAnimationActive={false}
        dataKey="value"
        // startAngle={225}
        // endAngle={-45}
        innerRadius="80%"
        outerRadius="100%"
        fill="#F4F3F4"
        cornerRadius={50}
        stroke="none"
      />
      <Pie
        activeIndex={0}
        activeShape={renderActiveShape}
        data={data}
        startAngle={225}
        endAngle={0}
        innerRadius="80%"
        outerRadius="100%"
        fill="none"
        cornerRadius={50}
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={"#7F5AD5"} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

export default PercentPie;
