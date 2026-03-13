import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import {
  DashboardCorridors,
  ProductDropdownSearch,
  DashboardCountries
} from "../../services/DashboardService";

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
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const {
    reporterCode,
    partnerCode,
    productId,
    productLabel,
    startDate,
    endDate,
    corridor
  } = useSelector((state) => state.corridor);

  const lastReduxSync = useRef({
    partnerCode,
    productId,
    startDate,
    endDate,
  });

  const [filters, setFilters] = useState({
    corridor: defaultValues.corridor || "",
    partnerCode: defaultValues.partnerCode || "",
    product: defaultValues.product || "",
    productLabel: defaultValues.productLabel || "",
    riskLevel: defaultValues.riskLevel || "",
    activityStatus: defaultValues.activityStatus || "",
    startDate: defaultValues.startDate || "",
    endDate: defaultValues.endDate || "",
    quoteCurrency: defaultValues.quoteCurrency || "",
    origin: defaultValues.origin || "",
    destination: defaultValues.destination || "",
  });
  const [countriesList, setCountriesList] = useState([]);
  const [countryPage, setCountryPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");
  const LIMIT = 50;

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
        ])
    ).values(),
  ];

  const countryOptions = countriesList.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const { data: countriesData, isFetching } = useQuery({
    queryKey: ["universalCountries", countryPage, countrySearch],
    queryFn: () =>
      DashboardCountries({
        page: countryPage,
        limit: LIMIT,
        search: countrySearch,
        currency: filters.quoteCurrency || undefined
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (countriesData?.data) {
      const newCountries = countriesData.data;

      setCountriesList((prev) =>
        countryPage === 1 ? newCountries : [...prev, ...newCountries]
      );
    }
  }, [countriesData]);

  const handleCurrencyScroll = () => {
    if (!isFetching) {
      setCountryPage((prev) => prev + 1);
    }
  };

  const handleCountryScroll = () => {
    if (!isFetching) {
      setCountryPage((prev) => prev + 1);
    }
  };
  /* ===============================
     LOAD CORRIDORS
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
     SYNC GLOBAL PRODUCT
  =============================== */

  /* ===============================
    SYNC GLOBAL PRODUCT
 =============================== */

  useEffect(() => {
    if (lastReduxSync.current.productId === productId) return;

    lastReduxSync.current.productId = productId;

    setFilters((prev) => ({
      ...prev,
      product: productId || "",
      productLabel: productLabel || "",
    }));
  }, [productId, productLabel]);

  /* ===============================
     SYNC GLOBAL CORRIDOR
  =============================== */

  /* ===============================
     SYNC GLOBAL CORRIDOR
  =============================== */

  useEffect(() => {
    if (lastReduxSync.current.partnerCode === partnerCode) return;

    lastReduxSync.current.partnerCode = partnerCode;

    const selected = corridorOptions.find((c) => c.value === partnerCode);

    if (!selected) return;

    setFilters((prev) => ({
      ...prev,
      partnerCode: partnerCode,
      corridor: selected.label,
    }));
  }, [partnerCode, corridorOptions]);


  /* ===============================
     SYNC GLOBAL DATES
  =============================== */

  useEffect(() => {
    if (
      lastReduxSync.current.startDate === startDate &&
      lastReduxSync.current.endDate === endDate
    )
      return;

    lastReduxSync.current.startDate = startDate;
    lastReduxSync.current.endDate = endDate;

    setFilters((prev) => ({
      ...prev,
      startDate: startDate || "",
      endDate: endDate || "",
    }));
  }, [startDate, endDate]);

  /* ===============================
     EMIT FILTER CHANGES
  =============================== */

  // useEffect(() => {
  //   onChange && onChange(filters);
  // }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
     MODAL CLOSE
  =============================== */

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      if (onChange) onChange(filters);
    }, 300);
  };

  const handleReset = () => {

    const resetFilters = {
      corridor: corridor,
      partnerCode: partnerCode,
      product: "",
      productLabel: "",
      riskLevel: "",
      activityStatus: "",
      startDate: "",
      endDate: "",
      quoteCurrency: ""
    };

    setFilters(resetFilters);

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

  /* ===============================
     ESC CLOSE
  =============================== */

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

            {showOrigin && (
              <div className="tp-form-group">
                <label>Origin</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  options={countryOptions}
                  value={countryOptions.find((o) => o.value === filters.origin) || null}
                  onMenuScrollToBottom={handleCountryScroll}
                  onInputChange={(input) => {
                    setCountrySearch(input);
                    setCountryPage(1);
                  }}
                  onChange={(opt) =>
                    setFilters((prev) => ({
                      ...prev,
                      origin: opt?.value || "",
                    }))
                  }
                  placeholder="Select Origin"
                  isSearchable
                />
              </div>
            )}

            {showDestination && (
              <div className="tp-form-group">
                <label>Destination</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  options={countryOptions}
                  value={countryOptions.find((o) => o.value === filters.destination) || null}
                  onMenuScrollToBottom={handleCountryScroll}
                  onInputChange={(input) => {
                    setCountrySearch(input);
                    setCountryPage(1);
                  }}
                  onChange={(opt) =>
                    setFilters((prev) => ({
                      ...prev,
                      destination: opt?.value || "",
                    }))
                  }
                  placeholder="Select Destination"
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

            {showQuoteCurrency && (
              <div className="tp-form-group">
                <label>Quote Currency</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  options={currencyOptions}
                  value={
                    currencyOptions.find((o) => o.value === filters.quoteCurrency) || null
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

            {showTimeRange && (
              <>
                <div className="tp-form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    className="tp-input tp-filter-control"
                    value={filters.startDate}
                    onChange={(e) =>
                      updateFilter("startDate", e.target.value)
                    }
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

            {showRiskLevel && (
              <div className="tp-form-group">
                <label>Risk Level</label>

                <Select
                  className="tp-select tp-filter-control"
                  classNamePrefix="tp-select"
                  options={riskOptions}
                  value={riskOptions.find(
                    (o) => o.value === filters.riskLevel
                  )}
                  onChange={(opt) =>
                    updateFilter("riskLevel", opt?.value || "")
                  }
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
        </div>

        {/* FOOTER */}
        <div className="tp-filter-footer">

          <button
            className="tp-btn-outline"
            onClick={handleReset}
          >
            Reset Filters
          </button>

          <button
            className="tp-btn-primary"
            onClick={handleClose}
          >
            Apply Filters
          </button>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UniversalFilter;