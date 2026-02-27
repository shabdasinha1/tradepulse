import { useState, useRef, useEffect } from "react";
import { DashboardTradeNews } from "../../services/DashboardService.jsx";
import { FiGlobe } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";

const LatestTradeNews = () => {
  const [news, setNews] = useState([]);
  const scrollRef = useRef(null);

  /* ===============================
     FETCH TRADE NEWS
  ============================== */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await DashboardTradeNews();

        if (res?.success) {
          const formatted = res.data.map((item) => ({
            title: item.title,
            time: formatTimeAgo(item.published_at),
            tag: item.category,
          }));

          setNews(formatted);
        }
      } catch (err) {
        console.error("Trade News Error:", err);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  /* ===============================
     AUTO SCROLL (Only if > 3 news)
  ============================== */
  useEffect(() => {
    const el = scrollRef.current;

    // Stop scroll if:
    // - No element
    // - No news
    // - News <= 3
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

        if (position >= contentHeight) {
          position = 0;
        }

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
     TIME FORMATTER
  ============================== */
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">
        <TradePulseCard
          header={
            <div className="tp-card-header tp-news-header">
              <div className="tp-news-title-wrap">
                <FiGlobe />
                <h3 className="tp-card-title">Latest Trade News</h3>
              </div>
            </div>
          }
        >
          <div className="tp-news-viewport">
            <div ref={scrollRef} className="tp-news-scroll">
              {(news.length > 3 ? [...news, ...news] : news).map(
                (item, i) => (
                  <div key={i} className="tp-news-item">
                    <div className="tp-news-content">
                      <p className="tp-news-title">{item.title}</p>
                      <span className="tp-news-time">{item.time}</span>
                    </div>

                    <span className="tp-badge tp-badge-primary">
                      {item.tag}
                    </span>
                  </div>
                )
              )}

              {/* Optional empty state */}
              {news.length === 0 && (
                <div className="tp-news-item">
                  <p className="tp-news-title">
                    No trade updates available
                  </p>
                </div>
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>
    </section>
  );
};

export default LatestTradeNews;