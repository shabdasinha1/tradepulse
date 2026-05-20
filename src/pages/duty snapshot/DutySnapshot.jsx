import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useInfiniteQuery,useQuery } from "@tanstack/react-query";
import { FiSliders } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";

import {
  DutySnapshotData,
  DutyRateGraph,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";

import GlobalFilterPanel from "../../components/global/GlobalFilterPanel";
import PageDisclaimer from "../../components/common/PageDisclaimer";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";
import useUniversalFilters from "../../hooks/useUniversalFilters";
import TPChart from "../../components/common/TPChart";

/* ===============================
   SKELETON
================================ */
const Skeleton = React.memo(({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
));

/* ===============================
   MAIN COMPONENT
================================ */
const DutySnapshot = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [error, setError] = useState(null);

  const { reporterCode, corridor } = useSelector(
    (state) => state.corridor,
    shallowEqual,
  );

  const { filters, setFilters } = useUniversalFilters({
    partnerCode: "",
    startDate: "",
    endDate: "",
  });

  const shortCorridor = useMemo(() => {
    return corridor?.includes(",") ? corridor.split(",")[0] + "..." : corridor;
  }, [corridor]);

  const observer = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  /* ===============================
     SCROLL SYNC
  =============================== */
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

  /* ===============================
     DATE FORMAT
  =============================== */
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
      "dutySnapshot",
      reporterCode,
      filters.partnerCode,
      filters.startDate,
      filters.endDate,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await DutySnapshotData({
          reporterCode,
          partnerCode: filters.partnerCode,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: pageParam,
          limit: 20,
        });

        return res?.data || [];
      } catch (err) {
        setError(GetApiErrorMessage(err));
        return [];
      }
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 20 ? undefined : pages.length + 1;
    },
    enabled: !!reporterCode && !!filters.partnerCode,
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
   DUTY GRAPH QUERY
================================ */

const { data: dutyGraphData } = useQuery({
  queryKey: [
    "dutyRateGraph",
    reporterCode,
    filters.startDate,
    filters.endDate,
  ],

  queryFn: async () => {
    try {
      const res = await DutyRateGraph({
        reporterCode,
        periodType: "custom",
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      return res?.data || {};
    } catch (err) {
      console.error(err);
      return {};
    }
  },

  enabled: !!reporterCode,
});

/* ===============================
   DUTY GRAPH DATA
================================ */

const dutyTrendData = useMemo(() => {
  return (dutyGraphData?.history || []).map((item) => ({
    period: item.period,
    duty: item.avgDuty,
  }));
}, [dutyGraphData]);
  /* ===============================
     ROW RENDER
  =============================== */
  const tableRows = useMemo(() => {
    return rows.map((item, index) => {
      const isLast = rows.length === index + 1;

      return (
        <div
          key={item.hsCode + index}
          ref={isLast ? lastRowRef : null}
          className="tp-table-row tp-duty-row"
        >
          <span>
            {item.hsCode} - {item.category}
          </span>

          <span className="text-center">
            {item.date ? formatDate(item.date) : "-"}
          </span>

          <span className="text-center tp-font-data">
            {item.minTariff !== null ? `${item.minTariff}%` : "-"}
          </span>

          <span className="text-center tp-font-data">
            {item.maxTariff !== null ? `${item.maxTariff}%` : "-"}
          </span>

          <span className="text-center tp-font-data">
            {item.avgTariff !== null ? `${item.avgTariff}%` : "-"}
          </span>
          <span className="text-center tp-font-data">{item.range || "-"}</span>
        </div>
      );
    });
  }, [rows, lastRowRef]);

  /* ===============================
     UI
  =============================== */
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            Duty <span>Rates</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Analyze tariff structure across selected trade corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              {/* <div className="tp-corridor-pill">
                <span>Active Corridor :</span>
                <span className="tp-country-truncate" title={corridor}>
                  {shortCorridor || "Selected Corridor"}
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

        {/* DISCLAIMER */}
        <PageDisclaimer />

{/* =========================================
    HISTORICAL DUTY RATE TREND
========================================= */}

<div className="tp-duty-trend-section">

  <div className="tp-supplier-analysis-label">
    • HISTORICAL DUTY RATE TREND
  </div>

  <div className="tp-duty-trend-card">

 
    {/* CHART */}
    <div className="tp-duty-chart-main">

      <TPChart
  title="Duty Rate Trend"
  type="bar"
  xKey="period"
  data={dutyTrendData}
  filterConfig={{
    showProduct: false,
    showTimeRange: true,
  }}
  activeFilters={{
    startDate: filters.startDate,
    endDate: filters.endDate,
  }}
  onFilterChange={(values) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
    }));
  }}
  series={[
    {
      key: "duty",
      label: "Avg Duty %",
    },
  ]}
/>

    </div>

    {/* FOOTER */}
    <div className="tp-duty-trend-footer">

      <div className="tp-duty-stat">

        <span className="tp-duty-stat-label">
          Current Avg Duty
        </span>

        <span className="tp-duty-stat-value">
        {dutyGraphData?.currentAvgDuty || 0}%
        </span>

      </div>

      <div className="tp-duty-stat">

        <span className="tp-duty-stat-label">
          YoY Change
        </span>

        <span className="tp-duty-stat-value tp-text-up">
        {dutyGraphData?.yoyChange || "-"}
        </span>

      </div>

      <div className="tp-duty-stat">

        <span className="tp-duty-stat-label">
          Risk Outlook
        </span>

        <span className="tp-duty-stat-value">
         {dutyGraphData?.riskOutlook || "-"}
        </span>

      </div>

    </div>

  </div>

</div>

        {/* ERROR */}
        {error && (
          <div className="tp-error-box">
            <p>{error}</p>
          </div>
        )}

        {/* TABLE */}
        <div className="tp-card">
          <div className="tp-table-header">
            <h3 className="tp-table-title">Duty Breakdown</h3>

            <button
              className="tp-btn-outline tp-overview-filter-btn"
              onClick={() => setTableFilterOpen(true)}
            >
              <CiFilter />
              Filters
            </button>
          </div>

          <div className="tp-table-wrapper-duty">
            {/* HEADER */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-duty-row">
                <span>Product</span>
                <span className="text-center">Date</span>
                <span className="text-center">Min Tariff</span>
                <span className="text-center">Max Tariff</span>
                <span className="text-center">Avg Tariff</span>
                <span className="text-center">Range</span>
              </div>
            </div>

            {/* BODY */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="tp-table">
                {rows.length === 0 && !isLoading ? (
                  <EmptyState message="No Duty Data Found" />
                ) : (
                  tableRows
                )}

                {(isLoading || isFetchingNextPage) &&
                  [...Array(5)].map((_, i) => (
                    <div className="tp-table-row tp-duty-row" key={i}>
                      {[...Array(6)].map((_, j) => (
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

      {/* TABLE FILTER */}
      {tableFilterOpen && (
        <UniversalFilter
         
          showTimeRange
          defaultValues={filters}
          onChange={(values) => {
            setFilters((prev) => ({ ...prev, ...values }));
            setTableFilterOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default DutySnapshot;
