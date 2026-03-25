import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import { DashboardCompanySuppliers } from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";
import useUniversalFilters from "../../hooks/useUniversalFilters";
import { CiFilter } from "react-icons/ci";

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
            <h2>{data.company_name}</h2>
            <p className="tp-modal-sub">
              {data.country_iso3} • {data.region} • {data.sector}
            </p>
          </div>

          <div className="tp-modal-header-right">
            <span className="tp-pill tp-pill-primary">
              {data.verification_status}
            </span>

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
              <span className="tp-modal-metric-value">
                {data.reliability_score}
              </span>
              <span className="tp-modal-metric-label">Reliability</span>
            </div>

            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value">
                {data.product_count}
              </span>
              <span className="tp-modal-metric-label">Shipments</span>
            </div>

            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value">
                {data.products?.length || 0}
              </span>
              <span className="tp-modal-metric-label">Products</span>
            </div>
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="tp-modal-grid">
            <div>
              <span className="tp-modal-label">Country</span>
              <span>{data.country_iso3}</span>
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

          {/* ===== PRODUCTS ===== */}
          <div className="tp-modal-products">
            <div className="tp-modal-section-title">Products</div>

            <div className="tp-modal-product-list">
              {data.products?.length ? (
                data.products.map((p, i) => (
                  <div key={i} className="tp-modal-product-item">
                    {p}
                  </div>
                ))
              ) : (
                <div className="tp-empty-text">No products available</div>
              )}
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasMounted = useRef(false);
  const hasFetchedInitially = useRef(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    queryKey: queryKeys.suppliers({ partnerRegion }),

    queryFn: async ({ pageParam = 1 }) => {
      const res = await DashboardCompanySuppliers({
        page: pageParam,
        limit: LIMIT,
        region: partnerRegion, // ✅ ONLY THIS PARAM
      });

      return res?.data?.suppliers || [];
    },

    getNextPageParam: (lastPage, pages) =>
      lastPage.length === LIMIT ? pages.length + 1 : undefined,

    enabled: !!partnerRegion,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
              {/* <div className="tp-corridor-pill">
                <span className="tp-country">Active Corridor : </span>

                <span
                  className="tp-country tp-country-truncate"
                  title={corridor || "Selected Corridor"}
                >
                  {shortCorridor}
                </span>
              </div> */}

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFilterOpen(true)}
              >
                <FiSliders />
                Global Filters
              </button>
            </div>
          </div>
        </header>

        <span className="tp-product-disclaimer">
          <PageDisclaimer />
        </span>

        <TradePulseCard
          header={
            <div className="tp-card-header tp-supplier-header">
              <h3 className="tp-card-title">Supplier Directory</h3>

              {/* <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setTableFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button> */}
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
                <span>Company Name</span>
                <span className="text-center">Country</span>
                <span className="text-center">Region</span>
                <span className="text-center">Sector</span>
                <span className="text-center">Reliability</span>
                <span className="text-center">Status</span>
                <span className="text-center">Products</span>
                <span className="text-center">Shipment Count</span>
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

                {!isLoading &&
                  suppliers.map((s, i) => {
                    const isLast = suppliers.length === i + 1;
                    return (
                      <div
                        key={i}
                        ref={isLast ? lastSupplierRef : null}
                        className="tp-table-row tp-table-suppliers-dashboard"
                        onClick={() => {
                          setSelectedSupplier(s);
                          setIsModalOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {/* NAME */}
                        <div className="supplier-name">{s.company_name}</div>

                        {/* COUNTRY */}
                        <span className="tp-muted text-center">
                          {s.country_iso3}
                        </span>

                        {/* REGION */}
                        <span className="tp-muted text-center">{s.region}</span>

                        {/* SECTOR */}
                        <span className="tp-muted text-center">{s.sector}</span>

                        {/* RELIABILITY */}
                        <span className="text-center">
                          <span
                            className={`tp-pill ${
                              s.reliability_score < 0.3
                                ? "tp-pill-danger"
                                : s.reliability_score < 0.5
                                  ? "tp-pill-warning"
                                  : "tp-pill-success"
                            }`}
                          >
                            {s.reliability_score}
                          </span>
                        </span>

                        {/* STATUS */}
                        <span className="text-center">
                          <span
                            className={`tp-pill ${getStatusClass(s.verification_status)}`}
                          >
                            {s.verification_status}
                          </span>
                        </span>

                        {/* PRODUCTS */}
                        {/* <span className="text-center">
                          {s.products?.length ? s.products[0] : "-"}
                        </span> */}
                        <span className="text-center">
                          {s.products?.length ? (
                            <span title={s.products.join(", ")}>
                              {s.products[0].slice(0, 30)}...
                            </span>
                          ) : (
                            "-"
                          )}
                        </span>

                        {/* COUNT */}
                        <span className="text-center">{s.product_count}</span>
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
      {/* {tableFilterOpen && (
        <UniversalFilter
          showCorridor
          showTimeRange
          showPartner

          onClose={() => setTableFilterOpen(false)}
          onChange={(filters) => {
            if (!filters.partnerCode) {
              setIsInitialLoad(true);   // ✅ RESET FLOW
            } else {
              setIsInitialLoad(false);
            }

            setTableFilterOpen(false);
          }}
        />
      )} */}
      {isModalOpen && (
        <SupplierModal
          data={selectedSupplier}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default Suppliers;
