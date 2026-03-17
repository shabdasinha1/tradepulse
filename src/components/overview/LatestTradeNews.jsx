import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardTradeNews } from "../../services/DashboardService.jsx";
import { FiGlobe } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useSelector } from "react-redux";
import { queryKeys } from "../../utils/queryKeys";

const LatestTradeNews = () => {
  const {
  reporterCode,
  partnerCode,
  startDate,
  endDate,
} = useSelector((state) => state.corridor);
  const scrollRef = useRef(null);


  const params = {
  startDate,
  endDate,
  reporter: reporterCode,
  partner: partnerCode,
};

  /* ===============================
     FETCH DATA (React Query)
  ============================== */
  const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.corridorNews(
    reporterCode,
    partnerCode,
    startDate,
    endDate
  ),
  queryFn: () => DashboardTradeNews(params),
  enabled: !!reporterCode && !!partnerCode,
});

  /* ===============================
     FORMAT DATA
  ============================== */
  const news =
    data?.data?.map((item) => ({
      title: item.title,
      time: item.description,
      tag: item.type,
      severity: item.severity,
    })) || [];

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
        <div ref={scrollRef} className="tp-news-scroll">
          {/* 🔄 Loading */}
          {isLoading && (
            <div className="tp-news-item">
              <p className="tp-news-title">Loading...</p>
            </div>
          )}

          {/* ❌ Error */}
          {error && (
            <div className="tp-news-item">
              <p className="tp-news-title">Failed to load updates</p>
            </div>
          )}

          {/* ✅ Data */}
          {!isLoading &&
            !error &&
            (news.length > 3 ? [...news, ...news] : news).map((item, i) => (
              <div key={i} className="tp-news-item">
                <div className="tp-news-content">
                  <p className="tp-news-title">{item.title}</p>
                  <span className="tp-news-time">{item.time}</span>
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
            <div className="tp-news-item">
              <p className="tp-news-title">No trade updates available</p>
            </div>
          )}
        </div>
      </div>
    </TradePulseCard>
  );
};

export default LatestTradeNews;
