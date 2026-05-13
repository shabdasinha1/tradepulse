import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FiSliders } from "react-icons/fi";

import { ShippingHistoryData } from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";

import GlobalFilterPanel from "../../components/global/GlobalFilterPanel";
import PageDisclaimer from "../../components/common/PageDisclaimer";
import EmptyState from "../../components/common/EmptyState";
import { CiFilter } from "react-icons/ci";
import UniversalFilter from "../../components/common/UniversalFilter";
import useUniversalFilters from "../../hooks/useUniversalFilters";
import useCurrency from "../../hooks/useCurrency";

/* ===============================
   SKELETON
================================ */
const Skeleton = React.memo(({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
));

/* ===============================
   MAIN COMPONENT
================================ */
const ShippingHistory = () => {
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const { reporterCode, corridor, currencySymbol } = useSelector(
    (state) => state.corridor,
    shallowEqual,
  );

  const { convert,isFxReady } = useCurrency();
  const { filters, setFilters } = useUniversalFilters({
    partnerCode: "",
    startDate: "",
    endDate: "",
  });

  const shortCorridor = useMemo(() => {
    return corridor?.includes(",") ? corridor.split(",")[0] + "..." : corridor;
  }, [corridor]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  /* ===============================
     QUERY
  =============================== */
  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "shippingHistory",
      reporterCode,
      filters.partnerCode,
      filters.startDate,
      filters.endDate,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await ShippingHistoryData({
          reporterCode,
          partnerCode: filters.partnerCode,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: pageParam,
          limit: 10,
        });
        return res?.data || [];
      } catch (err) {
        setError(GetApiErrorMessage(err));
        return [];
      }
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 10 ? undefined : pages.length + 1;
    },
    enabled: isFxReady && !!reporterCode && !!filters.partnerCode,
  });

  /* ===============================
     INFINITE SCROLL
  =============================== */
  const lastRowRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "200px" },
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  /* ===============================
     DATA FLATTEN
  =============================== */
  const rows = useMemo(() => {
    return pages?.pages?.flat() || [];
  }, [pages]);

  /* ===============================
     ROW RENDER
  =============================== */
  const tableRows = useMemo(() => {
    return rows.map((item, index) => {
      const isLast = rows.length === index + 1;

      const trendClass =
        item.trend === "up"
          ? "tp-pill-success"
          : item.trend === "down"
            ? "tp-pill-danger"
            : "tp-pill-warning";

      return (
        <div
          key={index}
          ref={isLast ? lastRowRef : null}
          className="tp-table-row tp-table-suppliers"
        >
          <span>{item.route}</span>

          <span className="text-center">{formatDate(item.date)}</span>

       <span className="text-center tp-font-data">
  {currencySymbol || ""}
  {convert(item.value, item.unit || "USD").toFixed(2)}
</span>
          <span
            className={`text-center tp-font-data ${
              item.changePercent > 0
                ? "tp-text-up"
                : item.changePercent < 0
                  ? "tp-text-down"
                  : "tp-text-neutral"
            }`}
          >
            {item.changePercent !== null ? `${item.changePercent}%` : "-"}
          </span>
          <span className="text-center">
            <span className={`tp-pill ${trendClass}`}>{item.trend}</span>
          </span>
        </div>
      );
    });
  }, [rows, lastRowRef, currencySymbol, convert,isFxReady]);

  /* ===============================
     UI
  =============================== */
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            Corridor <span>Shipping Cost </span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Track historical freight rate movements across selected trade
              corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              <div className="tp-corridor-pill">
                <span>Active Corridor :</span>
                <span className="tp-country-truncate" title={corridor}>
                  {shortCorridor || "Selected Corridor"}
                </span>
              </div>

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

        {/* DISCLAIMER */}
        <PageDisclaimer />

        {/* TABLE */}
        <div className="tp-card">
          <div className="tp-table-header">
            <h3 className="tp-table-title">Shipping History</h3>
            <button
              className="tp-btn-outline tp-overview-filter-btn"
              onClick={() => setTableFilterOpen(true)}
            >
              <CiFilter />
              Filters
            </button>
          </div>

          <div className="tp-table-wrapper-suppliers">
            {/* HEADER */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-table-suppliers">
                <span>Route</span>
                <span className="text-center">Date</span>
                <span className="text-center">Price</span>
                <span className="text-center">Change %</span>
                <span className="text-center">Trend</span>
              </div>
            </div>

            {/* BODY */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="tp-table tp-table-shipping-history">
               {!isFxReady ? (
  <EmptyState message="Loading currency data..." />
) : rows.length === 0 && !isLoading ? (
  <EmptyState message="No Shipping History Found" />
) : (
  tableRows
)}
                {(isLoading || isFetchingNextPage) &&
                  [...Array(5)].map((_, i) => (
                    <div className="tp-table-row tp-table-suppliers" key={i}>
                      {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="sk-table-cell" />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL FILTER */}
      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}

      {tableFilterOpen && (
        <UniversalFilter
          showCorridor
          showProduct
          showTimeRange
          showRiskLevel
          onChange={(values) => {
            setFilters((prev) => ({ ...prev, ...values }));
            setTableFilterOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default ShippingHistory;
