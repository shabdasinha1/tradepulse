import { FiGlobe } from "react-icons/fi";
import { useRef, useEffect } from "react";
import TradePulseCard from "../common/TradePulseCard.jsx";

const news = [
  {
    title: "Nigeria reduces import tariff on agricultural machinery",
    time: "1 hour ago",
    tag: "Trade Policy",
  },
  {
    title: "Cocoa exports face delays due to warehouse shortages",
    time: "3 hours ago",
    tag: "Supply Chain",
  },
  {
    title: "Naira volatility increases cost of electronics imports",
    time: "4 hours ago",
    tag: "Currency",
  },
  {
    title: "Severe congestion reported at Apapa Port terminals",
    time: "6 hours ago",
    tag: "Logistics",
  },
  {
    title: "New export documentation requirements introduced by Customs",
    time: "8 hours ago",
    tag: "Regulation",
  },
  {
    title: "Rice demand rises 18% across West African markets",
    time: "12 hours ago",
    tag: "Market Shift",
  },
  {
    title: "ECOWAS opens new cross-border trade corridor initiative",
    time: "1 day ago",
    tag: "Opportunity",
  },
];

const LatestTradeNews = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame;
    let position = 0;
    let isPaused = false;
    const speed = 0.6; // adjust 0.4 – 1 for speed

    const contentHeight = el.scrollHeight / 2;

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
  }, []);

  return (
    <section className="tp-section">
      <div className="tp-container">
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
              {[...news, ...news].map((item, i) => (
                <div key={i} className="tp-news-item">
                  <div className="tp-news-content">
                    <p className="tp-news-title">{item.title}</p>
                    <span className="tp-news-time">{item.time}</span>
                  </div>

                  <span className="tp-badge tp-badge-primary">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TradePulseCard>
      </div>
    </section>
  );
};

export default LatestTradeNews;
