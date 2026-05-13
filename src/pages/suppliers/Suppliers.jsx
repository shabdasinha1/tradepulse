import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import {
  DashboardSuppliers,
  DashboardCompanySuppliers,
} from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";
import useUniversalFilters from "../../hooks/useUniversalFilters";
import { CiFilter } from "react-icons/ci";
import { useAppToast } from "../../components/common/toast/toast.js";
import { Tooltip } from "react-tooltip";

const LIMIT = 20;
/* ==========================================================
          MODAL FOR SUPPLIERS TABLE
 ==========================================================*/
const SupplierModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="tp-supplier-modal-overlay" onClick={onClose}>
      <div
        className="tp-supplier-modal tp-supplier-modal-upgraded"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="tp-supplier-modal-header upgraded">
          <div>
            <h2>{data.name}</h2>
            <p className="tp-modal-sub">
              {data.iso_3} • {data.region}
            </p>
          </div>

          <div className="tp-modal-header-right">
            <span className="tp-pill tp-pill-primary">{data.tag}</span>

            <button onClick={onClose} className="tp-filter-close">
              ✕
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="tp-supplier-modal-body upgraded">
          {/* ===== METRICS ===== */}
          <div className="tp-modal-metrics">
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">
                {data.reliabilityScore}
              </span>
              <span className="tp-modal-metric-label">Reliability</span>
            </div>
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">{data.shipments}</span>
              <span className="tp-modal-metric-label">Shipments</span>
            </div>
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">
                {data.productDiversity}
              </span>
              <span className="tp-modal-metric-label">Products</span>
            </div>
            reparations
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="tp-modal-grid">
            <div>
              <span className="tp-modal-label">Country</span>
              <span>{data.iso_3}</span>
            </div>

            <div>
              <span className="tp-modal-label">Sector</span>
              <span>{data.sector}</span>
            </div>

            <div>
              <span className="tp-modal-label">Region</span>
              <span>{data.region}</span>
            </div>

            <div>
              <span className="tp-modal-label">Status</span>
              <span>{data.verification_status}</span>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="tp-supplier-modal-footer">
          <button className="tp-btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================
          SKELTON FOR SUPPLIERS
 ==========================================================*/

const SupplierRowSkeleton = React.memo(() => {
  return (
    <div className="tp-table-row tp-table-suppliers skeleton">
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-text" />
    </div>
  );
});

