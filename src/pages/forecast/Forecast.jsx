import { useEffect, useState } from "react";
import { DashboardForcast } from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";

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
      <div className="tp-grid tp-grid-2">
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
        {/* ===============================
              KPI CARDS
              =============================== */}

        {isLoading ? (
          <ForecastSkeleton />
        ) : (
          <>
            <div className="tp-grid tp-grid-2">
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
