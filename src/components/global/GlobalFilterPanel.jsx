import { useQuery } from "@tanstack/react-query";
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
import { DashboardCorridors, ProductDropdownSearch, DashboardCountries } from "../../services/DashboardService";
import { setCountries } from "../../store/slices/countrySlice";



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
  const [localCountryName, setLocalCountryName] = useState(country || "");

  const [localCorridor, setLocalCorridor] = useState(partnerCode || "");
  const [localCorridorLabel, setLocalCorridorLabel] = useState(corridor || "");
  const [localPartnerCountry, setLocalPartnerCountry] = useState("");
  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");
  const [localProduct, setLocalProduct] = useState(null);
  const [countryPage, setCountryPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");
  const LIMIT = 50;

  const [corridorOptions, setCorridorOptions] = useState([]);


  useEffect(() => {
    if (reporterCode) setLocalCountry(reporterCode);
    if (country) setLocalCountryName(country);

    if (partnerCode) setLocalCorridor(partnerCode);

    if (startDate) setLocalStartDate(startDate);
    if (endDate) setLocalEndDate(endDate);

    if (productId) {
      setLocalProduct({
        value: productId,
        label: productLabel,
      });
    } else {
      setLocalProduct(null);
    }

  }, [reporterCode, partnerCode, productId, productLabel, startDate, endDate]);


  const { data: countriesData, isFetching } = useQuery({
    queryKey: ["countries", countryPage, countrySearch],
    queryFn: () =>
      DashboardCountries({
        page: countryPage,
        limit: LIMIT,
        search: countrySearch,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (countriesData?.data) {
      const newCountries = countriesData.data;

      dispatch(
        setCountries(
          countryPage === 1
            ? newCountries
            : [...countries, ...newCountries]
        )
      );
    }
  }, [countriesData]);
  /* =========================
   LOAD CORRIDORS ON COUNTRY SELECT
  ========================= */
  const { data: corridorData } = useQuery({
    queryKey: ["corridors", localCountry],
    queryFn: () => DashboardCorridors(localCountry),
    enabled: !!localCountry,
  });

  useEffect(() => {
    const corridors = corridorData?.data?.data || [];

    const formatted = corridors.map((c) => ({
      value: c.partnerCode,
      label: c.label,
    }));

    setCorridorOptions(formatted);
  }, [corridorData]);

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

    dispatch(setReporterCode(localCountry));

    const selectedCountry = countries.find(
      (c) => c.numeric === localCountry
    );

    if (selectedCountry) {
      dispatch(setCountry({
        name: selectedCountry.name,
        numeric: selectedCountry.numeric,
        currency: selectedCountry.currency,
      }));
    }

    dispatch(setPartnerCode(localCorridor));
    dispatch(setCorridor(localCorridorLabel));
    dispatch(setPartnerCountry(localPartnerCountry));

    dispatch(setProduct(localProduct || { value: "", label: "" }));

    dispatch(
      setDateRange({
        startDate: localStartDate,
        endDate: localEndDate,
      })
    );

    handleClose();
  };
  /* =========================
      RESET FILTERS
  ========================== */

  const handleReset = () => {
    dispatch(resetFilters());

    setLocalCountry("826");
    setLocalCountryName("United Kingdom");

    setLocalCorridor(566);
    setLocalCorridorLabel("UK ↔ Nigeria");

    setLocalStartDate("");
    setLocalEndDate("");

    setLocalProduct(null);
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
  const handleCountryScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && !isFetching) {
      setCountryPage((prev) => prev + 1);
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
  value={
    countryOptions.find((opt) => opt.value === reporterCode) || {
      value: reporterCode,
      label: country,
    }
  }
  onMenuScrollToBottom={handleCountryScroll}
  onInputChange={(input) => {
    setCountrySearch(input);
    setCountryPage(1);
  }}
  onChange={(opt) => {
    const code = opt?.value || "";
    const name = opt?.label || "";

    setLocalCountry(code);
    setLocalCountryName(name);

    dispatch(setReporterCode(code));
    dispatch(
      setCountry({
        name,
        numeric: code,
        currency: countries.find((c) => c.numeric === code)?.currency || "",
      })
    );

    setLocalCorridor("");
    setLocalCorridorLabel("");
    setLocalProduct(null);
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
                setLocalCorridorLabel(corridorLabel);

                const partnerCountry = corridorLabel.split("↔")[1]?.trim();
                setLocalPartnerCountry(partnerCountry);
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
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
            />
          </div>

          <div className="tp-form-group">
            <label>End Date</label>
            <input
              type="date"
              className="tp-input"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
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