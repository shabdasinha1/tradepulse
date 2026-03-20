import React, { useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { DashboardFeedback } from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys.jsx";

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
  const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: queryKeys.feedback(LIMIT),

  queryFn: async ({ pageParam = 1 }) => {
    const res = await DashboardFeedback({
      page: pageParam,
      limit: LIMIT,
    });

    return res?.data?.data?.data || [];
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
            User Feedback <span>Intelligence</span>
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
                <span className="text-center">Company</span>
                <span className="text-center">Country</span>
                <span className="text-center">Challenge</span>
                <span className="text-center">Need</span>
                <span className="text-center">Intent</span>
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
                          <span className="tp-pill tp-pill-warning">
                            {f.challenge}
                          </span>
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-primary">
                            {f.help}
                          </span>
                        </span>

                        <span className="text-center">
                          <span className="tp-pill tp-pill-success">
                            {f.this_platform}
                          </span>
                        </span>

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
