import React, { useMemo, useRef, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

import { DashboardCorridorNews } from "../../services/DashboardService.jsx";
import { FiSliders } from "react-icons/fi";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { CiFilter } from "react-icons/ci";
import UniversalFilter from "../../components/common/UniversalFilter.jsx";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";

/* ===============================
   MAIN COMPONENT
================================ */
const TradeNews = () => {
  const { countryCode, partnerCountryCode } = useSelector(
    (state) => state.corridor,
  );

  const observer = useRef();
  const corridorLabel = `${countryCode || ""} → ${partnerCountryCode || ""}`;

  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  const containerRef = useRef(null);
  /* ===============================
     FETCH (INFINITE QUERY)
  ============================== */
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tradeNews", countryCode, partnerCountryCode],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await DashboardCorridorNews({
        importer: countryCode,
        exporter: partnerCountryCode,
        page: pageParam,
        size: 5,
      });

      return res?.countryNews;
    },
    onSuccess: (data) => {
      console.log("PAGES:", data.pages);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.last) return undefined;

      return (lastPage.number ?? 0) + 1;
    },
    enabled: !!countryCode && !!partnerCountryCode,
  });
  //   console.log(data);

  /* ===============================
     FLATTEN DATA
  ============================== */
  const news = useMemo(() => {
    return data?.pages?.flatMap((p) => p?.content || []) || [];
  }, [data]);

  /* ===============================
     DATE FORMAT
  ============================== */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  /* ===============================
     INFINITE SCROLL
  ============================== */
  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (!containerRef.current) return; // ✅ ADD THIS

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          root: containerRef.current,
          rootMargin: "200px",
          threshold: 0.1,
        },
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  /* ===============================
     RENDER
  ============================== */
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            Corridor <span>Trade News</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Stay updated with real-time trade intelligence, policy shifts, and
              market signals across the selected corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              <div className="tp-corridor-pill">
                <span>Active Corridor :</span>
                <span className="tp-country-truncate" title={corridorLabel}>
                  {corridorLabel}
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

        {/* NEWS LIST */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-trade-news-table-header">
              <h3 className="tp-card-title">Latest Trade News</h3>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setTableFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>
            </div>
          }
        >
          {isLoading &&
            [...Array(5)].map((_, i) => (
              <div className="tp-news-row-card skeleton" key={i} />
            ))}

          <div className="tp-news-table-container" ref={containerRef}>
            {news.length === 0 && !isLoading ? (
              <EmptyState message="No trade news found" />
            ) : (
              <div className="tp-news-list">
                {news.map((item, index) => {
                  const isLast = news.length === index + 1;

                  return (
                    <div
                      key={index}
                      ref={isLast ? lastItemRef : null}
                      className="tp-news-row-card"
                    >
                      {/* LEFT */}
                      <div className="tp-news-row-left">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tp-news-title tp-news-link"
                        >
                          {item.title}
                        </a>

                        {item.summary && (
                          <p className="tp-news-summary">{item.summary}</p>
                        )}

                        <div className="tp-news-row-meta">
                          <span>{item.source}</span>
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="tp-news-row-right">
                        <span className="tp-badge">{item.sector}</span>
                        <span
                          className={`tp-badge tp-badge-${item.alertType?.toLowerCase() || "primary"}`}
                        >
                          {item.alertType}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {/* LOADING MORE */}
                {isFetchingNextPage &&
                  [...Array(3)].map((_, i) => (
                    <div className="tp-news-row-card skeleton" key={i} />
                  ))}
              </div>
            )}
          </div>
        </TradePulseCard>
      </div>
      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}

      {tableFilterOpen && (
        <UniversalFilter
          showCorridor
          showTimeRange
          onClose={() => setTableFilterOpen(false)}
          onChange={() => setTableFilterOpen(false)}
        />
      )}
    </section>
  );
};

export default TradeNews;
