import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";
import { FXRatesData } from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys";

const LIMIT = 20;

/* ===============================
   SKELETON
================================ */
const FXRowSkeleton = () => (
  <div className="tp-table-row tp-table-fx-dashboard skeleton">
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-pill" />
  </div>
);

const FXRates = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  const { reporterCode, partnerCode, startDate, endDate } = useSelector(
    (state) => state.corridor,
  );

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const observer = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // ignore if clicking inside filter
      if (filterRef.current?.contains(event.target)) return;

      // ignore react-select dropdowns
      if (event.target.closest(".tp-select__menu")) return;

      // ignore filter button click
      if (event.target.closest(".tp-filter-btn")) return;

      setTableFilterOpen(false);
    };

    if (tableFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tableFilterOpen]);
  /* ===============================
     FETCH DATA
  =============================== */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: queryKeys.exchangeRates(
        reporterCode,
        partnerCode,
        startDate,
        endDate,
      ),

      queryFn: async ({ pageParam = 1 }) => {
        const res = await FXRatesData({
          page: pageParam,
          limit: LIMIT,
          reporterCode,
          partnerCode,
          startDate,
          endDate,
        });

        return res; // full object
      },

      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },

      enabled: !!reporterCode && !!partnerCode,
      refetchOnWindowFocus: false,
    });

  /* ===============================
     FLATTEN DATA (FIXED)
  =============================== */
  const fxRates = useMemo(() => {
    return data?.pages?.flatMap((p) => p?.data || []) || [];
  }, [data]);

  /* ===============================
     INFINITE SCROLL
  =============================== */
  const lastRowRef = React.useCallback(
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

  /* ===============================
     SCROLL SYNC
  =============================== */
  const handleHeaderScroll = () => {
    if (bodyRef.current)
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
  };

  const handleBodyScroll = () => {
    if (headerRef.current)
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  };

  /* ===============================
     HELPERS
  =============================== */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getRiskClass = (risk) => {
    switch (risk) {
      case "Low":
        return "tp-pill-success";
      case "Medium":
        return "tp-pill-warning";
      case "High":
        return "tp-pill-danger";
      default:
        return "tp-pill-primary";
    }
  };

  const skeletonRows = useMemo(
    () => [...Array(5)].map((_, i) => <FXRowSkeleton key={i} />),
    [],
  );

  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            Exchange Rate <span>Intelligence</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Track currency trends and risk levels across selected trade
              corridors.
            </p>

            <div className="tp-filter-btn-wrapper">
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

        {/* CARD */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-fx-header">
              <h3 className="tp-card-title">Exchange Rates</h3>

              <button
                className="tp-btn-outline tp-filter-btn"
                onClick={() => setTableFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>
            </div>
          }
        >
          <div className="tp-table-wrapper-fx">
            {/* HEADER */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-table-fx-dashboard">
                <span>Pair</span>
                <span className="text-center">Type</span>
                <span className="text-center">Rate</span>
                <span className="text-center">Date</span>
                <span className="text-center">Volatility</span>
                <span className="text-center">Risk</span>
              </div>
            </div>

            {/* BODY */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="tp-table">
                {isLoading && skeletonRows}

                {fxRates.map((row, i) => {
                  const isLast = fxRates.length === i + 1;

                  return (
                    <div
                      key={i}
                      ref={isLast ? lastRowRef : null}
                      className="tp-table-row tp-table-fx-dashboard"
                    >
                      <div>{row.pair}</div>

                      <span className="text-center">{row.type}</span>

                      <span className="text-center">
                        {row.rate?.toFixed(4)}
                      </span>

                      <span className="text-center">
                        {formatDate(row.date)}
                      </span>

                      <span className="text-center">
                        {row.volatility !== null ? `${row.volatility}%` : "-"}
                      </span>

                      <span className="text-center">
                        <span
                          className={`tp-pill ${getRiskClass(row.risk_level)}`}
                        >
                          {row.risk_level}
                        </span>
                      </span>
                    </div>
                  );
                })}

                {isFetchingNextPage && skeletonRows}
              </div>

              {!isLoading && fxRates.length === 0 && (
                <EmptyState message="No exchange rates found" />
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>

      {/* FILTERS */}
      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}

      {tableFilterOpen && (
        <div
          className="tp-fx-universal-filter-wrapper"
          ref={filterRef}
          onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT
        >
          <UniversalFilter
            showCorridor
            showTimeRange
            showPartner
            onClose={() => setTableFilterOpen(false)}
          />
        </div>
      )}
    </section>
  );
};

export default FXRates;
