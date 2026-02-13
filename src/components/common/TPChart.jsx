import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import TradePulseCard from "../common/TradePulseCard";

const radiusSm = parseInt(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--radius-sm')
);

const TPChart = ({
  title,
  type = "line", // line | area | bar
  data = [],
  xKey = "month",
  series = [],
}) => {
  const renderTooltip = () => (
    <Tooltip
      contentStyle={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
      }}
      labelStyle={{
        color: "var(--text-secondary)",
        fontSize: "var(--fs-caption)",
      }}
      itemStyle={{
        color: "var(--text-primary)",
        fontSize: "var(--fs-body)",
      }}
    />
  );

  const commonAxisProps = {
    tick: {
      fill: "var(--text-muted)",
      fontSize: "var(--fs-caption)",
    },
    axisLine: { stroke: "var(--border-soft)" },
    tickLine: { stroke: "var(--border-soft)" },
  };

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tpPrimaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--clr-primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--clr-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {renderTooltip()}
            <Legend />

            {series.map((item, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke="var(--clr-primary)"
                fill="url(#tpPrimaryGradient)"
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {renderTooltip()}
            <Legend />


{series.map((item, index) => (
  <Bar
    key={index}
    dataKey={item.key}
    name={item.label}
    fill="var(--clr-primary-soft)"
    stroke="var(--clr-primary)"
    radius={[radiusSm, radiusSm, 0, 0]}
  />
))}

          </BarChart>
        );

      default:
        return (
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {renderTooltip()}
            <Legend />

            {series.map((item, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={
                  item.variant === "neutral"
                    ? "var(--text-secondary)"
                    : "var(--clr-primary)"
                }
                strokeDasharray={item.dashed ? "6 4" : ""}
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "var(--clr-primary)",
                  stroke: "var(--bg-card)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <TradePulseCard
      header={
        <h4 className="tp-section-title">
          {title}
        </h4>
      }
    >
      <div className="tp-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </TradePulseCard>
  );
};

export default TPChart;
