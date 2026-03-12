import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import {
  setCorridor,
  setProduct,
  setReporterCode,
  setCountry,
  setPartnerCode,
  setPartnerCountry,
  setDateRange,
  resetFilters
} from "../../store/slices/corridorSlice";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { DashboardCorridors, ProductDropdownSearch } from "../../services/DashboardService";




function GlobalFilterPanel({ onClose }) {

  const modalRef = useRef(null);
  const dispatch = useDispatch();




  const [isClosing, setIsClosing] = useState(false);

const {
  country,
  reporterCode,
  corridor,
  partnerCode,
  productId,
  productLabel,
  startDate,
  endDate
} = useSelector((state) => state.corridor);
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
  const [localProduct, setLocalProduct] = useState(null);
 
  const [corridorOptions, setCorridorOptions] = useState([]);


useEffect(() => {
  if (reporterCode) setLocalCountry(reporterCode);
  if (partnerCode) setLocalCorridor(partnerCode);

  if (productId) {
    setLocalProduct({
      value: productId,
      label: productLabel,
    });
  } else {
    setLocalProduct(null);
  }

}, [reporterCode, partnerCode, productId, productLabel]);

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


  useEffect(() => {
    console.log("Redux corridor state updated:", {
      country,
      reporterCode,
      partnerCode,
      corridor,
      productId,
       productLabel
    
    });
  }, [country, reporterCode, partnerCode, corridor, productId, productLabel]);

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

  if (startDate && !endDate) {
    alert("Please select End Date");
    return;
  }

  if (startDate && endDate && startDate > endDate) {
    alert("Start date cannot be after End date");
    return;
  }

  dispatch(setProduct(localProduct || { value: "", label: "" }));

  handleClose();
};
  /* =========================
      RESET FILTERS
  ========================== */

 const handleReset = () => {
  dispatch(resetFilters());
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
                const partnerCountry = corridorLabel.split("↔")[1]?.trim();
                dispatch(setPartnerCountry(partnerCountry));
              }}
              placeholder="Select Corridor"
              isSearchable
            />
          </div>

          <div className="tp-form-group">
            <label>Product</label>

           <AsyncSelect
  className="tp-select"
  classNamePrefix="tp-select"
  cacheOptions
  defaultOptions
  loadOptions={loadProductOptions}
  value={localProduct}
  onChange={(opt) => setLocalProduct(opt)}
  placeholder="Search HS Code or Product"
  isClearable
/>
          </div>

         <div className="tp-form-group">
  <label>Start Date</label>
  <input
  type="date"
  className="tp-input"
  value={startDate || ""}
  onChange={(e) =>
    dispatch(
      setDateRange({
        startDate: e.target.value,
        endDate: endDate,
      })
    )
  }
/>
</div>

<div className="tp-form-group">
  <label>End Date</label>
 <input
  type="date"
  className="tp-input"
  value={endDate || ""}
  onChange={(e) =>
    dispatch(
      setDateRange({
        startDate: startDate,
        endDate: e.target.value,
      })
    )
  }
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