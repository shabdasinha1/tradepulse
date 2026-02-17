import React, { useEffect, useState } from "react";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";
import {
  DashboardPriceTrend,
  DemandGrowthForecast,
} from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";

const OverviewCharts = () => {
  // const priceData = [
  //   { month: "Jan", value: 45 },
  //   { month: "Feb", value: 52 },
  //   { month: "Mar", value: 48 },
  //   { month: "Apr", value: 61 },
  //   { month: "May", value: 55 },
  //   { month: "Jun", value: 68 },
  // ];

  // const demandData = [
  //   { month: "Jan", value: 50 },
  //   { month: "Feb", value: 57 },
  //   { month: "Mar", value: 60 },
  //   { month: "Apr", value: 54 },
  //   { month: "May", value: 67 },
  //   { month: "Jun", value: 72 },
  // ];
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [priceData, setPriceData] = useState([]);
  const [demandData, setDemandData] = useState([]);

  const [priceHsCode, setPriceHsCode] = useState("27");
  const [demandHsCode, setDemandHsCode] = useState("27");

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // 🔥 Run both APIs in parallel (faster)
        const [priceRes, demandRes] = await Promise.all([
          DashboardPriceTrend(priceHsCode),
          DemandGrowthForecast(demandHsCode),
        ]);

        const formattedPrice = (priceRes?.data?.history || []).map((item) => ({
          month: String(item.year), // ensure string for X-axis
          value: Number(Number(item.price).toFixed(2)) || 0,
        }));

        const formattedDemand = (demandRes?.data?.forecast || []).map(
          (item) => ({
            month: String(item.year),
            value: Number(Number(item.demandIndex).toFixed(2)) || 0,
          }),
        );

        setPriceData(formattedPrice);
        setDemandData(formattedDemand);
      } catch (err) {
        const message = GetApiErrorMessage(err);
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [priceHsCode, demandHsCode]);
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
          />

          <TPChart
            title="Demand Growth Forecast"
            type="area"
            data={demandData}
            series={[{ key: "value", label: "Demand" }]}
          />
        </div>
      </div>
    </section>
  );
};

export default OverviewCharts;
