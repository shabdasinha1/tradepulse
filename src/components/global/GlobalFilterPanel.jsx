import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import {
  setCorridor,
  setProduct,
  setTimeRange,
  setReporterCode,
  setCountry,
  setPartnerCode
} from "../../store/slices/corridorSlice";
import Select from "react-select";
import { DashboardCorridors } from "../../services/DashboardService";




function GlobalFilterPanel({ onClose }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const productOptions = [
    { value: "", label: "All Products" },
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

  const [isClosing, setIsClosing] = useState(false);

  const { country, reporterCode, corridor, partnerCode, productId, timeRange } = useSelector(
  (state) => state.corridor,
);

  const countries = useSelector((state) => state.country.countries);

  const countryOptions = countries.map((c) => ({
    value: c.numeric,
    label: c.name,
  }));

  /* =========================
      LOCAL STATE (TEMP)
  ========================== */

  const [localCountry, setLocalCountry] = useState(reporterCode || "");
const [localCorridor, setLocalCorridor] = useState(partnerCode || "");
  const [localProduct, setLocalProduct] = useState(productId || "");
  const [localTimeRange, setLocalTimeRange] = useState(timeRange || "90d");

  const [corridorOptions, setCorridorOptions] = useState([]);
const corridorState = useSelector((state) => state.corridor);

useEffect(() => {
  console.log("Redux corridor state updated:", corridorState);
}, [corridorState]);

  useEffect(() => {
    if (reporterCode) setLocalCountry(reporterCode);
  if (partnerCode) setLocalCorridor(partnerCode);
    if (productId) setLocalProduct(productId);
    if (timeRange) setLocalTimeRange(timeRange);
  }, [reporterCode, corridor, productId, timeRange]);

  /* =========================
   LOAD CORRIDORS ON COUNTRY SELECT
  ========================= */

  useEffect(() => {
    if (!reporterCode) return;

    const fetchCorridors = async () => {
      try {
        const res = await DashboardCorridors(reporterCode);
        console.log("corridor", res);
        const corridors = res?.data?.data || [];

        const formatted = corridors.map((c) => ({
          value: c.partnerCode,
          label: c.label,
        }));

        setCorridorOptions(formatted);
      } catch (error) {
        console.error("Corridor API Error:", error);
      }
    };

    fetchCorridors();
  }, [reporterCode]);

  /* =========================
      LOCK BODY SCROLL
  ========================== */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* =========================
      ESC CLOSE
  ========================== */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  /* =========================
      APPLY FILTERS
  ========================== */

  const handleApply = () => {
    dispatch(setCorridor(localCorridor));
    dispatch(setProduct(localProduct));
    dispatch(setTimeRange(localTimeRange));
    handleClose();
  };

  /* =========================
      RESET FILTERS
  ========================== */

  const handleReset = () => {
    setLocalCountry("");
    setLocalCorridor("");
    setLocalProduct("");
    setLocalTimeRange("90d");

    dispatch(setCorridor(""));
    dispatch(setProduct(""));
    dispatch(setTimeRange("90d"));
  };

  const modalContent = (
    <div
      className={`tp-filter-overlay ${isClosing ? "tp-overlay-exit" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`tp-filter-panel tp-card ${isClosing ? "tp-panel-exit" : ""
          }`}
        ref={modalRef}
      >
        {/* HEADER */}
        <div className="tp-filter-header">
          <h3>Global Filters</h3>

          <button
            className="tp-filter-close"
            onClick={handleClose}
            aria-label="Close Filters"
          >
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className="tp-filter-body">
          <div className="tp-form-group">
            <label>Country</label>

            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              options={countryOptions}
              value={countryOptions.find((opt) => opt.value === reporterCode)}
              onChange={(opt) => {
                const code = opt?.value || "";
                const name = opt?.label || "";

                setLocalCountry(code);

                dispatch(setReporterCode(code)); // numeric code for API
                dispatch(setCountry(name));      // store readable country name
              }}
              placeholder="Select Country"
              isSearchable
            />
          </div>

          <div className="tp-form-group">
            <label>Corridor</label>

            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              options={corridorOptions}
              value={corridorOptions.find((opt) => opt.value === localCorridor)}
              onChange={(opt) => {
  const partner = opt?.value || "";
  const corridorLabel = opt?.label || "";

  setLocalCorridor(partner);

  dispatch(setPartnerCode(partner)); // store partnerCode
  dispatch(setCorridor(corridorLabel)); // store readable corridor label
}}
              placeholder="Select Corridor"
              isSearchable
            />
          </div>

          <div className="tp-form-group">
            <label>Product</label>

            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              options={productOptions}
              value={productOptions.find((opt) => opt.value === localProduct)}
              onChange={(opt) => setLocalProduct(opt?.value || "")}
              placeholder="All Products"
              isSearchable
            />
          </div>

          <div className="tp-form-group">
            <label>Time Range</label>

            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              options={timeRangeOptions}
              value={timeRangeOptions.find(
                (opt) => opt.value === localTimeRange,
              )}
              onChange={(opt) => setLocalTimeRange(opt?.value || "")}
              isSearchable={false}
              placeholder="Select Time Range"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="tp-filter-footer">
          <button className="tp-btn-outline" onClick={handleReset}>
            Reset
          </button>

          <button className="tp-btn-primary" onClick={handleApply}>
            Add Filters
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default GlobalFilterPanel;