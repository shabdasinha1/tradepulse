import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { ProductDropdownSearch } from "../../services/DashboardService";

const TPChart = ({
  title,
  type = "line",
  data = [],
  xKey = "month",
  series = [],
  onSelectProduct,
   selectedProduct,
}) => {

  /* ===============================
     RESPONSIVE HANDLING
  =============================== */

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 640
  );

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
     DROPDOWN STATE
  =============================== */

  const [productOptions, setProductOptions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  const loadDefaultProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await ProductDropdownSearch("");
      const apiData = res?.data || [];

      const formatted = apiData.map((item) => ({
        ...item,
        label: `${item.label} / ${item.value}`,
      }));

      const matched = formatted.find(
        (item) => String(item.value) === String(selectedProduct)
      );

      if (matched) {
        setSearch(matched.label);  // 🔥 THIS sets Aggregate / 27
      }
    } catch (err) {
      console.error("Default dropdown load error:", err);
    }
  };

  loadDefaultProduct();
}, [selectedProduct]);


  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = productOptions;

  const handleSelect = (item) => {
    setSearch(item.label);
    setIsOpen(false);

    if (onSelectProduct) {
      onSelectProduct(item.value);
    }
  };

  /* ===============================
     TOOLTIP
  =============================== */

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

  /* ===============================
     DROPDOWN API
  =============================== */

  const fetchDropdownData = async (query = "") => {
    try {
      const res = await ProductDropdownSearch(query);
      const apiData = res?.data || [];

      const formatted = apiData.map((item) => ({
        ...item,
        label: `${item.label} / ${item.value}`,
      }));

      setProductOptions(formatted);
    } catch (error) {
      console.error("Dropdown fetch error:", error);
    }
  };

  /* ===============================
     CLICK OUTSIDE
  =============================== */

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

  /* ===============================
     CHART RENDER
  =============================== */

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

            <XAxis
              dataKey={xKey}
              interval={isMobile ? "preserveStartEnd" : 0}
              minTickGap={isMobile ? 20 : 10}
              {...commonAxisProps}
            />

            <YAxis
              width={isMobile ? 35 : 50}
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

            <XAxis
              dataKey={xKey}
              interval={isMobile ? "preserveStartEnd" : 0}
              minTickGap={isMobile ? 20 : 10}
              {...commonAxisProps}
            />

            <YAxis
              width={isMobile ? 35 : 50}
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
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />

            <XAxis
              dataKey={xKey}
              interval={isMobile ? "preserveStartEnd" : 0}
              minTickGap={isMobile ? 20 : 10}
              {...commonAxisProps}
            />

            <YAxis
              width={isMobile ? 35 : 50}
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
                onFocus={() => {
                  setIsOpen(true);
                  fetchDropdownData("");
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  setIsOpen(true);
                  fetchDropdownData(value);
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
