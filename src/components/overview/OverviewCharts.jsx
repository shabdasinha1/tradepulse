import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";
import {
  DashboardPriceTrend,
  DemandGrowthForecast,
  DashboardKPIs
} from "../../services/DashboardService.jsx";

const OverviewCharts = () => {

  const { corridor, reporterCode, partnerCode, productId, startDate, endDate } =
    useSelector((state) => state.corridor);

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

  const [budget, setBudget] = useState(250000);

  /* ===============================
     PRICE TREND
  ================================= */

  useEffect(() => {
    if (!priceHsCode || !reporterCode || !partnerCode) return;

    const fetchPriceTrend = async () => {
      try {

        const res = await DashboardPriceTrend({
          hs: priceHsCode,
          reporter: reporterCode,
          partner: partnerCode,
        });

        const history = res?.data?.history || [];

        let formatted = [];

        if (history.length === 0) {

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

  }, [priceHsCode, reporterCode, partnerCode]);

  /* ===============================
     DEMAND TREND
  ================================= */

  useEffect(() => {
    if (!demandHsCode || !reporterCode || !partnerCode) return;

    const fetchDemandForecast = async () => {

      try {

        const res = await DemandGrowthForecast({
          hs: demandHsCode,
          reporter: reporterCode,
          partner: partnerCode,
        });

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

  }, [demandHsCode, reporterCode, partnerCode]);

  /* ===============================
     KPI METRICS
  ================================= */

  useEffect(() => {

    if (!reporterCode || !partnerCode) return;

    const fetchKPIs = async () => {

      try {

        const res = await DashboardKPIs({
          reporter: reporterCode,
          partner: partnerCode,
          product: productId || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });

        const data = res?.data;

        if (!data) return;

        setMetrics({

          currency: {
            rate: data.fxImpact?.value ?? 0,
            changePercent: data.fxImpact?.changePercent ?? 0,
            pair: "USD/NGN",
          },

          shipping: {
            average: data.avgShippingCost?.value ?? 0,
            changePercent: data.avgShippingCost?.changePercent ?? 0,
          },

          demand: {
            percent: data.importDemandSignal?.value ?? 0,
            changePercent: data.importDemandSignal?.changePercent ?? 0,
            product: "Import Demand",
          },

          supplier: {
            score: data.exporterReliabilityScore?.value ?? 0,
            changePercent: 0,
          }

        });

      } catch (err) {

        console.error("KPI API Error:", err);

      }

    };

    fetchKPIs();

  }, [reporterCode, partnerCode, productId, startDate, endDate]);

  /* ===============================
   MARGIN IMPACT CALCULATION
================================= */

  const fxPercent = metrics.currency?.changePercent ?? 0;
  const numericBudget = Number(budget) || 0;
  const impact = (numericBudget * fxPercent) / 100;

  let severity = "Low";
  let severityClass = "tp-pill-success";

  if (Math.abs(fxPercent) >= 1 && Math.abs(fxPercent) < 2) {
    severity = "Medium";
    severityClass = "tp-pill-warning";
  }

  if (Math.abs(fxPercent) >= 2) {
    severity = "High";
    severityClass = "tp-text-down";
  }

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">

        <div className="tp-metrics-row">

         <TPMetricCard
  title={`FX Impact (${corridor || "Selected Corridor"})`}
  value={metrics.currency?.rate ?? 0}
  unit={metrics.currency?.pair || ""}
  footerLabel={
    metrics.currency?.direction === "Up"
      ? "Recent FX movement affecting UK import costs"
      : "Current exchange rate movement affecting UK import cost."
  }
  trend={`${metrics.currency?.changePercent ?? 0}`}
  trendDirection={
    (metrics.currency?.changePercent ?? 0) < 0 ? "down" : "up"
  }
/>

<TPMetricCard
  title={`Avg Shipping Cost (${corridor || "Selected Corridor"})`}
  value={`$${metrics.shipping?.average ?? 0}`}
  unit="per container"
  footerLabel="Average container cost within selected trade corridor."
  trend={`${metrics.shipping?.changePercent ?? 0}`}
  trendDirection={
    (metrics.shipping?.changePercent ?? 0) < 0 ? "down" : "up"
  }
/>

          <TPMetricCard
            title="UK Import Demand Signal"
            value={`${metrics.demand?.percent ?? 0}%`}
            footerLabel={metrics.demand?.product || "Trend of UK import demand for selected product"}
            trend={`${metrics.demand?.changePercent ?? 0}`}
            trendDirection={
              (metrics.demand?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

          <TPMetricCard
            title="Exporter Reliability Score"
            value={`${metrics.supplier?.score ?? 0}/10`}
            footerLabel="Aggregate reliability index based on activity frequency and volatilityconsistency"
            trend={`${metrics.supplier?.changePercent ?? 0}`}
            trendDirection={
              (metrics.supplier?.changePercent ?? 0) < 0 ? "down" : "up"
            }
          />

        </div>

        <div className="tp-grid tp-grid-2">

          <TPChart
            title="Export Price Trend (Origin → UK)"
            type="line"
            data={priceData}
            series={[{ key: "value", label: "Price" }]}
            selectedProduct={priceHsCode}
            onSelectProduct={setPriceHsCode}
          />

          <TPChart
            title="UK Import Demand Trend"
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