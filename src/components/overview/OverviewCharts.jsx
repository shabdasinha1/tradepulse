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

        const formatted = history.map((item) => ({
          month: String(item.year),
          value: Number(Number(item.price).toFixed(2)) || 0,
        }));

        setPriceData(formatted);

      } catch (err) {
        console.error("Price Trend Error:", err);
        setPriceData([]);
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
    <section className="tp-section tp-section--tight">
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
            onSelectProduct={setPriceHsCode}
          />

          <TPChart
            title="Demand Growth Forecast"
            type="area"
            data={demandData}
            series={[{ key: "value", label: "Demand" }]}
            onSelectProduct={setDemandHsCode}
          />

        </div>
      </div>
    </section>
  );
};

export default OverviewCharts;
