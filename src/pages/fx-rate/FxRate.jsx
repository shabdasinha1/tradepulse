import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";
import {
  FXRatesData,
  FXGraph,
} from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys";
import useUniversalFilters from "../../hooks/useUniversalFilters";
import TPChart from "../../components/common/TPChart.jsx";

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
  const reporterCode = useSelector((state) => state.corridor.reporterCode);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  /* ===============================
   GRAPH FILTERS
================================ */

const {
  filters: graphFilters,
  setFilters: setGraphFilters,
} = useUniversalFilters({
  partnerCode: "",
  startDate: "",
  endDate: "",
});

/* ===============================
   TABLE FILTERS
================================ */

const {
  filters: tableFilters,
  setFilters: setTableFilters,
} = useUniversalFilters({
  partnerCode: "",
  product: "",
  startDate: "",
  endDate: "",
});
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const observer = useRef(null);

  /* ===============================
     FETCH DATA
  =============================== */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: queryKeys.fxRates(
        reporterCode,
   tableFilters.partnerCode,
tableFilters.startDate,
tableFilters.endDate,
      ),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await FXRatesData({
          page: pageParam,
          limit: LIMIT,
          reporterCode: reporterCode, 
          partnerCode: tableFilters.partnerCode,
startDate: tableFilters.startDate,
endDate: tableFilters.endDate,
        });
        return res;
      },
      enabled: !!reporterCode,

      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },
    });

  /* ===============================
     FLATTEN DATA (FIXED)
  =============================== */
  const fxRates = useMemo(() => {
  if (!data?.pages) return [];

  return data.pages.flatMap((p) =>
    Array.isArray(p?.data) ? p.data : []
  );
}, [data]);

/* ===============================
   FX GRAPH QUERY
================================ */

const { data: fxGraphData } = useQuery({
  queryKey: [
    "fxGraph",
    reporterCode,
    graphFilters.partnerCode,
graphFilters.startDate,
graphFilters.endDate,
  ],

  queryFn: async () => {
    try {
      const res = await FXGraph({
        reporterCode,
      partnerCode: graphFilters.partnerCode,
        periodType: "custom",
      startDate: graphFilters.startDate,
endDate: graphFilters.endDate,
      });

      return res?.data || {};
    } catch (err) {
      console.error(err);
      return {};
    }
  },

  enabled:
    !!reporterCode &&
    !!graphFilters.partnerCode,
});
/* ===============================
   FX GRAPH DATA
================================ */

const fxTrendData = useMemo(() => {
  return (fxGraphData?.history || []).map((item) => ({
    period: item.period,
    rate: item.rate,
  }));
}, [fxGraphData]);

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
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

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

  if (!reporterCode) {
  return <div>Loading...</div>;
}

  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            FX <span>Rates</span>
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

         {/* =========================================
    HISTORICAL FX TREND
========================================= */}

<div className="tp-fx-trend-section">

  <div className="tp-supplier-analysis-label">
    • HISTORICAL FX TREND
  </div>

  <div className="tp-fx-trend-card">



    {/* CHART */}
    <div className="tp-fx-chart-main">

      <TPChart
  title="FX Rate Trend"
  type="line"
  xKey="period"
  data={fxTrendData}
  filterConfig={{
    showProduct: false,
    showTimeRange: true,
  }}
  activeFilters={{
  startDate: graphFilters.startDate,
  endDate: graphFilters.endDate,
}}
 onFilterChange={(values) => {
  setGraphFilters((prev) => ({
    ...prev,
    ...values,
  }));
}}
        series={[
          {
            key: "rate",
            label: "FX Rate",
          },
        ]}
      />

    </div>

    {/* FOOTER */}
    <div className="tp-fx-trend-footer">

      <div className="tp-fx-stat">

        <span className="tp-fx-stat-label">
          Current Rate
        </span>

        <span className="tp-fx-stat-value">
         {fxGraphData?.currentRate || 0} NGN/£
        </span>

      </div>

      <div className="tp-fx-stat">

        <span className="tp-fx-stat-label">
          Volatility
        </span>

        <span className="tp-fx-stat-value tp-text-down">
        {fxGraphData?.volatility || "-"}
        </span>

      </div>

      <div className="tp-fx-stat">

        <span className="tp-fx-stat-label">
          5Y Change
        </span>

        <span className="tp-fx-stat-value tp-text-down">
         {fxGraphData?.change || "-"}
        </span>

      </div>

    </div>

  </div>

</div>

        {/* CARD */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-fx-header">
              <h3 className="tp-card-title">Exchange Rates</h3>

              <button
                className="tp-btn-outline tp-filter-btn tp-overview-filter-btn"
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
                {isLoading || !data ? skeletonRows : null}

                {fxRates.map((row, i) => {
                  const isLast = fxRates.length === i + 1;

                  return (
                    <div
                      key={row.id || `${row.pair}-${i}`}
                      ref={isLast ? lastRowRef : null}
                      className="tp-table-row tp-table-fx-dashboard"
                    >
                      <div>{row.pair}</div>

                      <span className="text-center">{row.type}</span>

                      <span className="text-center tp-font-data">
                        {typeof row.rate === "number" ? row.rate.toFixed(4) : "-"}
                      </span>

                      <span className="text-center">
                        {formatDate(row.date)}
                      </span>

                      <span className="text-center tp-font-data">
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
        <UniversalFilter
        
          showProduct
          showTimeRange
        defaultValues={tableFilters}
          onChange={(values) => {
           setTableFilters((prev) => ({
  ...prev,
  ...values,
}));
            setTableFilterOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default FXRates;