const Suppliers = () => {
  const toast = useAppToast();
  const [isCompanyView, setIsCompanyView] = useState(false);
  const [companySuppliers, setCompanySuppliers] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasMounted = useRef(false);
  const hasFetchedInitially = useRef(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [tooltipPos, setTooltipPos] = useState("top");

  const {
    tradeflow,
    reporterCode,
    startDate,
    endDate,
    corridor,
    partnerCode,
    region,
    partnerRegion,
  } = useSelector((state) => state.corridor);
  const skeletonRows = useMemo(
    () =>
      [...Array(5)].map((_, i) => (
        <SupplierRowSkeleton key={`skeleton-${i}`} />
      )),
    [],
  );

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const observer = useRef(null);

  const handleHeaderScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const shortCorridor = useMemo(() => {
    return corridor?.includes(",") ? corridor.split(",")[0] + "..." : corridor;
  }, [corridor]);
  /* ===============================
     FETCH SUPPLIERS USING REACT QUERY
  =============================== */

  const {
    data: supplierPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKeys.suppliers({
      partnerRegion,
      tradeflow,
      partnerCode,
      reporterCode,
      isInitialLoad,
    }),
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const [
        _,
        partnerRegion,
        tradeflow,
        reporterCode,
        partnerCode,
        isInitialLoad,
      ] = queryKey;

      let params = {
        page: pageParam,
        limit: LIMIT,
        originRegion: partnerRegion,
      };

      if (!isInitialLoad) {
        params = {
          ...params,
          tradeflow,
          partnerCode,
          reporterCode,
        };
      }

      // console.log("FINAL API PARAMS:", params); 

      const res = await DashboardSuppliers(params);
      return res?.data?.suppliers || [];
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === LIMIT ? pages.length + 1 : undefined,

    enabled: !!partnerRegion && !!tradeflow,

    refetchOnMount: false,
    refetchOnWindowFocus: false,

    keepPreviousData: false, // ✅ ADD THIS
  });

  const suppliers = useMemo(() => {
    return supplierPages?.pages?.flat() || [];
  }, [supplierPages]);
  const lastSupplierRef = React.useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  const getStatusClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "tp-pill-success";
      case "PARTIAL":
        return "tp-pill-warning";
      case "UNVERIFIED":
        return "tp-pill-danger";
      default:
        return "tp-pill-primary";
    }
  };
  const handleViewClick = async (iso3, countryName, searchValue = "") => {
    try {
      const res = await DashboardCompanySuppliers({
        page: 1,
        limit: 20,
        country: iso3,
        search: searchValue,
      });

      const data = res?.data?.suppliers || [];

      if (!data.length) {
        toast.warning(`No supplier data available for ${countryName}`);
        return;
      }

      setCompanySuppliers(data);
      setIsCompanyView(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        <header>
          <h1 className="tp-section-title">
            Exporter Reliability <span>Intelligence</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Structured exporter activity insights within selected corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              {!isCompanyView && (
                <button
                  className="tp-btn-outline tp-overview-filter-btn"
                  onClick={() => setFilterOpen(true)}
                >
                  <FiSliders />
                  Global Filters
                </button>
              )}
            </div>
          </div>
        </header>

        <span className="tp-product-disclaimer">
          <PageDisclaimer />
        </span>

        <TradePulseCard
          header={
            <div className="tp-card-header tp-supplier-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {isCompanyView && (
                  <button
                    className="tp-btn-outline tp-btn-sm"
                    onClick={() => setIsCompanyView(false)}
                  >
                    ← Back
                  </button>
                )}
                <h3 className="tp-card-title">Supplier Directory</h3>
              </div>

              {/* ✅ ADD THIS BLOCK */}
              {isCompanyView ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Search company..."
                    className="tp-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button
                    className="tp-btn-outline tp-btn-sm"
                    onClick={() => {
                      if (selectedCountry) {
                        handleViewClick(
                          selectedCountry.iso3,
                          selectedCountry.name,
                          search,
                        );
                      }
                    }}
                  >
                    Search
                  </button>

                  {/* ✅ ADD THIS FILTER BUTTON */}
                  <button
                    className="tp-btn-outline tp-btn-sm"
                    onClick={() => setTableFilterOpen(true)}
                  >
                    <CiFilter />
                  </button>
                </div>
              ) : (
                <button
                  className="tp-btn-outline tp-overview-filter-btn"
                  onClick={() => setTableFilterOpen(true)}
                >
                  <CiFilter />
                  Filters
                </button>
              )}
            </div>
          }
        >
          <div className="tp-table-wrapper-suppliers">
            {/* HEADER SCROLL */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-table-suppliers-dashboard">
                {!isCompanyView ? (
                  <>
                    <span>Country Name</span>

                    <span className="text-center">Region</span>
                    <span className="text-center">Activity</span>
                    <span className="text-center">Reliability</span>
                    <span className="text-center">Tag</span>
                    <span className="text-center">Product Diversity</span>
                    <span className="text-center">Shipments</span>
                    <span className="text-center">Action</span>
                  </>
                ) : (
                  <>
                    <span>Company Name</span>
                    <span className="text-center">Country</span>
                    <span className="text-center">Region</span>
                    <span className="text-center">Sector</span>
                    <span className="text-center">Reliability</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Products</span>
                    <span className="text-center">Product Count</span>
                  </>
                )}
              </div>
            </div>

            {/* BODY SCROLL */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="tp-table">
                {isLoading && skeletonRows}

                {!isCompanyView
                  ? suppliers.map((s, i) => {
                      const isLast = suppliers.length === i + 1;

                      return (
                        <div
                          key={i}
                          ref={isLast ? lastSupplierRef : null}
                          className="tp-table-row tp-table-suppliers-dashboard"
                          style={{ cursor: "default" }}
                        >
                          <div className="supplier-name">{s.name}</div>

                          <span className="tp-muted text-center">
                            {s.region}
                          </span>

                          <span className="text-center">
                            <span
                              className={`tp-pill ${
                                s.activityLevel === "Very High"
                                  ? "tp-pill-success"
                                  : s.activityLevel === "High"
                                    ? "tp-pill-primary"
                                    : s.activityLevel === "Medium"
                                      ? "tp-pill-warning"
                                      : "tp-pill-danger"
                              }`}
                            >
                              {s.activityLevel}
                            </span>
                          </span>

                          <span className="text-center">
                            <span
                              className={`tp-pill tp-font-data ${
                                s.reliabilityScore < 30
                                  ? "tp-pill-danger"
                                  : s.reliabilityScore < 50
                                    ? "tp-pill-warning"
                                    : "tp-pill-success"
                              }`}
                            >
                              {s.reliabilityScore}
                            </span>
                          </span>

                          <span className="text-center">
                            <span className="tp-pill tp-pill-primary">
                              {s.tag}
                            </span>
                          </span>

                          <span className="text-center tp-font-data">
                            {s.productDiversity}
                          </span>
                          <span className="text-center tp-font-data">{s.shipments}</span>

                          <span className="text-center">
                            <button
                              className="tp-btn-outline tp-btn-sm"
                              onClick={() => {
                                setSelectedCountry({
                                  iso3: s.iso_3,
                                  name: s.name,
                                });
                                handleViewClick(s.iso_3, s.name);
                              }}
                            >
                              View
                            </button>
                          </span>
                        </div>
                      );
                    })
                  : companySuppliers.map((c, i) => {
                      const product = c.products?.[0] || "-";
                      const isLong = product.length > 50;
                      return (
                        <div
                          key={i}
                          className="tp-table-row tp-table-suppliers-dashboard"
                        >
                          <div className="supplier-name">{c.company_name}</div>
                          <span className="text-center">{c.country_name}</span>
                          <span className="text-center">{c.region}</span>
                          <span className="text-center">{c.sector}</span>

                          <span className="text-center">
                            <span
                              className={`tp-pill tp-font-data${
                                c.reliability_score < 0.5
                                  ? "tp-pill-danger"
                                  : c.reliability_score < 0.8
                                    ? "tp-pill-warning"
                                    : "tp-pill-success"
                              }`}
                            >
                              {c.reliability_score}
                            </span>
                          </span>

                          <span className="text-center">
                            <span className="tp-pill tp-pill-primary">
                              {c.verification_status}
                            </span>
                          </span>
                          {/* <div
                          className="tp-product-cell-wrapper"
                          onClick={(e) => {
                            if (window.innerWidth > 768) return;
                            e.stopPropagation();

                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;

                            if (spaceBelow < 120) {
                              setTooltipPos("top");
                            } else {
                              setTooltipPos("bottom");
                            }

                            setActiveProduct(activeProduct === i ? null : i);
                          }}
                        >
                          <span
                            className="text-center tp-product-cell"
                            title={c.products?.[0] || "-"} // desktop hover
                          >
                            {c.products?.[0]
                              ? c.products[0].length > 50
                                ? `${c.products[0].slice(0, 50)}...`
                                : c.products[0]
                              : "-"}
                          </span>

                          {activeProduct === i && window.innerWidth <= 768 && (
                            <div className={`tp-product-tooltip ${tooltipPos}`}>
                              {c.products?.[0] || "-"}
                            </div>
                          )}
                        </div> */}
                          <span
                            className="text-center tp-product-cell"
                            data-tooltip-id={isLong ? "my-tooltip" : undefined}
                            data-tooltip-content={isLong ? product : undefined}
                          >
                            {isLong ? product.slice(0, 50) + "..." : product}
                          </span>
                          <Tooltip
                            id="my-tooltip"
                            className="tp-custom-tooltip"
                            place="top"
                            positionStrategy="fixed"
                            globalCloseEvents={{ scroll: true }}
                          />
                          <span className="text-center tp-font-data">{c.product_count}</span>
                        </div>
                      );
                    })}

                {isFetchingNextPage && skeletonRows}
              </div>
              {!isLoading && suppliers.length === 0 && (
                <EmptyState message="No suppliers found" />
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>

      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}
      {tableFilterOpen && (
        <span className="tp-supplier-universal-filter-wrapper">
          <UniversalFilter
            {...(!isCompanyView
              ? {
                  showCorridor: true,
                  showTimeRange: true,
                  showPartner: true,
                  showProduct: true,
                }
              : {
                  showProduct: true, // ✅ ONLY THIS IN COMPANY VIEW
                })}
            onClose={() => setTableFilterOpen(false)}
            onChange={(filters) => {
              console.log("FILTERS:", filters);

              if (!isCompanyView) {
                if (!filters.partnerCode) {
                  setIsInitialLoad(true);
                } else {
                  setIsInitialLoad(false);
                }
              }

              // (optional: later you can pass product filter to API here)

              setTableFilterOpen(false);
            }}
          />
        </span>
      )}
    </section>
  );
};

export default Suppliers;
