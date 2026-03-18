import React, { useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import { DashboardSuppliers } from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { queryKeys } from "../../utils/queryKeys";

const LIMIT = 20;

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

  const { reporterCode, startDate, endDate, corridor } = useSelector(
    (state) => state.corridor,
  );
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
    queryKey: queryKeys.suppliers(reporterCode, startDate, endDate),

    queryFn: async ({ pageParam = 1 }) => {
      const res = await DashboardSuppliers({
        reporterCode,
        startDate,
        endDate,
        page: pageParam,
        limit: LIMIT,
      });

      return res?.data?.suppliers || [];
    },

    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === LIMIT ? pages.length + 1 : undefined;
    },

    enabled: !!reporterCode,
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
              <div className="tp-corridor-pill">
                <span className="tp-country">Active Corridor : </span>

                <span
                  className="tp-country tp-country-truncate"
                  title={corridor || "Selected Corridor"}
                >
                  {shortCorridor}
                </span>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFilterOpen(true)}
              >
                <FiSliders />
                Filters
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
              <div className="tp-table-head tp-table-suppliers">
                <span>Exporter Name</span>
                <span className="text-center">Origin Country</span>
                <span className="text-center">Reliability Score</span>
                <span className="text-center">Activity Level</span>
                <span className="text-center">Shipment Frequency</span>
              </div>
            </div>

            {/* BODY SCROLL */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              {/* <div className="tp-table">
                {suppliers.map((s, i) => (
                  <div key={i} className="tp-table-row tp-table-suppliers">
                    <div className="supplier-name">
                      <strong>{s.exporter_name}</strong>
                    </div>

                    <span className="tp-muted text-center">
                      {s.origin_region}
                    </span>

                    <span className="text-center">
                      <span className="tp-pill tp-pill-success">
                        {s.reliability_score}
                      </span>
                    </span>

                    <span className="text-center">
                      <span className="tp-pill tp-pill-primary">
                        {s.activity_level}
                      </span>
                    </span>

                    <strong className="text-center">{s.trade_activity}</strong>
                  </div>
                ))}
              </div> */}
              <div className="tp-table">
                {isLoading && skeletonRows}

                {!isLoading &&
                  suppliers.map((s, i) => {
                    const isLast = suppliers.length === i + 1;
                    return (
                      <div
                        key={i}
                        ref={isLast ? lastSupplierRef : null}
                        className="tp-table-row tp-table-suppliers"
                      >
                        <div className="supplier-name">
                          {/* <strong>{s.exporter_name}</strong> */}
                          {s.exporter_name}
                        </div>

                        <span className="tp-muted text-center">
                          {s.origin_region}
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-success">
                            {s.reliability_score}
                          </span>
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-primary">
                            {s.activity_level}
                          </span>
                        </span>

                        <span className="text-center">
                          {s.trade_activity}
                        </span>
                      </div>
                    );
                  })}
                {isFetchingNextPage && skeletonRows}
              </div>
              {!isLoading && suppliers.length === 0 && (
                <div className="tp-table-row tp-table-suppliers">
                  <span className="tp-muted">No suppliers found</span>
                </div>
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>

      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}
    </section>
  );
};

export default Suppliers;
