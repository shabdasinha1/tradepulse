import { FiGlobe } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
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
  const viewportRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

 useEffect(() => {
  const el = viewportRef.current;
  if (!el) return;

  let animationFrame;
  let isPaused = false;
  let manualTimeout;

  const speed = 0.5; // try 0.4–0.7

  const autoScroll = () => {
    if (!isPaused) {
      el.scrollTop += speed;

      // Seamless reset
      if (el.scrollTop >= el.scrollHeight / 2) {
        el.scrollTop = 0;
      }
    }

    animationFrame = requestAnimationFrame(autoScroll);
  };

  animationFrame = requestAnimationFrame(autoScroll);

  /* -------- Pause on Hover -------- */
  const handleMouseEnter = () => {
    isPaused = true;
  };

  const handleMouseLeave = () => {
    isPaused = false;
  };

  /* -------- Pause on Manual Scroll -------- */
  const handleScroll = () => {
    isPaused = true;

    clearTimeout(manualTimeout);
    manualTimeout = setTimeout(() => {
      isPaused = false;
    }, 1200); // resume after idle
  };

  el.addEventListener("mouseenter", handleMouseEnter);
  el.addEventListener("mouseleave", handleMouseLeave);
  el.addEventListener("scroll", handleScroll);

  return () => {
    cancelAnimationFrame(animationFrame);
    el.removeEventListener("mouseenter", handleMouseEnter);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el.removeEventListener("scroll", handleScroll);
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
          <div
            ref={viewportRef}
            className={`tp-news-viewport ${
              isInteracting ? "tp-news-manual" : ""
            }`}
          >
            <div className="tp-news-scroll">
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
