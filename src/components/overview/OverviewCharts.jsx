import React, { useEffect, useState } from "react";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";
import { DashboardPriceTrend, DemandGrowthForecast, ForecastOverview } from "../../services/DashboardService.jsx";

const OverviewCharts = () => {
  const [priceHsCode, setPriceHsCode] = useState("27");
  const [demandHsCode, setDemandHsCode] = useState("27");
  const [priceData, setPriceData] = useState([]);
  const [demandData, setDemandData] = useState([]);
  const [metrics, setMetrics] = useState({
    currency: null,
    shipping: null,
    demand: null,
    supplier: null,
  });






  useEffect(() => {
    if (!priceHsCode) return;

    const fetchPriceTrend = async () => {
      try {
        const res = await DashboardPriceTrend(priceHsCode);

        const history = res?.data?.history || [];

        let formatted = [];

        if (history.length === 0) {
          // 🔥 Default fallback years
          const defaultYears = ["2019", "2020", "2021", "2022", "2023"];

          formatted = defaultYears.map((year) => ({
            month: year,
            value: 0,
          }));
        } else {
          formatted = history.map((item) => ({
            month: String(item.year),
            value: Number(Number(item.price).toFixed(2)) || 0,
          }));
        }

        setPriceData(formatted);

      } catch (err) {
        console.error("Price Trend Error:", err);

        // 🔥 Also fallback on error
        setPriceData([
          { month: "2019", value: 0 },
          { month: "2020", value: 0 },
          { month: "2021", value: 0 },
          { month: "2022", value: 0 },
          { month: "2023", value: 0 },
        ]);
      }
    };

    fetchPriceTrend();
  }, [priceHsCode]);



  useEffect(() => {
    if (!demandHsCode) return;

    const fetchDemandForecast = async () => {
      try {
        const res = await DemandGrowthForecast(demandHsCode);

        const forecast = res?.data?.forecast || [];

        const formatted = forecast.map((item) => ({
          month: String(item.year),
          value: Number(Number(item.demandIndex).toFixed(2)) || 0,
        }));

        setDemandData(formatted);

      } catch (err) {
        console.error("Demand Forecast Error:", err);
        setDemandData([]);
      }
    };

    fetchDemandForecast();
  }, [demandHsCode]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await ForecastOverview();

        if (res?.success) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error("Forecast Overview Error:", err);
      }
    };

    fetchOverview();
  }, []);

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">
        {/* METRICS ROW */}
        <div className="tp-metrics-row">

          {/* 1️⃣ Currency */}
          <TPMetricCard
            title="Currency Exchange Tracker"
            value={metrics.currency?.rate ?? 0}
            unit={metrics.currency?.pair || ""}
            footerLabel={
              metrics.currency?.direction === "Up"
                ? "Currency strengthening"
                : "Currency weakening"
            }
            trend={`${metrics.currency?.changePercent ?? 0}`}
            trendDirection={
              (metrics.currency?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

          {/* 2️⃣ Shipping */}
          <TPMetricCard
            title="Shipping Cost Trend"
            value={`$${metrics.shipping?.average ?? 0}`}
            unit="per container"
            footerLabel="Compared to last period"
            trend={`${metrics.shipping?.changePercent ?? 0}`}
            trendDirection={
              (metrics.shipping?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

          {/* 3️⃣ Demand */}
          <TPMetricCard
            title="Product Demand Signal"
            value={`${metrics.demand?.percent ?? 0}%`}
            footerLabel={metrics.demand?.product || "No product"}
            trend={`${metrics.demand?.changePercent ?? 0}`}
            trendDirection={
              (metrics.demand?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

          {/* 4️⃣ Supplier */}
          <TPMetricCard
            title="Supplier Trust Score"
            value={`${metrics.supplier?.score ?? 0}/10`}
            footerLabel="Supplier rating index"
            trend={`${metrics.supplier?.changePercent ?? 0}`}
            trendDirection={
              (metrics.supplier?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

        </div>

        {/* CHARTS */}
        <div className="tp-grid tp-grid-2">
          <TPChart
            title="Product Price Trend"
            type="line"
            data={priceData}
            series={[{ key: "value", label: "Price" }]}
            selectedProduct={priceHsCode}
            onSelectProduct={setPriceHsCode}

          />

          <TPChart
            title="Demand Growth Forecast"
            type="area"
            data={demandData}
            series={[{ key: "value", label: "Demand" }]}
            selectedProduct={demandHsCode}
            onSelectProduct={setDemandHsCode}

          />

        </div>
      </div>
    </section>
  );
};

export default OverviewCharts;
