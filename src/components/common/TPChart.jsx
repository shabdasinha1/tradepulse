import React, { useState,useEffect, useMemo,useRef } from "react";
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
import { DashboardProductList, ProductDropdownSearch } from "../../services/DashboardService";



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

  
  /* ===============================
     STATIC DROPDOWN DATA
  =============================== */
  const [productOptions, setProductOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);


const filteredOptions = useMemo(() => {
  if (!search) return productOptions;
  return productOptions.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
}, [search, productOptions]);

const handleSelect = async (item) => {
  setSelected(item);
  setSearch(item.label);
  setIsOpen(false);

  try {
    const res = await ProductDropdownSearch(item.hsCode);
    console.log("Dropdown API response:", res);
  } catch (error) {
    console.error("Dropdown API error:", error);
  }
};


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
const fetchProducts = async () => {
  try {
    const res = await DashboardProductList();
    const apiProducts = res?.data?.data || [];

    const formatted = apiProducts.map((item) => ({
      label: `${item.product} / ${item.hsCode}`,
      value: item.hsCode,
      product: item.product,
      hsCode: item.hsCode,
    }));

    setProductOptions(formatted);

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
  fetchProducts();
}, []);
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
  <div className="tp-chart-header">
    <h4 className="tp-section-title">{title}</h4>

   <div className="tp-chart-search-wrapper">
  <div className="tp-chart-search" ref={dropdownRef}>
    <input
      type="text"
      className="tp-input tp-chart-search-input"
      placeholder="Search product..."
      value={search}
      onFocus={() => setIsOpen(true)}
      onChange={(e) => {
        setSearch(e.target.value);
        setIsOpen(true);
      }}
    />

    {isOpen && (
      <div className="tp-chart-dropdown">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item) => (
            <div
              key={item.value}
              className="tp-chart-option"
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </div>
          ))
        ) : (
          <div className="tp-chart-option tp-chart-option-muted">
            No results
          </div>
        )}
      </div>
    )}
  </div>
</div>

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
