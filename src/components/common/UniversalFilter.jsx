import { useEffect, useState } from "react";
import Select from "react-select";

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

  const corridorOptions = [
    { value: "", label: "Corridor" },
    { value: "uk-ng", label: "UK ↔ Nigeria" },
    { value: "uk-gh", label: "UK ↔ Ghana" },
    { value: "uk-ke", label: "UK ↔ Kenya" },
    { value: "uk-za", label: "UK ↔ South Africa" },
  ];

  const productOptions = [
    { value: "", label: "Product" },
    { value: "cocoa", label: "Cocoa Beans" },
    { value: "oil", label: "Crude Oil" },
    { value: "tea", label: "Tea" },
  ];

  const timeRangeOptions = [
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "6m", label: "Last 6 Months" },
    { value: "12m", label: "Last 12 Months" },
  ];

  const riskOptions = [
    { value: "", label: "Risk Level" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const activityOptions = [
    { value: "", label: "Activity Status" },
    { value: "active", label: "Active" },
    { value: "dormant", label: "Dormant" },
  ];

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
      {/* {showCorridor && (
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
      )} */}
      {showCorridor && (
        <Select
          className=" tp-select tp-filter-control"
          classNamePrefix="tp-select"
          options={corridorOptions}
          value={corridorOptions.find((o) => o.value === filters.corridor)}
          onChange={(opt) => updateFilter("corridor", opt?.value || "")}
          placeholder="Corridor"
          isSearchable
        />
      )}

      {/* ================= Product ================= */}
      {/* {showProduct && (
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
      )} */}
      {showProduct && (
        <Select
          className="tp-select tp-filter-control"
          classNamePrefix="tp-select"
          options={productOptions}
          value={productOptions.find((o) => o.value === filters.product)}
          onChange={(opt) => updateFilter("product", opt?.value || "")}
          placeholder="Product"
          isSearchable
        />
      )}

      {/* ================= Time Range ================= */}
      {/* {showTimeRange && (
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
      )} */}
      {showTimeRange && (
        <Select
          className="tp-select tp-filter-control"
          classNamePrefix="tp-select"
          options={timeRangeOptions}
          value={timeRangeOptions.find((o) => o.value === filters.timeRange)}
          onChange={(opt) => updateFilter("timeRange", opt?.value || "")}
          isSearchable={false}
        />
      )}

      {/* ================= Risk Level ================= */}
      {/* {showRiskLevel && (
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
      )} */}
      {showRiskLevel && (
        <Select
          className="tp-select tp-filter-control"
          classNamePrefix="tp-select"
          options={riskOptions}
          value={riskOptions.find((o) => o.value === filters.riskLevel)}
          onChange={(opt) => updateFilter("riskLevel", opt?.value || "")}
          placeholder="Risk Level"
        />
      )}

      {/* ================= Activity Status (NEW) ================= */}
      {/* {showActivityStatus && (
        <select
          className="tp-input tp-select tp-filter-control"
          value={filters.activityStatus}
          onChange={(e) => updateFilter("activityStatus", e.target.value)}
        >
          <option value="">Activity Status</option>
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
        </select>
      )} */}
      {showActivityStatus && (
        <Select
          className="tp-select tp-filter-control"
          classNamePrefix="tp-select"
          options={activityOptions}
          value={activityOptions.find(
            (o) => o.value === filters.activityStatus,
          )}
          onChange={(opt) => updateFilter("activityStatus", opt?.value || "")}
          placeholder="Activity Status"
        />
      )}
    </div>
  );
};

export default UniversalFilter;
