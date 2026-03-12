import { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import { DashboardCorridors, ProductDropdownSearch } from "../../services/DashboardService";

const UniversalFilter = ({
  showCorridor = false,
  showProduct = false,
  showTimeRange = false,
  showRiskLevel = false,
  showActivityStatus = false,
  defaultValues = {},
  onChange,
  className = "",
}) => {

  const { reporterCode, partnerCode, productId, productLabel } = useSelector(
  (state) => state.corridor
);

  const [filters, setFilters] = useState({
  corridor: defaultValues.corridor || "",
  partnerCode: defaultValues.partnerCode || "",
  product: defaultValues.product || "",
  productLabel: defaultValues.productLabel || "",
  riskLevel: defaultValues.riskLevel || "",
  activityStatus: defaultValues.activityStatus || "",
  startDate: defaultValues.startDate || "",
  endDate: defaultValues.endDate || "",
});
  const [corridorOptions, setCorridorOptions] = useState([
    { value: "", label: "Corridor" },
  ]);

  const productOptions = [
    { value: "", label: "Product" },
    { value: "cocoa", label: "Cocoa Beans" },
    { value: "oil", label: "Crude Oil" },
    { value: "tea", label: "Tea" },
  ];


  const riskOptions = [
    { value: "", label: "All" },
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
     LOAD CORRIDORS
  =============================== */

  useEffect(() => {
    if (!reporterCode) return;

    const fetchCorridors = async () => {
      try {
        const res = await DashboardCorridors(reporterCode);
        const corridors = res?.data?.data || [];

        const formatted = [
          { value: "", label: "Corridor" },
          ...corridors.map((c) => ({
            value: c.partnerCode,
            label: c.label,
          })),
        ];

        setCorridorOptions(formatted);
      } catch (error) {
        console.error("Corridor API Error:", error);
      }
    };

    fetchCorridors();
  }, [reporterCode]);

  /* ===============================
   SYNC GLOBAL PRODUCT
=============================== */

useEffect(() => {
  if (!productId) return;

  setFilters((prev) => {
    // avoid overriding local filter if same
    if (prev.product === productId) return prev;

    return {
      ...prev,
      product: productId,
      productLabel: productLabel || "",
    };
  });
}, [productId, productLabel]);

  /* ===============================
     SYNC GLOBAL CORRIDOR
  =============================== */

  useEffect(() => {
    if (!partnerCode) return;

    const selected = corridorOptions.find((c) => c.value === partnerCode);

    if (!selected) return;

    setFilters((prev) => ({
      ...prev,
      partnerCode: partnerCode,
      corridor: selected.label,
    }));
  }, [partnerCode, corridorOptions]);

  /* ===============================
     EMIT FILTER CHANGES
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
const loadProductOptions = async (inputValue) => {
  try {
    const res = await ProductDropdownSearch(inputValue || "");
    const products = res?.data || [];

    return products.map((p) => ({
      value: p.value,
      label: p.label,
    }));
  } catch (err) {
    console.error("Product search error:", err);
    return [];
  }
};
  return (
    <div className={`tp-universal-filter ${className}`}>

      {showCorridor && (
        <div className="tp-form-group">
          <label>Corridor</label>
          <Select
            className="tp-select tp-filter-control"
            classNamePrefix="tp-select"
            options={corridorOptions}
            value={corridorOptions.find(
              (o) => o.value === filters.partnerCode
            )}
            onChange={(opt) => {
              const partner = opt?.value || "";
              const corridorLabel = opt?.label || "";

              setFilters((prev) => ({
                ...prev,
                partnerCode: partner,
                corridor: corridorLabel,
              }));
            }}
            placeholder="Select Corridor"
            isSearchable
          />
        </div>
      )}

      {showProduct && (
        <div className="tp-form-group">
          <label>Product</label>
         <AsyncSelect
  className="tp-select tp-filter-control"
  classNamePrefix="tp-select"
  cacheOptions
  defaultOptions
  loadOptions={loadProductOptions}
  value={
  filters.product
    ? {
        value: filters.product,
        label: filters.productLabel || filters.product,
      }
    : null
}
  onChange={(opt) =>
    setFilters((prev) => ({
      ...prev,
      product: opt?.value || "",
      productLabel: opt?.label || "",
    }))
  }
  placeholder="Search"
  isClearable
/>
        </div>
      )}
<div className="tp-form-group">
  <label>Start Date</label>
  <input
    type="date"
    className="tp-input tp-filter-control"
    value={filters.startDate}
    onChange={(e) => updateFilter("startDate", e.target.value)}
  />
</div>

<div className="tp-form-group">
  <label>End Date</label>
  <input
    type="date"
    className="tp-input tp-filter-control"
    value={filters.endDate}
    onChange={(e) => updateFilter("endDate", e.target.value)}
  />
</div>

      {showRiskLevel && (
        <div className="tp-form-group">
          <label>Risk Level</label>
          <Select
            className="tp-select tp-filter-control"
            classNamePrefix="tp-select"
            options={riskOptions}
            value={riskOptions.find((o) => o.value === filters.riskLevel)}
            onChange={(opt) => updateFilter("riskLevel", opt?.value || "")}
            placeholder="Select Risk Level"
          />
        </div>
      )}

      {showActivityStatus && (
        <div className="tp-form-group">
          <label>Activity Status</label>
          <Select
            className="tp-select tp-filter-control"
            classNamePrefix="tp-select"
            options={activityOptions}
            value={activityOptions.find(
              (o) => o.value === filters.activityStatus
            )}
            onChange={(opt) =>
              updateFilter("activityStatus", opt?.value || "")
            }
            placeholder="Select Activity Status"
          />
        </div>
      )}

    </div>
  );
};

export default UniversalFilter;