import { useEffect, useState } from "react";

const UniversalFilter = ({
  showCorridor = false,
  showProduct = false,
  showTimeRange = false,
  showRiskLevel = false,
  showActivityStatus = false, // ✅ NEW FLAG (default false)
  defaultValues = {},
  onChange,
  className = "",
}) => {
  const [filters, setFilters] = useState({
    corridor: defaultValues.corridor || "",
    product: defaultValues.product || "",
    timeRange: defaultValues.timeRange || "90d",
    riskLevel: defaultValues.riskLevel || "",
    activityStatus: defaultValues.activityStatus || "", // ✅ NEW STATE
  });

  /* ===============================
     EMIT CHANGES UPWARD
  =============================== */
  useEffect(() => {
    onChange && onChange(filters);
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={`tp-universal-filter ${className}`}>

      {/* ================= Corridor ================= */}
      {showCorridor && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.corridor}
          onChange={(e) => updateFilter("corridor", e.target.value)}
        >
          <option value="">Corridor</option>
          <option value="uk-ng">UK ↔ Nigeria</option>
          <option value="uk-gh">UK ↔ Ghana</option>
          <option value="uk-ke">UK ↔ Kenya</option>
          <option value="uk-za">UK ↔ South Africa</option>
        </select>
      )}

      {/* ================= Product ================= */}
      {showProduct && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.product}
          onChange={(e) => updateFilter("product", e.target.value)}
        >
          <option value="">Product</option>
          <option value="cocoa">Cocoa Beans</option>
          <option value="oil">Crude Oil</option>
          <option value="tea">Tea</option>
        </select>
      )}

      {/* ================= Time Range ================= */}
      {showTimeRange && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.timeRange}
          onChange={(e) => updateFilter("timeRange", e.target.value)}
        >
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>
      )}

      {/* ================= Risk Level ================= */}
      {showRiskLevel && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.riskLevel}
          onChange={(e) => updateFilter("riskLevel", e.target.value)}
        >
          <option value="">Risk Level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      )}

      {/* ================= Activity Status (NEW) ================= */}
      {showActivityStatus && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.activityStatus}
          onChange={(e) => updateFilter("activityStatus", e.target.value)}
        >
          <option value="">Activity Status</option>
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
        </select>
      )}

    </div>
  );
};

export default UniversalFilter;