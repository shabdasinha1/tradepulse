import React, { useEffect, useRef, useState } from "react";
import TradePulseCard from "../common/TradePulseCard";
import { ProductDropdownSearch } from "../../services/DashboardService";

const TPMetricCard = ({
  title,
  value,
  unit,
  footerLabel,
  trend,
  trendDirection = "neutral",
  icon,
  className = "",

  /* ✅ RENAMED PROPS */
  showMetricProductDropdown = false,
  metricSelectedProduct,
  onMetricProductSelect,
}) => {
  const trendClass =
    trendDirection === "up"
      ? "tp-text-up"
      : trendDirection === "Downward"
      ? "tp-text-down"
      : "tp-text-neutral";

  /* ===============================
     DROPDOWN STATE
  =============================== */

  const [productOptions, setProductOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ===============================
     FETCH DROPDOWN DATA
  =============================== */

  const fetchDropdownData = async (query) => {
    try {
      const res = await ProductDropdownSearch(query);
      const apiData = res?.data || [];

      const formatted = apiData.map((item) => ({
        ...item,
        label: `${item.label} / ${item.value}`,
      }));

      setProductOptions(formatted);
    } catch (err) {
      console.error("Dropdown fetch error:", err);
    }
  };

  /* ===============================
     DEFAULT SELECTED PRODUCT LOAD
  =============================== */

  useEffect(() => {
    const loadDefaultProduct = async () => {
      if (!metricSelectedProduct) return;

      try {
        const res = await ProductDropdownSearch("");
        const apiData = res?.data || [];

        const formatted = apiData.map((item) => ({
          ...item,
          label: `${item.label} / ${item.value}`,
        }));

        const matched = formatted.find(
          (item) => String(item.value) === String(metricSelectedProduct)
        );

        if (matched) {
          setSearch(matched.label);
        }
      } catch (err) {
        console.error("Default dropdown load error:", err);
      }
    };

    loadDefaultProduct();
  }, [metricSelectedProduct]);

  /* ===============================
     HANDLE SELECT
  =============================== */

  const handleSelect = (item) => {
    setSearch(item.label);
    setIsOpen(false);
    onMetricProductSelect?.(item.value);
  };

  /* ===============================
     CLOSE ON OUTSIDE CLICK
  =============================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <TradePulseCard className={`tp-metric-card ${className}`}>
      {/* Header */}
      <div className="tp-metric-header">
        <span className="tp-metric-title">{title}</span>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          {/* Product Search Dropdown */}
          {showMetricProductDropdown && (
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
                  {productOptions.length > 0 ? (
                    productOptions.map((item) => (
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
          )}

          {icon && <div className="tp-metric-icon">{icon}</div>}
        </div>
      </div>

      {/* Main Value */}
      <div className="tp-metric-value-wrap">
        <span className="tp-metric-value">{value}</span>
        {unit && <span className="tp-metric-unit">{unit}</span>}
      </div>

      {/* Footer */}
      <div className="tp-metric-footer">
        {footerLabel && <span className="tp-muted">{footerLabel}</span>}

        {trend !== undefined && (
          <span className={trendClass}>
            {trendDirection === "up" && "↗ "}
            {trendDirection === "Downward" && "↘ "}
            {trend}%
          </span>
        )}
      </div>
    </TradePulseCard>
  );
};

export default TPMetricCard;