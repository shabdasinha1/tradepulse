import React, { useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { DashboardFeedback } from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys.jsx";
import { Tooltip } from "react-tooltip";

const LIMIT = 10;

/* ===============================
   SKELETON ROW
================================ */
const FeedbackRowSkeleton = React.memo(() => {
  return (
    <div className="tp-table-row tp-table-feedback skeleton">
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
    </div>
  );
});

const Feedback = () => {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const observer = useRef(null);
  const [activeEmail, setActiveEmail] = useState(null);
  const [tooltipPos, setTooltipPos] = useState("top");
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
     FETCH DATA
  =============================== */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: queryKeys.feedback(LIMIT),

      queryFn: async ({ pageParam = 1 }) => {
        const res = await DashboardFeedback({
          page: pageParam,
          limit: LIMIT,
        });

        return res?.data?.data || [];
      },

      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === LIMIT ? pages.length + 1 : undefined;
      },
    });

  const feedbacks = useMemo(() => {
    return data?.pages?.flat() || [];
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

  const skeletonRows = useMemo(
    () => [...Array(5)].map((_, i) => <FeedbackRowSkeleton key={`sk-${i}`} />),
    [],
  );

  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* ================= HEADER ================= */}
        <header>
          <h1 className="tp-section-title">
            User <span>Feedback Data</span>
          </h1>

          <p className="tp-section-sub">
            Explore structured responses submitted by users across global trade
            workflows.
          </p>
        </header>

        {/* ================= CARD ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Feedback Directory</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper-feedback">
            {/* HEADER */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-table-feedback">
                <span>Role</span>
                <span className="text-center">Company Size</span>
                <span className="text-center">Country</span>
                <span className="text-center">Challenge</span>
                <span className="text-center">Need</span>
                <span className="text-center">Intent</span>
                <span className="text-center">Email</span>
                <span className="text-center">Date</span>
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

                {!isLoading &&
                  feedbacks.map((f, i) => {
                    const isLast = feedbacks.length === i + 1;
                    const isLong = f.email?.length > 14;
                    return (
                      <div
                        key={f.id}
                        ref={isLast ? lastRowRef : null}
                        className="tp-table-row tp-table-feedback"
                      >
                        <div>{f.role}</div>

                        <span className="text-center">{f.company_size}</span>

                        <span className="text-center">{f.country}</span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-warning tp-feedback-pill">
                            {f.challenge}
                          </span>
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-primary tp-feedback-pill">
                            {f.help}
                          </span>
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-success tp-feedback-pill">
                            {f.this_platform}
                          </span>
                        </span>
                        {/* <div
                          className="tp-email-cell-wrapper"
                          onClick={(e) => {
                            if (window.innerWidth > 768) return;
                            e.stopPropagation();

                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const spaceAbove = rect.top;
                            const spaceBelow = window.innerHeight - rect.bottom;

                            // decide position
                            if (spaceBelow < 100) {
                              setTooltipPos("top"); // not enough space below → show above
                            } else {
                              setTooltipPos("bottom"); // otherwise show below
                            }

                            setActiveEmail(activeEmail === f.id ? null : f.id);
                          }}
                        >
                          <span
                            className="text-center tp-email-cell"
                            title={f.email} // desktop hover
                          >
                            {f.email?.length > 14
                              ? `${f.email.slice(0, 14)}...`
                              : f.email}
                          </span>

                          {activeEmail === f.id && window.innerWidth <= 768 && (
                            <div className={`tp-email-tooltip ${tooltipPos}`}>
                              {f.email}
                            </div>
                          )}
                        </div> */}
                        <span
                          className="text-center tp-email-cell"
                          data-tooltip-id={isLong ? "my-tooltip" : undefined}
                          data-tooltip-content={isLong ? f.email : undefined}
                        >
                          {isLong ? f.email.slice(0, 14) + "..." : f.email}
                        </span>
                        <Tooltip
                          id="my-tooltip"
                          className="tp-custom-tooltip"
                          place="top"
                          positionStrategy="fixed"
                          globalCloseEvents={{ scroll: true }}
                        />
                        <span className="text-center tp-muted">
                          {new Date(f.created_dt).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}

                {isFetchingNextPage && skeletonRows}
              </div>

              {!isLoading && feedbacks.length === 0 && (
                <EmptyState message="No feedback found" />
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>
    </section>
  );
};

export default Feedback;
