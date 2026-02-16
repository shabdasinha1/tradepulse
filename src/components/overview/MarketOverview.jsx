import { FiDollarSign, FiTruck } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useEffect, useState } from "react";
import {
  DashboardOverviewExchange,
  DashboardOverviewShipping,
} from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import VerticalScroll from "../common/VerticalScroll.jsx";

const MarketOverview = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [OverviewData, setOverviewData] = useState({
    shippingData: [],
    exchangeRates: [],
  });

  // COUNTRY CODE FOR API CALLING
  const [base, setBase] = useState("EUR");

  // const [shippingData, setShippingData] = useState([]);

  // const rates = [
  //   {
  //     symbol: "$",
  //     pair: "USD/NGN",
  //     value: "₦1,547.23",
  //     change: "+0.12%",
  //     type: "up",
  //   },
  //   {
  //     symbol: "£",
  //     pair: "GBP/NGN",
  //     value: "₦1,956.45",
  //     change: "+0.25%",
  //     type: "up",
  //   },
  //   {
  //     symbol: "€",
  //     pair: "EUR/NGN",
  //     value: "₦1,678.90",
  //     change: "-0.08%",
  //     type: "down",
  //   },
  //   {
  //     symbol: "¥",
  //     pair: "CNY/NGN",
  //     value: "₦214.56",
  //     change: "+0.15%",
  //     type: "up",
  //   },
  //   {
  //     symbol: "CFA",
  //     pair: "XOF/NGN",
  //     value: "₦2.48",
  //     change: "0.00%",
  //     type: "neutral",
  //   },
  // ];

  // const shipping = [
  //   {
  //     route: "London → Lagos",
  //     port: "Apapa Port",
  //     price: "£2,450",
  //     days: "28 days",
  //     change: "+3%",
  //     type: "up",
  //   },
  //   {
  //     route: "London → Port Harcourt",
  //     port: "Onne Port",
  //     price: "£2,680",
  //     days: "32 days",
  //     change: "+5%",
  //     type: "up",
  //   },
  //   {
  //     route: "Shanghai → Lagos",
  //     port: "Tin Can Port",
  //     price: "£1,890",
  //     days: "35 days",
  //     change: "-2%",
  //     type: "down",
  //   },
  //   {
  //     route: "Hamburg → Lagos",
  //     port: "Apapa Port",
  //     price: "£2,120",
  //     days: "26 days",
  //     change: "+1%",
  //     type: "up",
  //   },
  // ];

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          DashboardOverviewShipping(),
          DashboardOverviewExchange(base),
        ]);
        const [shippingRes, exchangeRes] = results;
        setOverviewData({
          shippingData:
            shippingRes.status === "fulfilled" ? shippingRes.value.data : [],
          exchangeRates:
            exchangeRes.status === "fulfilled"
              ? exchangeRes.value.data.data.rates
              : [],
        });
      } catch (err) {
        setError(GetApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [base]);
console.log(OverviewData)

  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack">
        {/* ================= EXCHANGE RATES ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiDollarSign />
              <h3 className="tp-card-title">Exchange Rates vs NGN</h3>
            </div>
          }
        >
          <div className="tp-grid tp-rates-grid">
            {/* {rates.map((r, i) => (
              <div key={i} className="tp-rate-card">
                <div className="tp-rate-header">
                  <span className="tp-rate-symbol">{r.symbol}</span>
                  <span
                    className={`tp-rate-change ${
                      r.type === "up"
                        ? "tp-text-up"
                        : r.type === "down"
                          ? "tp-text-down"
                          : "tp-text-neutral"
                    }`}
                  >
                    {r.change}
                  </span>
                </div>

                <span className="tp-rate-pair">{r.pair}</span>
                <strong className="tp-rate-value">{r.value}</strong>
              </div>
            ))} */}
            {/* {OverviewData?.exchangeRates?.slice(0, 5)?.map((r, i) => (
              <div key={i} className="tp-rate-card">
                <div className="tp-rate-header">
                  <span className="tp-rate-symbol">{r.baseCurrency}</span>
                  <span
                    className={`tp-rate-change ${
                      r.trend === "UP"
                        ? "tp-text-up"
                        : r.trend === "DOWN"
                          ? "tp-text-down"
                          : "tp-text-neutral"
                    }`}
                  >
                    {r.changePercent}
                    {"%"}
                  </span>
                </div>

                <span className="tp-rate-pair">{r.pair}</span>
                <strong className="tp-rate-value">{r.currentRate}</strong>
              </div>
            ))} */}
            <VerticalScroll className="rtx-vertical-scroll">
              <div className="rtx-tp-rate-card-container">
                {OverviewData?.exchangeRates?.map((r, index) => (
                  <div key={index} className="tp-rate-card">
                    <div className="tp-rate-header">
                      <span className="tp-rate-symbol">{r.currency}</span>
                      <span
                        className={`tp-rate-change ${
                          r.trend === "UP"
                            ? "tp-text-up"
                            : r.trend === "DOWN"
                              ? "tp-text-down"
                              : "tp-text-neutral"
                        }`}
                      >
                        {r.changePercent}%
                      </span>
                    </div>

                    <span className="tp-rate-pair">{r.pair}</span>
                    <strong className="tp-rate-value">{r.rate}</strong>
                  </div>
                ))}
              </div>
            </VerticalScroll>
          </div>
        </TradePulseCard>

        {/* ================= SHIPPING COSTS ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiTruck />
              <h3 className="tp-card-title">Latest Shipping Costs</h3>
            </div>
          }
        >
          <div className="tp-grid tp-ship-grid">
            {/* {shipping.map((s, i) => (
              <div key={i} className="tp-ship-card">
                <div className="tp-ship-header">
                  <div>
                    <h4 className="tp-ship-route">{s.route}</h4>
                    <span className="tp-ship-port">{s.port}</span>
                  </div>

                  <span className="tp-ship-days">{s.days}</span>
                </div>

                <div className="tp-ship-footer">
                  <strong className="tp-ship-price">{s.price}</strong>
                  <span
                    className={`tp-ship-change ${
                      s.type === "up" ? "tp-text-up" : "tp-text-down"
                    }`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>
            ))} */}
            {OverviewData?.shippingData?.data?.map((s, i) => (
              <div key={i} className="tp-ship-card">
                <div className="tp-ship-header">
                  <div>
                    <h4 className="tp-ship-route">{s.route}</h4>
                    {/* <span className="tp-ship-port">{s.port_name ? s.port_name : "Apapa Port"}</span> */}
                    <span className="tp-ship-port">
                      {s.portName ? s.portName : "0 Apapa Port"}
                    </span>
                  </div>

                  <span className="tp-ship-days">
                    {s.transitDays ? `${s.transitDays} Days` : "0 Days"}
                  </span>
                </div>

                <div className="tp-ship-footer">
                  <strong className="tp-ship-price">
                    
                    {s.price}
                  </strong>
                  <span
                    className={`tp-ship-change text-pill-primary ${
                      s.change != 0
                        ? s.change > 0
                          ? "tp-text-up"
                          : "tp-text-down"
                        : "tp-muted"
                    }`}
                  >
                    {s.changePercent}
                    {"%"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TradePulseCard>
      </div>
    </section>
  );
};

export default MarketOverview;
