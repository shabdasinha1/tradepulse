import React, { useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardTradeNewsExternal } from "../../services/DashboardService.jsx";
import { FiGlobe } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useSelector } from "react-redux";
import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../common/EmptyState.jsx";

const LatestTradeNews = React.memo(() => {
  const {
    reporterCode,
    partnerCode,
    startDate,
    endDate,
    countryCode,
    partnerCountryCode,
  } = useSelector((state) => state.corridor);
  const scrollRef = useRef(null);

  /* ===============================
     FETCH DATA (React Query)
  ============================== */
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.corridorNews(countryCode, partnerCountryCode),
    queryFn: async () => {
      const [countryRes, partnerRes] = await Promise.all([
        DashboardTradeNewsExternal({
          countryCode,
        }),
        DashboardTradeNewsExternal({
          countryCode: partnerCountryCode,
        }),
      ]);

      return {
        data: {
          content: [
            ...(countryRes?.content || []),
            ...(partnerRes?.content || []),
          ],
        },
      };
    },
    enabled: !!countryCode || !!partnerCountryCode,
  });
  /* ===============================
     FORMAT DATA
  ============================== */
  const news = useMemo(() => {
    return (
      data?.data?.content?.map((item) => ({
        title: item.title,
        summary: item.summary,
        source: item.source,
        url: item.url,
        date: item.publishedAt,
        tag: item.sector,
        severity: item.alertType?.toLowerCase(),
      })) || []
    );
  }, [data]);
  /* ===============================
     AUTO SCROLL LOGIC (UNCHANGED)
  ============================== */
  useEffect(() => {
    const el = scrollRef.current;

    if (!el || news.length <= 3) {
      if (el) el.style.transform = "translateY(0px)";
      return;
    }

    let animationFrame;
    let position = 0;
    let isPaused = false;
    const speed = 0.6;
    const contentHeight = el.scrollHeight / 2 || 0;

    const animate = () => {
      if (!isPaused) {
        position += speed;
        if (position >= contentHeight) position = 0;
        el.style.transform = `translateY(-${position}px)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    const pause = () => (isPaused = true);
    const resume = () => (isPaused = false);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationFrame);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [news]);

  // console.log(news)
  /* ===============================
     RENDER
  ============================== */
  return (
    <TradePulseCard
      header={
        <div className="tp-card-header tp-news-header">
          <div className="tp-news-title-wrap">
            <FiGlobe />
            <h3 className="tp-card-title">Corridor Alerts</h3>
          </div>
        </div>
      }
    >
      <div className="tp-news-viewport">
        {/* <div ref={scrollRef} className="tp-news-scroll"> */}
        <div className="tp-news-scroll">
          {/* 🔄 Loading */}
          {isLoading && (
            <div className="tp-news-item">
              <p className="tp-news-title">Loading...</p>
            </div>
          )}

          {/* ❌ Error */}
          {error && (
            <div className="tp-news-item">
              {/* <p className="tp-news-title">Failed to load updates</p> */}
              <EmptyState message="Failed to load updates" />
            </div>
          )}

          {/* ✅ Data */}
          {!isLoading &&
            !error &&
            (news.length > 3 ? [...news, ...news] : news).map((item, i) => (
              <div key={i} className="tp-news-item">
                {/* <div className="tp-news-content">
                  <p className="tp-news-title">{item.title}</p>
                  <span className="tp-news-time">{item.time}</span>
                </div> */}
                <div className="tp-news-content">
                  {/* Title (clickable) */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tp-news-title tp-news-link"
                  >
                    {item.title}
                  </a>

                  {/* Summary */}
                  <p className="tp-news-summary">{item.summary}</p>

                  {/* Meta row (source + date) */}
                  <div className="tp-news-meta">
                    <span className="tp-news-source">{item.source}</span>
                    <span className="tp-news-date">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`tp-badge tp-badge-${item.severity || "primary"}`}
                >
                  {item.tag}
                </span>
              </div>
            ))}

          {/* 💤 Empty */}
          {!isLoading && !error && news.length === 0 && (
            <EmptyState message="No corridor alerts available" />
          )}
        </div>
      </div>
    </TradePulseCard>
  );
});

export default LatestTradeNews;
