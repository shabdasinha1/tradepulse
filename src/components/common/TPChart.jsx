import React, { useState, useEffect, useMemo } from "react";
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
import UniversalFilter from "../common/UniversalFilter";

const TPChart = ({
  title,
  type = "line",
  data = [],
  xKey = "month",
  series = [],
  onFilterChange,
}) => {

  /* ===============================
     Y AXIS FORMATTER
  =============================== */

  const formatNumber = (num, divisor, suffix) => {
    const val = num / divisor;
    return Number.isInteger(val)
      ? `${val}${suffix}`
      : `${val.toFixed(1)}${suffix}`;
  };

  const yAxisFormatter = (value) => {
    if (value >= 1_000_000_000) return formatNumber(value, 1_000_000_000, "B");
    if (value >= 1_000_000) return formatNumber(value, 1_000_000, "M");
    if (value >= 100_000) return formatNumber(value, 1_000, "K");
    return value;
  };

  /* ===============================
     RESPONSIVE
  =============================== */

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const radiusSm = useMemo(() => {
    return parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--radius-sm")
    );
  }, []);

  /* ===============================
     CHART SPACING FROM GLOBAL CSS
  =============================== */

  const chartMargin = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);

    return {
      top: parseInt(styles.getPropertyValue("--tp-chart-margin-top")),
      right: parseInt(styles.getPropertyValue("--tp-chart-margin-right")),
      bottom: parseInt(styles.getPropertyValue("--tp-chart-margin-bottom")),
      left: parseInt(styles.getPropertyValue("--tp-chart-margin-left")),
    };
  }, []);

  const yAxisWidth = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    return parseInt(styles.getPropertyValue("--tp-chart-yaxis-width"));
  }, []);

  /* ===============================
     TOOLTIP
  =============================== */

  const renderTooltip = () => (
    <Tooltip
      cursor={false}
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

  /* ===============================
     CHART RENDER
  =============================== */

  const renderChart = () => {
    switch (type) {

      case "area":
        return (
          <AreaChart data={data} margin={chartMargin}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis
              width={yAxisWidth}
              tickFormatter={yAxisFormatter}
              {...commonAxisProps}
            />
            {renderTooltip()}
            <Legend />
            {series.map((item, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke="var(--clr-primary)"
                fill="var(--clr-primary-soft)"
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis
              width={yAxisWidth}
              tickFormatter={yAxisFormatter}
              {...commonAxisProps}
            />
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
          <LineChart data={data} margin={chartMargin}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis
              width={yAxisWidth}
              tickFormatter={yAxisFormatter}
              {...commonAxisProps}
            />
            {renderTooltip()}
            <Legend />
            {series.map((item, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke="var(--clr-primary)"
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <TradePulseCard
      header={
        <div className="tp-chart-header tp-chart-filter-header">
          <h4 className="tp-section-title">{title}</h4>

          {/* <UniversalFilter
            showCorridor
            showProduct
            showTimeRange
            defaultValues={{
              corridor: "",
              product: "",
              timeRange: "90d",
            }}
            onChange={(filters) => {
              onFilterChange?.(filters);
            }}
          /> */}
        </div>
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