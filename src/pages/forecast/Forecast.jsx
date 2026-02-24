import { useEffect, useState } from "react";
import {
  DashboardForcast,
  DemandGrowthForecast,
  ForcastAssets,
  ForcastConfidenceChart,
  ForcastPriceChart,
} from "../../services/DashboardService";
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
const transformConfidenceChart = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => ({
    month: String(item.label),
    value: item.confidence,
  }));
};

const Forecast = () => {
  const [error, setError] = useState("");
 const [metricLoading, setMetricLoading] = useState(false);
const [priceChartLoading, setPriceChartLoading] = useState(false);
const [confidenceLoading, setConfidenceLoading] = useState(false);
const [assetsLoading, setAssetsLoading] = useState(false);
const [metricProductCode, setMetricProductCode] = useState("27");
const [priceChartProductCode, setPriceChartProductCode] = useState("27");
const [confidenceProductCode, setConfidenceProductCode] = useState("27");
  const [forecastData, setForecastData] = useState({
    predictiveSignals: null,
    priceChart: [],
    signals: null,
    confidenceChart: [],
    trendProjection: null,
    assets: [],
  });
useEffect(() => {
  let isMounted = true;

  const fetchMetricCards = async () => {
    try {
      const [forecastRes] = await Promise(
        DashboardForcast(metricProductCode)
      
      );

      if (!isMounted) return;

      setForecastData((prev) => ({
        ...prev,
        signals:
          forecastRes.status === "fulfilled"
            ? forecastRes.value?.data ?? null
            : null,

        trendProjection:
          forecastRes.status === "fulfilled"
            ? forecastRes.value?.data?.trendProjection ?? null
            : null,

        
      }));
    } catch (err) {
      console.error("Metric Fetch Error:", err);
    }
  };

  fetchMetricCards();

  return () => {
    isMounted = false;
  };
}, [metricProductCode]);

useEffect(() => {
  let isMounted = true;

  const fetchPriceChart = async () => {
    try {
      const res = await ForcastPriceChart(priceChartProductCode);

      if (!isMounted) return;

      const apiData = res?.data ?? {};
      const historical = apiData?.historical ?? [];
      const predicted = apiData?.predicted ?? [];

      const allMonths = new Set([
        ...historical.map((h) => h.label),
        ...predicted.map((p) => p.label),
      ]);

      const merged = Array.from(allMonths).map((month) => {
        const h = historical.find((i) => i.label === month);
        const p = predicted.find((i) => i.label === month);

        return {
          month: String(month),
          historical: h?.value ?? null,
          predicted: p?.value ?? null,
        };
      });

      setForecastData((prev) => ({
        ...prev,
        priceChart: merged,
      }));
    } catch (err) {
      console.error("Price Chart Error:", err);
      setForecastData((prev) => ({
        ...prev,
        priceChart: [],
      }));
    }
  };

  fetchPriceChart();

  return () => {
    isMounted = false;
  };
}, [priceChartProductCode]);

useEffect(() => {
  let isMounted = true;

  const fetchConfidenceChart = async () => {
    try {
      const res = await ForcastConfidenceChart(confidenceProductCode);

      if (!isMounted) return;

      const transformed = transformConfidenceChart(res?.data ?? []);

      setForecastData((prev) => ({
        ...prev,
        confidenceChart: transformed,
      }));
    } catch (err) {
      console.error("Confidence Chart Error:", err);
      setForecastData((prev) => ({
        ...prev,
        confidenceChart: [],
      }));
    }
  };

  fetchConfidenceChart();

  return () => {
    isMounted = false;
  };
}, [confidenceProductCode]);

useEffect(() => {
  let isMounted = true;

  const fetchAssets = async () => {
    try {
      const res = await ForcastAssets({ limit: 10, page: 1 });

      if (!isMounted) return;

      setForecastData((prev) => ({
        ...prev,
        assets: res?.data?.assets ?? [],
        predictiveSignals: res?.data?.summary ?? null,
      }));
    } catch (err) {
      console.error("Assets Fetch Error:", err);
      setForecastData((prev) => ({
        ...prev,
        assets: [],
        predictiveSignals: null,
      }));
    }
  };

  fetchAssets();

  return () => {
    isMounted = false;
  };
}, []);
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
          {/* ================= Price Movement ================= */}
          <TPMetricCard
            title="Price Movement Prediction"
            // value="+8.5%"
           value={
  forecastData?.signals?.pricePrediction?.percent != null
    ? `${forecastData.signals.pricePrediction.percent}%`
    : ""
}
            // unit="next 3 months"
            footerLabel="Upward trend expected"
            trend={8.5}
            trendDirection={forecastData.signals?.pricePrediction?.direction}
             showMetricProductDropdown={true}
  metricSelectedProduct={metricProductCode}
  onMetricProductSelect={setMetricProductCode}
          />

          {/* ================= Demand Signal ================= */}
          <TPMetricCard
            title="Demand Direction Signal"
            value={forecastData?.signals?.demandPrediction?.signal ?? ""}
            unit="growth signal"
            footerLabel={
              forecastData?.signals?.demandPrediction?.confidence != null
                ? `Confidence: ${forecastData.signals.demandPrediction.confidence}%`
                : "Confidence: "
            }
            trendDirection="neutral"
          />

          {/* ================= Shipping Cost ================= */}
          <TPMetricCard
            title="Shipping Cost Forecast"
            value={forecastData?.signals?.shippingForecast?.average ?? ""}
            unit="predicted average"
            footerLabel="Slight decline expected"
            trend={forecastData?.signals?.shippingForecast?.changePercent ?? 0}
            trendDirection={
              forecastData?.signals?.shippingForecast?.changePercent > 0
                ? "up"
                : forecastData?.signals?.shippingForecast?.changePercent < 0
                  ? "Downward"
                  : "neutral"
            }
          />

          {/* ================= Currency Risk ================= */}
          <TPMetricCard
            title="Currency Volatility Alert"
            value={forecastData?.signals?.currencyForecast?.risk ?? ""}
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
            // data={historicalData}
            data={forecastData.priceChart}
            series={[
              { key: "historical", label: "Historical" },
              { key: "predicted", label: "Predicted", dashed: true },
            ]}
              selectedProduct={priceChartProductCode}
  onSelectProduct={setPriceChartProductCode}
          />

          <TPChart
            title="AI Confidence Score by Month"
            type="bar"
            // data={confidenceData}
            data={forecastData.confidenceChart}
            series={[{ key: "value", label: "Confidence" }]}
             selectedProduct={confidenceProductCode}
  onSelectProduct={setConfidenceProductCode}
          />
        </div>
        {/* ===============================
              KPI CARDS
              =============================== */}

       
          <>
            <div className="tp-grid tp-grid-2 tp-product-overview-grid">
              <div className="tp-card">
                <p className="tp-muted">Bullish Signals</p>
                <h3 className="tp-text-up">
                  {forecastData?.predictiveSignals?.bullish}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Bearish Signals</p>
                <h3 className="tp-text-down">
                  {forecastData?.predictiveSignals?.bearish}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Neutral Assets</p>
                <h3 className="tp-overview-text">
                  {forecastData?.predictiveSignals?.neutral}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Prediction Accuracy</p>
                <h3 className="tp-overview-text">
                  {forecastData?.predictiveSignals?.predictionAccuracy}
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
                  style={{
                    width: `${forecastData?.predictiveSignals?.predictionAccuracy}%`,
                  }}
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
                {forecastData?.assets?.map((item, index) => (
                  <div className="forecast-row" key={index}>
                    <span>{item?.assetName?.split(",")[0]}</span>

                    <span className="text-center">
                      <span
                        className={`tp-pill ${item.signal === "Bullish"
                            ? "tp-pill-success"
                            : item?.signal === "Bearish"
                              ? "tp-pill-warning"
                              : "tp-pill-primary"
                          }`}
                      >
                        {item?.signal}
                      </span>
                    </span>

                    <span className="text-center">
                      {Number(item?.confidence).toFixed(2)}
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
    
      </div>
    </section>
  );
};

export default Forecast;
