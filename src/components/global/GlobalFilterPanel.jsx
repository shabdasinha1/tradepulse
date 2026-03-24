import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import {
  setCorridor,
  setProduct,
  setReporterCode,
  setCountry,
  setPartnerCode,
  setPartnerCountry,
  setDateRange,
  setQuoteCurrency,
  setRegion,
  resetFilters,
} from "../../store/slices/corridorSlice";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  DashboardCorridors,
  ProductDropdownSearch,
  DashboardCountries,
  DashboardRegions,
} from "../../services/DashboardService";
import { setCountries } from "../../store/slices/countrySlice";
import { queryKeys } from "../../utils/queryKeys";


function GlobalFilterPanel({ onClose }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const debouncedSetSearch = useMemo(
  () =>
    debounce((value, setState) => {
      setState(value);
    }, 400),
  [],
);

  const isSupplierPage = location.pathname.includes("suppliers");

  const [isClosing, setIsClosing] = useState(false);

  const {
    country,
    reporterCode,
    corridor,
    partnerCode,
    productId,
    productLabel,
    startDate,
    endDate,
    quoteCurrency,
    quoteCurrencySymbol,
    region,
  } = useSelector((state) => state.corridor);

  const countries = useSelector((state) => state.country.countries);
  const countryOptions = useMemo(
    () =>
      countries.map((c) => ({
        value: c.numeric,
        label: c.name,
      })),
    [countries],
  );

  /* =========================
     LOCAL TEMP STATE
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
  const [regionOptions, setRegionOptions] = useState([]);
  const [localRegion, setLocalRegion] = useState(region || "");

  const LIMIT = 50;

  const [corridorOptions, setCorridorOptions] = useState([]);

  /* =========================
     SYNC REDUX → LOCAL
  ========================== */

  useEffect(() => {
    setLocalCountry(reporterCode || "");
    setLocalCountryName(country || "");

    setLocalCorridor(partnerCode || "");
    setLocalCorridorLabel(corridor || "");

    setLocalStartDate(startDate || "");
    setLocalEndDate(endDate || "");
    setLocalRegion(region || "");

    if (productId) {
      setLocalProduct({
        value: productId,
        label: productLabel,
      });
    } else {
      setLocalProduct(null);
    }
  }, [
    reporterCode,
    partnerCode,
    corridor,
    productId,
    productLabel,
    startDate,
    endDate,
  ]);

  /* =========================
     LOAD COUNTRIES
  ========================== */


const { data: countriesData, isFetching } = useQuery({
  queryKey: queryKeys.countries(countryPage, countrySearch, localRegion), // ✅ updated
  queryFn: () =>
    DashboardCountries({
      page: countryPage,
      limit: LIMIT,
      search: countrySearch || "", // ✅ only search text
      region: localRegion || "",   // ✅ region separate
    }),
  enabled: !!localRegion,
  keepPreviousData: true,
  staleTime: 1000 * 60 * 10,
  cacheTime: 1000 * 60 * 30,
});

  useEffect(() => {
    if (!countriesData?.data) return;

    const newCountries = countriesData.data;

    dispatch(
      setCountries(
        countryPage === 1
          ? newCountries
          : Array.from(
              new Map(
                [...(countries || []), ...newCountries].map((c) => [
                  c.numeric,
                  c,
                ]),
              ).values(),
            ),
      ),
    );

    // ✅ AUTO SELECT FIRST COUNTRY WHEN REGION SELECTED
    if (localRegion && newCountries.length > 0 && !localCountry) {
      const first = newCountries[0];

      setLocalCountry(first.numeric);
      setLocalCountryName(first.name);

      dispatch(
        setCountry({
          name: first.name,
          numeric: first.numeric,
          currency: first.currency,
          region: localRegion, // ✅ ADD THIS
        }),
      );
    }
  }, [countriesData, countryPage, dispatch]);

  const { data: regionsData } = useQuery({
    queryKey: ["regions"],
    queryFn: DashboardRegions,
  });

  useEffect(() => {
    const regions = regionsData?.data || [];

    const formatted = regions
      .filter((r) => r)
      .map((r) => ({
        value: r,
        label: r,
      }));

    setRegionOptions(formatted);
  }, [regionsData]);

  useEffect(() => {
    setCountryPage(1);
  }, [localRegion]);
  /* =========================
     LOAD CORRIDORS
  ========================== */

 const { data: corridorData, isFetching: isCorridorFetching } = useQuery({
    queryKey: queryKeys.corridors(localCountry),
    queryFn: () => DashboardCorridors(localCountry),
    enabled: !!localCountry,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    const corridors = corridorData?.data?.data || [];

    const formatted = corridors.map((c) => ({
      value: c.partnerCode,
      label: c.label,
    }));

    setCorridorOptions((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(formatted)) return prev;
      return formatted;
    });
    // ✅ AUTO SELECT FIRST ITEM (ONLY IF NOT ALREADY SELECTED)
    if (formatted.length > 0 && !localCorridor) {
      const first = formatted[0];

      setLocalCorridor(first.value);
      setLocalCorridorLabel(first.label);

      const partnerCountry = first.label.split("↔")[1]?.trim();
      setLocalPartnerCountry(partnerCountry);
    }
  }, [corridorData]);

  /* =========================
     MODAL BEHAVIOR
  ========================== */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
  if (e.key === "Escape") {
    if (!localRegion || !localCountry || !localCorridor) {
      alert("Please complete required filters");
      return;
    }
    handleClose();
  }
};

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
  // ✅ BLOCK CLOSE IF REQUIRED FIELDS NOT SELECTED
  if (!localRegion || !localCountry || !localCorridor) {
    alert("Please select Region, Country and Corridor before closing");
    return;
  }

  setIsClosing(true);
  setTimeout(() => onClose(), 300);
};

 const handleOverlayClick = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    if (!localRegion || !localCountry || !localCorridor) {
      alert("Please complete required filters");
      return;
    }
    handleClose();
  }
};

  /* =========================
     APPLY FILTERS
  ========================== */

  const handleApply = () => {
    // ✅ REQUIRED VALIDATION
    if (!localRegion || !localCountry || !localCorridor) {
      alert("Region, Country and Corridor are required");
      return;
    }

    if (localStartDate && !localEndDate) {
      alert("Please select End Date");
      return;
    }

    if (localStartDate && localEndDate && localStartDate > localEndDate) {
      alert("Start date cannot be after End date");
      return;
    }

    dispatch(setReporterCode(localCountry));

    const selectedCountry = countries.find((c) => c.numeric === localCountry);

    if (selectedCountry) {
      dispatch(
        setCountry({
          name: selectedCountry.name,
          numeric: selectedCountry.numeric,
          currency: selectedCountry.currency,
        }),
      );
    }

    dispatch(setPartnerCode(localCorridor));
    dispatch(setCorridor(localCorridorLabel));
    dispatch(setPartnerCountry(localPartnerCountry));
    dispatch(setRegion(localRegion));

    const partnerCountryName = localCorridorLabel.split("↔")[1]?.trim();

    if (partnerCountryName) {
      DashboardCountries({
        page: 1,
        limit: 1,
        search: partnerCountryName,
      })
        .then((res) => {
          const countryData = res?.data?.[0];
          if (countryData?.currency) {
            dispatch(setQuoteCurrency(countryData.currency));
          }
        })
        .catch((err) => {
          console.error("Quote currency fetch failed:", err);
        });
    }

    dispatch(setProduct(localProduct || { value: "", label: "" }));

    dispatch(
      setDateRange({
        startDate: localStartDate,
        endDate: localEndDate,
      }),
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
    setLocalRegion("Africa");
    setLocalProduct(null);
  };
useEffect(() => {
  return () => {
    debouncedSetSearch.cancel();
  };
}, [debouncedSetSearch]);
  

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
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

    if (bottom && !isFetching) {
      setCountryPage((prev) => prev + 1);
    }
  };
  const corridorOptionsMemo = useMemo(() => corridorOptions, [corridorOptions]);
  const modalContent = (
    <div
      className={`tp-filter-overlay ${isClosing ? "tp-overlay-exit" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`tp-filter-panel tp-card ${
          isClosing ? "tp-panel-exit" : ""
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
            <label>Region</label>

            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              options={regionOptions}
              value={
                regionOptions.find((opt) => opt.value === localRegion) || null
              }
              onChange={(opt) => {
                const regionVal = opt?.value || "";

                setLocalRegion(regionVal);
                dispatch(setRegion(regionVal)); // ✅ ADD THIS LINE

                // ✅ RESET DEPENDENCIES
                setLocalCountry("");
                setLocalCountryName("");
                setLocalCorridor("");
                setLocalCorridorLabel("");
                setLocalProduct(null);

                dispatch(setReporterCode(null));
                dispatch(
                  setCountry({
                    name: "",
                    numeric: "",
                    currency: "",
                    region: regionVal,
                  }),
                );
                dispatch(setPartnerCode(null));
                dispatch(setPartnerCountry(null));
                dispatch(setCorridor(null));
                dispatch(setProduct({ value: "", label: "" }));
              }}
              placeholder="Select Region"
              isSearchable
            />
          </div>
          <div className="tp-form-group">
            <label>Country</label>
            <Select
              className="tp-select"
              classNamePrefix="tp-select"
              isLoading={isFetching}
loadingMessage={() => "Loading countries..."}
noOptionsMessage={() =>
  isFetching ? "Loading..." : "No countries found"
}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              options={countryOptions}
              value={
                countryOptions.find((opt) => opt.value === reporterCode) || {
                  value: reporterCode,
                  label: country,
                }
              }
              onMenuScrollToBottom={handleCountryScroll}
              onInputChange={(input) => {
                debouncedSetSearch(input, setCountrySearch);
                setCountryPage(1);
              }}
              isDisabled={!localRegion} // ✅ ADDED
              onChange={(opt) => {
                const code = opt?.value || "";
                const name = opt?.label || "";

                setLocalCountry(code);
                setLocalCountryName(name);

                const selected = countries.find((c) => c.numeric === code);

                dispatch(
                  setCountry({
                    name,
                    numeric: code,
                    currency: selected?.currency || "",
                    region: localRegion, // ✅ ADD THIS
                  }),
                );

                // reset dependent fields
                setLocalCorridor("");
                setLocalCorridorLabel("");
                setLocalProduct(null);

                dispatch(setPartnerCode(null));
                dispatch(setPartnerCountry(null));
                dispatch(setCorridor(null));
                dispatch(setProduct({ value: "", label: "" }));
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
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              options={corridorOptionsMemo}
              isLoading={isCorridorFetching}
loadingMessage={() => "Loading corridors..."}
noOptionsMessage={() =>
  isCorridorFetching ? "Loading..." : "No corridors found"
}
              value={
                corridorOptions.find(
                  (opt) => String(opt.value) === String(localCorridor),
                ) ||
                (localCorridor
                  ? { value: localCorridor, label: localCorridorLabel }
                  : null)
              }
              isDisabled={!localCountry} // ✅ ADDED
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

            <AsyncCreatableSelect
              className="tp-select"
              classNamePrefix="tp-select"
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              cacheOptions
              defaultOptions
              loadOptions={loadProductOptions}
              value={localProduct}
              onChange={(opt) => setLocalProduct(opt)}
              onCreateOption={(inputValue) => {
                setLocalProduct({
                  value: inputValue,
                  label: inputValue,
                });
              }}
              formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
              allowCreateWhileLoading
              createOptionPosition="last"
              isValidNewOption={(inputValue, selectValue, options) =>
                inputValue &&
                !options.some(
                  (opt) => opt.value.toLowerCase() === inputValue.toLowerCase(),
                )
              }
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
