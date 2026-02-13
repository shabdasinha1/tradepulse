import { FiGlobe } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";

const news = [
  {
    title: "Nigeria customs duty reduced by 2% on agricultural imports",
    time: "2 hours ago",
    tag: "Customs",
  },
  {
    title: "GBP strengthens against Naira amid trade talks",
    time: "5 hours ago",
    tag: "Currency",
  },
  {
    title: "Shipping delays expected at Apapa Port due to congestion",
    time: "1 day ago",
    tag: "Logistics",
  },
  {
    title: "Electronics demand surges 23% in West Africa",
    time: "1 day ago",
    tag: "Market",
  },
];

const LatestTradeNews = () => {
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
          <div className="tp-news-list">
            {news.map((item, i) => (
              <div key={i} className="tp-news-item">

                <div className="tp-news-content">
                  <p className="tp-news-title">
                    {item.title}
                  </p>
                  <span className="tp-news-time">
                    {item.time}
                  </span>
                </div>

                <span className="tp-badge tp-badge-primary">
                  {item.tag}
                </span>

              </div>
            ))}
          </div>
        </TradePulseCard>

      </div>
    </section>
  );
};

export default LatestTradeNews;
