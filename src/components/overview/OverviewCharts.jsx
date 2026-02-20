import React, { useEffect, useState } from "react";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";
import { DashboardPriceTrend, DemandGrowthForecast } from "../../services/DashboardService.jsx";

const OverviewCharts = () => {
  const [priceHsCode, setPriceHsCode] = useState("27");
  const [demandHsCode, setDemandHsCode] = useState("27");
  const [priceData, setPriceData] = useState([]);
  const [demandData, setDemandData] = useState([]);






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



  return (
    <section className="tp-section">
      <div className="tp-container">
        {/* METRICS ROW */}
        <div className="tp-metrics-row">
          <TPMetricCard
            title="Currency Exchange Tracker"
            value="1.05"
            unit="USD/NGN (x100)"
            footerLabel="Naira strengthening"
            trend={2.3}
            trendDirection="up"
          />

          <TPMetricCard
            title="Shipping Cost Trend"
            value="$2,450"
            unit="per container"
            footerLabel="Down from last month"
            trend={5.2}
            trendDirection="down"
          />

          <TPMetricCard
            title="Product Demand Signal"
            value="72%"
            footerLabel="Electronics category"
            trend={14}
            trendDirection="up"
          />

          <TPMetricCard
            title="Supplier Trust Score"
            value="8.7/10"
            footerLabel="Verified suppliers"
            trend={1.2}
            trendDirection="up"
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
