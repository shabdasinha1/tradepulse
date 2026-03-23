import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useLocation } from "react-router-dom";


import {
  DashboardCorridors,
  ProductDropdownSearch,
  DashboardCountries,

} from "../../services/DashboardService";

import useUniversalFilters from "../../hooks/useUniversalFilters";
import { useDispatch, useSelector } from "react-redux";


const UniversalFilter = ({
  showCorridor = false,
  showProduct = false,
  showTimeRange = false,
  showRiskLevel = false,
  showActivityStatus = false,
  showQuoteCurrency = false,
  showOrigin = false,
  showDestination = false,
  defaultValues = {},
  onChange,
  className = "",
}) => {

  const location = useLocation();

  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  

  const { reporterCode } = useSelector((state) => state.corridor);

  const { filters, setFilters, updateFilter, resetFilters } =
    useUniversalFilters(defaultValues);

  const [countriesList, setCountriesList] = useState([]);
  const [countryPage, setCountryPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");

  const LIMIT = 50;

  const [corridorOptions, setCorridorOptions] = useState([
    { value: "", label: "Corridor" },
  ]);

  /* ===============================
     RISK + ACTIVITY OPTIONS
  =============================== */

  const riskOptions = [
    { value: "", label: "All" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  const activityOptions = [
    { value: "", label: "Activity Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "DORMANT", label: "Dormant" },
  ];

  /* ===============================
     COUNTRIES QUERY
  =============================== */

  const { data: countriesData, isFetching } = useQuery({
    queryKey: ["universalCountries", countryPage, countrySearch],
    queryFn: () =>
      DashboardCountries({
        page: countryPage,
        limit: LIMIT,
        search: countrySearch,
        currency: filters.quoteCurrency || undefined,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (countriesData?.data) {
      const newCountries = countriesData.data;

      setCountriesList((prev) =>
        countryPage === 1 ? newCountries : [...prev, ...newCountries],
      );
    }
  }, [countriesData]);

  const countryOptions = countriesList.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const currencyOptions = [
    ...new Map(
      countriesList
        .filter((c) => c.currency)
        .map((c) => [
          c.currency,
          {
            value: c.currency,
            label: `${c.name} (${c.currency})`,
          },
        ]),
    ).values(),
  ];


  /* ===============================
     CORRIDORS
  =============================== */

  const { data: corridorData } = useQuery({
    queryKey: ["corridors", reporterCode],
    queryFn: () => DashboardCorridors(reporterCode),
    enabled: !!reporterCode,
  });

  useEffect(() => {
    const corridors = corridorData?.data?.data || [];

    const formatted = [
      { value: "", label: "Corridor" },
      ...corridors.map((c) => ({
        value: c.partnerCode,
        label: c.label,
      })),
    ];

    setCorridorOptions(formatted);
  }, [corridorData]);


  /* ===============================
     PRODUCT SEARCH
  =============================== */

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

  /* ===============================
     COUNTRY SEARCH
  =============================== */

  const loadCountryOptions = async (inputValue) => {
    try {
      const res = await DashboardCountries({
        page: 1,
        limit: 50,
        search: inputValue || "",
        currency: filters.quoteCurrency || undefined,
      });

      const countries = res?.data || [];

      return countries.map((c) => ({
        value: c.name,
        label: c.name,
      }));
    } catch (err) {
      console.error("Country search error:", err);
      return [];
    }
  };

  /* ===============================
     CREATE OPTION VALIDATION
  =============================== */

  const isValidNewOption = (inputValue, selectValue, options) => {
    return (
      inputValue &&
      !options.some(
        (opt) => opt.value.toLowerCase() === inputValue.toLowerCase(),
      )
    );
  };

  /* ===============================
     SCROLL HANDLERS
  =============================== */

  const handleCurrencyScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && !isFetching) {
      setCountryPage((prev) => prev + 1);
    }
  };

  const handleCountryScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && !isFetching) {
      setCountryPage((prev) => prev + 1);
    }
  };

  /* ===============================
     RESET
  =============================== */

  const handleReset = () => {
    resetFilters();
  };

  /* ===============================
     CLOSE MODAL
  =============================== */

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onChange && onChange(filters);
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  /* ===============================
     LOCK BODY SCROLL
  =============================== */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

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
          <h3>Filters</h3>

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
          <div className={`tp-universal-filter ${className}`}>




            {/* CORRIDOR */}

            {showCorridor && (
              <div className="tp-form-group">
                <label>Corridor</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  options={corridorOptions}
                value={
  corridorOptions.find(
    (o) => String(o.value) === String(filters.partnerCode)
  ) ||
  (filters.partnerCode
    ? {
        value: filters.partnerCode,
        label: filters.corridor,
      }
    : null)
}
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

            {/* ORIGIN */}

            {showOrigin && (
              <div className="tp-form-group">
                <label>Origin</label>

                <AsyncCreatableSelect
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCountryOptions}
                  isValidNewOption={isValidNewOption}
                  createOptionPosition="last"
                  allowCreateWhileLoading
                  value={
                    filters.origin
                      ? { value: filters.origin, label: filters.origin }
                      : null
                  }
                  onChange={(opt) =>
                    setFilters((prev) => ({
                      ...prev,
                      origin: opt?.value || "",
                    }))
                  }
                  onCreateOption={(inputValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      origin: inputValue,
                    }));
                  }}
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                  placeholder="Select Origin"
                  isClearable
                />
              </div>
            )}

            {/* DESTINATION */}

            {showDestination && (
              <div className="tp-form-group">
                <label>Destination</label>

                <AsyncCreatableSelect
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCountryOptions}
                  isValidNewOption={isValidNewOption}
                  createOptionPosition="last"
                  allowCreateWhileLoading
                  value={
                    filters.destination
                      ? {
                        value: filters.destination,
                        label: filters.destination,
                      }
                      : null
                  }
                  onChange={(opt) =>
                    setFilters((prev) => ({
                      ...prev,
                      destination: opt?.value || "",
                    }))
                  }
                  onCreateOption={(inputValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      destination: inputValue,
                    }));
                  }}
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                  placeholder="Select Destination"
                  isClearable
                />
              </div>
            )}

            {/* PRODUCT */}

            {showProduct && (
              <div className="tp-form-group">
                <label>Product</label>

                <AsyncCreatableSelect
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadProductOptions}
                  isValidNewOption={isValidNewOption}
                  createOptionPosition="last"
                  allowCreateWhileLoading
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
                  onCreateOption={(inputValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      product: inputValue,
                      productLabel: inputValue,
                    }));
                  }}
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                  placeholder="Search product"
                  isClearable
                />
              </div>
            )}

            {/* QUOTE CURRENCY */}

            {showQuoteCurrency && (
              <div className="tp-form-group">
                <label>Quote Currency</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  options={currencyOptions}
                  value={
                    currencyOptions.find(
                      (o) => o.value === filters.quoteCurrency,
                    ) || null
                  }
                  onMenuScrollToBottom={handleCurrencyScroll}
                  onInputChange={(input) => {
                    setCountrySearch(input);
                    setCountryPage(1);
                  }}
                  onChange={(opt) =>
                    updateFilter("quoteCurrency", opt?.value || "")
                  }
                  placeholder="Select Quote Currency"
                  isSearchable
                />
              </div>
            )}

            {/* TIME RANGE */}

            {showTimeRange && (
              <>
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
              </>
            )}

            {/* RISK */}

            {showRiskLevel && (
              <div className="tp-form-group">
                <label>Risk Level</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  options={riskOptions}
                  value={riskOptions.find((o) => o.value === filters.riskLevel)}
                  onChange={(opt) =>
                    updateFilter("riskLevel", opt?.value || "")
                  }
                  placeholder="Select Risk Level"
                />
              </div>
            )}

            {/* ACTIVITY */}

            {showActivityStatus && (
              <div className="tp-form-group">
                <label>Activity Status</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  options={activityOptions}
                  value={activityOptions.find(
                    (o) => o.value === filters.activityStatus,
                  )}
                  onChange={(opt) =>
                    updateFilter("activityStatus", opt?.value || "")
                  }
                  placeholder="Select Activity Status"
                />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="tp-filter-footer">
          <button className="tp-btn-outline" onClick={handleReset}>
            Reset Filters
          </button>

          <button className="tp-btn-primary" onClick={handleClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UniversalFilter;
