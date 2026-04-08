import React, { useMemo, useRef, useCallback, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

import { DashboardCorridorNews } from "../../services/DashboardService.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { CiFilter } from "react-icons/ci";
import UniversalFilter from "../../components/common/UniversalFilter.jsx";
import useUniversalFilters from "../../hooks/useUniversalFilters";

/* ===============================
   MAIN COMPONENT
================================ */
const TradeNews = () => {
  const { countryCode, partnerCountryCode } = useSelector(
    (state) => state.corridor,
  );

  const corridorLabel = `${countryCode || ""} → ${partnerCountryCode || ""}`;
  const containerRef = useRef(null);
  const observer = useRef();

  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  // ===============================
  // USE UNIVERSAL FILTERS HOOK
  // ===============================
  const { filters, setFilters } = useUniversalFilters({
    corridorFrom: countryCode,
    corridorTo: partnerCountryCode,
    sector: "",
    alertType: "",
  });

  const buildParams = (pageParam = 0, filters) => ({
    importer: filters.corridorFrom,
    exporter: filters.corridorTo,
    page: pageParam,
    size: 5,
    sector: filters.sector || undefined,
    alertType: filters.alertType || undefined,
  });

  // ===============================
  // QUERY
  // ===============================
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "tradeNews",
        countryCode,
        partnerCountryCode,
        filters.sector,
        filters.alertType,
        filters.startDate,
        filters.endDate,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        const params = buildParams(pageParam, filters);
        const res = await DashboardCorridorNews(params);

        return {
          country: res?.countryNews,
          corridor: res?.corridorNews,
        };
      },
      getNextPageParam: (lastPage) => {
        const countryLast = lastPage?.country?.last;
        const corridorLast = lastPage?.corridor?.last;
        if (countryLast && corridorLast) return undefined;
        return (lastPage?.country?.number ?? 0) + 1;
      },
      enabled: !!countryCode && !!partnerCountryCode,
    });

  // ===============================
  // FLATTEN DATA
  // ===============================
  const news = useMemo(() => {
    if (!data?.pages) return [];
    const merged = [];
    data.pages.forEach((page) => {
      const countryList = page?.country?.content || [];
      const corridorList = page?.corridor?.content || [];
      const maxLength = Math.max(countryList.length, corridorList.length);
      for (let i = 0; i < maxLength; i++) {
        if (countryList[i]) merged.push(countryList[i]);
        if (corridorList[i]) merged.push(corridorList[i]);
      }
    });
    return merged;
  }, [data]);

  // ===============================
  // DATE FORMAT
  // ===============================
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // ===============================
  // INFINITE SCROLL
  // ===============================
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (!containerRef.current) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { root: containerRef.current, rootMargin: "200px", threshold: 0.1 },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  // ===============================
  // NORMALIZE FILTERS
  // ===============================
  const normalizeFilters = (f) => ({
    sector: f.sector || "",
    alertType: f.alertType || "",
    startDate: f.startDate || "",
    endDate: f.endDate || "",
  });

  // ===============================
  // RENDER
  // ===============================
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
                onClick={() => setTableFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>
            </div>
          </div>
        </header>

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
                          <span className="tp-trade-news-date">
                            {formatDate(item.publishedAt)}
                          </span>
                          <span className="tp-trade-news-countries">
                            {item?.countries.map((name) => (
                              <span className="tp-pill tp-pill-primary">
                                {name}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="tp-news-row-right">
                        <span className="tp-badge tp-badge-warning">
                          {item.sector}
                        </span>
                        <span className="tp-badge tp-badge-primary">
                          {item.alertType}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isFetchingNextPage &&
                  [...Array(3)].map((_, i) => (
                    <div className="tp-news-row-card skeleton" key={i} />
                  ))}
              </div>
            )}
          </div>
        </TradePulseCard>
      </div>

      {/* TABLE FILTER */}
      {tableFilterOpen && (
        <UniversalFilter
          showCorridor
          showAlertType
          showSector
          defaultValues={filters}
          onClose={() => setTableFilterOpen(false)}
          onChange={(values) => {
            const normalizedNew = normalizeFilters(values);
            const normalizedOld = normalizeFilters(filters);

            // ✅ Avoid API call if nothing changed
            const isSame =
              JSON.stringify(normalizedNew) === JSON.stringify(normalizedOld);
            if (isSame) {
              setTableFilterOpen(false);
              return;
            }

            setFilters(normalizedNew);
            setTableFilterOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default TradeNews;
