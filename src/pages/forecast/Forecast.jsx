import { useEffect, useState } from "react";
import { DashboardForcast } from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import TPChart from "../../components/common/TPChart.jsx";
import TPMetricCard from "../../components/common/TPMetricCard.jsx";

// const signals = [
//   {
//     asset: "Gold",
//     signal: "Bullish",
//     confidence: "78%",
//     type: "success",
//   },
//   {
//     asset: "Crude Oil",
//     signal: "Neutral",
//     confidence: "52%",
//     type: "neutral",
//   },
//   {
//     asset: "EUR / USD",
//     signal: "Bullish",
//     confidence: "64%",
//     type: "success",
//   },
//   {
//     asset: "Bitcoin",
//     signal: "Bearish",
//     confidence: "81%",
//     type: "danger ",
//   },
// ];
const ForecastSkeleton = () => {
  return (
    <div className="forecast-skeleton skeleton">
      <div className="tp-grid tp-product-overview-grid">
        {[...Array(4)].map((_, i) => (
          <div className="tp-card" key={i}>
            <div className="skeleton skeleton-text" />
            <div
              className="skeleton skeleton-card-value"
              style={{ marginTop: 12 }}
            />
          </div>
        ))}
      </div>

      <div className="tp-card">
        <div className="forecast-chart-header">
          <div className="skeleton skeleton-text" style={{ width: 160 }} />
          <div className="skeleton skeleton-pill" />
        </div>

        <div className="forecast-chart" style={{ marginTop: 16 }}>
          <div className="skeleton skeleton-bar" />
        </div>
      </div>

      <div className="tp-card">
        <div className="forecast-table">
          <div className="forecast-row forecast-head">
            <span className="skeleton skeleton-text" />
            <span className="skeleton skeleton-text" />
            <span className="skeleton skeleton-text" />
          </div>

          {[...Array(4)].map((_, i) => (
            <div className="forecast-row" key={i}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-pill" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card">
        <div className="skeleton skeleton-text" />
      </div>
    </div>
  );
};

  const historicalData = [
    { month: "Jan", historical: 45, predicted: 45 },
    { month: "Feb", historical: 52, predicted: 52 },
    { month: "Mar", historical: 48, predicted: 48 },
    { month: "Apr", historical: 61, predicted: 61 },
    { month: "May", historical: 55, predicted: 58 },
    { month: "Jun", historical: 68, predicted: 74 },
    { month: "Jul", predicted: 77 },
    { month: "Aug", predicted: 80 },
    { month: "Sep", predicted: 82 },
  ];

  const confidenceData = [
    { month: "Jan", value: 95 },
    { month: "Feb", value: 94 },
    { month: "Mar", value: 92 },
    { month: "Apr", value: 90 },
    { month: "May", value: 85 },
    { month: "Jun", value: 78 },
    { month: "Jul", value: 70 },
    { month: "Aug", value: 66 },
    { month: "Sep", value: 62 },
  ];


const Forecast = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [forecastData, setforecastData] = useState({
    signals: [],
    trendProjection: [],
    asset: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await DashboardForcast();

        if (res?.success === true || res?.data?.status === 200) {
          setforecastData({
            signals: res.data.data.summary,
            trendProjection: res.data.data.trendProjection,
            asset: res.data.data.assets,
          });
        }
      } catch (err) {
        setError(GetApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log("Forecast Data : ", forecastData);

  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack">
        {/* ===============================
              PAGE HEADER
          =============================== */}
        <header>
          <h1 className="tp-section-title">
            Market <span>Forecast</span>
          </h1>
          <p className="tp-section-sub">
            Predictive signals and trend confidence indicators
          </p>
        </header>

        {/* ================= METRICS ROW ================= */}
        <div className="tp-metrics-row">

          <TPMetricCard
            title="Price Movement Prediction"
            value="+8.5%"
            unit="next 3 months"
            footerLabel="Upward trend expected"
            trend={8.5}
            trendDirection="up"
          />

          <TPMetricCard
            title="Demand Direction Signal"
            value="Strong"
            unit="growth signal"
            footerLabel="Confidence: 78%"
            trendDirection="up"
          />

          <TPMetricCard
            title="Shipping Cost Forecast"
            value="$2,380"
            unit="predicted average"
            footerLabel="Slight decline expected"
            trend={3.2}
            trendDirection="down"
          />

          <TPMetricCard
            title="Currency Volatility Alert"
            value="Medium"
            unit="risk level"
            footerLabel="Monitor closely"
            trendDirection="neutral"
          />

        </div>

        {/* ================= CHARTS ROW ================= */}
        <div className="tp-grid tp-grid-2">

          <TPChart
            title="Price Prediction - Historical vs Forecast"
            type="line"
            data={historicalData}
            series={[
              { key: "historical", label: "Historical" },
              { key: "predicted", label: "Predicted", dashed: true }
            ]}
          />

          <TPChart
            title="AI Confidence Score by Month"
            type="bar"
            data={confidenceData}
            series={[
              { key: "value", label: "Confidence" }
            ]}
          />

        </div>
        {/* ===============================
              KPI CARDS
              =============================== */}

        {isLoading ? (
          <ForecastSkeleton />
        ) : (
          <>
            <div className="tp-grid tp-grid-2 tp-product-overview-grid">
              <div className="tp-card">
                <p className="tp-muted">Bullish Signals</p>
                <h3 className="tp-text-up">{forecastData?.signals?.bullish}</h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Bearish Signals</p>
                <h3 className="tp-text-down">
                  {forecastData?.signals?.bearish}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Neutral Assets</p>
                <h3 className="tp-overview-text">
                  {forecastData?.signals?.neutral}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Prediction Accuracy</p>
                <h3 className="tp-overview-text">
                  {forecastData?.signals?.predictionAccuracy}
                </h3>
              </div>
            </div>

            {/* ===============================
              FORECAST CHART PLACEHOLDER
          =============================== */}
            <div className="tp-card">
              <div className="forecast-chart-header">
                <h3>Trend Projection</h3>
                <button className="tp-btn-outline">Last 7 Days</button>
              </div>

              <div className="forecast-chart">
                <div
                  className="forecast-bar"
                  style={{ width: `${forecastData?.trendProjection}%` }}
                />
              </div>

              <p className="tp-muted forecast-note">
                Visual representation of projected market momentum
              </p>
            </div>

            {/* ===============================
              SIGNAL LIST
          =============================== */}
            <div className="tp-card">
              <div className="forecast-table">
                <div className="forecast-row forecast-head">
                  <span>Asset</span>
                  <span className="text-center">Signal</span>
                  <span className="text-center">Confidence</span>
                </div>
                {forecastData?.asset?.map((item, index) => (
                  <div className="forecast-row" key={index}>
                    <span>{item.assetName?.split(",")[0]}</span>

                    <span className="text-center">
                      <span
                        className={`tp-pill ${
                          item.signal === "Bullish"
                            ? "tp-pill-success"
                            : item.signal === "Bearish"
                              ? "tp-pill-warning"
                              : "tp-pill-primary"
                        }`}
                      >
                        {item.signal}
                      </span>
                    </span>

                    <span className="text-center">
                      {item.confidence}
                      {"%"}
                    </span>
                  </div>
                ))}
                {/* {signals.map((item, index) => (
              <div className="forecast-row" key={index}>
                <span>{item.asset}</span>

                <span
                  className={`tp-pill ${
                    item.type === "success"
                      ? "tp-pill-success"
                      : item.type === "danger"
                        ? "tp-pill-warning"
                        : "tp-pill-primary"
                  }`}
                >
                  {item.signal}
                </span>

                <span>{item.confidence}</span>
              </div>
            ))} */}
              </div>
            </div>

            {/* ===============================
              DISCLAIMER
          =============================== */}
            <div className="tp-card">
              <p className="tp-muted">
                Forecasts are algorithmic estimates based on historical patterns
                and should not be considered financial advice.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Forecast;
