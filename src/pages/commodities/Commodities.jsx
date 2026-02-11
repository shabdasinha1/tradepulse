import { useState } from "react";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiFilter, FiStar } from "react-icons/fi";

const commodities = [
  {
    rank: "#1",
    name: "Palm Oil",
    price: "£1,245/ton",
    change: "+5.2%",
    demand: 92,
    trend: "up",
  },
  {
    rank: "#2",
    name: "Copper Wire",
    price: "£8,450/ton",
    change: "-2.1%",
    demand: 78,
    trend: "down",
  },
  {
    rank: "#3",
    name: "Cotton Fabric",
    price: "£4.50/yard",
    change: "+8.3%",
    demand: 85,
    trend: "up",
  },
  {
    rank: "#4",
    name: "Rice",
    price: "£520/bag",
    change: "+1.5%",
    demand: 88,
    trend: "up",
  },
  {
    rank: "#5",
    name: "LED Components",
    price: "£12.30/unit",
    change: "+12.4%",
    demand: 95,
    trend: "up",
  },
];


const TABS = ["All", "Agriculture", "Electronics", "Textiles"];

const DATA = [
  {
    name: "Palm Oil",
    category: "Agriculture",
    market: "Lagos",
    price: "£1,245/ton",
    change: "+5.2%",
    trend: "up",
    demand: 92,
    favorite: true,
  },
  {
    name: "Copper Wire",
    category: "Electronics",
    market: "Global",
    price: "£8,450/ton",
    change: "-2.1%",
    trend: "down",
    demand: 78,
  },
  {
    name: "Cotton Fabric",
    category: "Textiles",
    market: "Kano",
    price: "£4.50/yard",
    change: "+8.3%",
    trend: "up",
    demand: 85,
  },
  {
    name: "Rice",
    category: "Agriculture",
    market: "Abuja",
    price: "£520/bag",
    change: "+1.5%",
    trend: "up",
    demand: 88,
  },
  {
    name: "LED Components",
    category: "Electronics",
    market: "Lagos",
    price: "£12.30/unit",
    change: "+12.4%",
    trend: "up",
    demand: 95,
  },
  {
    name: "Wheat Flour",
    category: "Agriculture",
    market: "Port Harcourt",
    price: "£380/bag",
    change: "-0.8%",
    trend: "down",
    demand: 72,
  },
  {
    name: "Denim",
    category: "Textiles",
    market: "Lagos",
    price: "£6.20/yard",
    change: "+3.7%",
    trend: "up",
    demand: 81,
  },
  {
    name: "Smartphones",
    category: "Electronics",
    market: "Nationwide",
    price: "£245/unit",
    change: "+6.5%",
    trend: "up",
    demand: 89,
  },
];



const Commodities = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? DATA
      : DATA.filter((i) => i.category === active);

  return (
    <>
      {/* ================= TOP COMMODITIES ================= */}
      <section className="tp-section">
        <div className="tp-container">
          <TradePulseCard header={<h3 className="tp-card-title">Top 5 Commodities</h3>}>
            <div className="tp-grid tp-grid-5">
              {commodities.map((item, i) => (
                <div key={i} className="tp-commodity-card">

                  <span className="tp-muted">{item.rank}</span>
                  <h4 className="tp-commodity-name">{item.name}</h4>

                  <div className="tp-commodity-price">
                    <span>{item.price}</span>
                    <span className={item.trend === "up" ? "tp-text-up" : "tp-text-down"}>
                      {item.trend === "up" ? "↗" : "↘"} {item.change}
                    </span>
                  </div>

                  <div className="tp-demand">
                    <div
                      className="tp-demand-bar"
                      style={{ width: `${item.demand}%` }}
                    />
                  </div>

                  <span className="tp-muted">Demand: {item.demand}%</span>
                </div>
              ))}
            </div>
          </TradePulseCard>
        </div>
      </section>

      {/* ================= ALL COMMODITIES ================= */}
      <section className="tp-section">
        <div className="tp-container">
          <TradePulseCard
            header={
              <div className="tp-commodities-header">
                <h3 className="tp-card-title">All Commodities</h3>

                <div className="tp-tabs">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      className={`tp-tab ${active === tab ? "active" : ""}`}
                      onClick={() => setActive(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <div className="tp-table-head">
              <span>Commodity</span>
              <span>Market</span>
              <span>Price</span>
              <span>Change</span>
              <span>Demand</span>
              <span />
            </div>

            <div className="tp-table">
              {filtered.map((item, i) => (
                <div key={i} className="tp-table-row">

                  <div>
                    <strong>{item.name}</strong>
                    <div className="tp-muted">{item.category}</div>
                  </div>

                  <span className="tp-muted">{item.market}</span>
                  <strong>{item.price}</strong>

                  <span className={item.trend === "up" ? "tp-text-up" : "tp-text-down"}>
                    {item.trend === "up" ? "↗" : "↘"} {item.change}
                  </span>

                  <div className="tp-demand-cell">
                    <strong>{item.demand}%</strong>
                    <div className="tp-demand">
                      <div
                        className="tp-demand-bar"
                        style={{ width: `${item.demand}%` }}
                      />
                    </div>
                  </div>

                  <button className="tp-star-btn">
                    <FiStar className={item.favorite ? "active" : ""} />
                  </button>

                </div>
              ))}
            </div>
          </TradePulseCard>
        </div>
      </section>
    </>
  );
};

export default Commodities;

