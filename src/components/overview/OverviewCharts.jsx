import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";
import {
  DashboardExportPriceTrend,
  DashboardImportDemandTrend,
  DashboardKPIs,
} from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys";
const fillMissingYears = (data, valueKey = "value") => {
  if (!data?.length) return [];

  // Convert to year-based structure
  const formatted = data.map((item) => ({
    year: Number(item.month),
    [valueKey]: item[valueKey],
  }));

  const map = new Map();
  formatted.forEach((item) => {
    map.set(item.year, item[valueKey]);
  });

  const years = formatted.map((item) => item.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const result = [];
  for (let y = minYear; y <= maxYear; y++) {
    result.push({
      year: y,
      [valueKey]: map.get(y) ?? 0,
    });
  }

  return result;
};
const OverviewCharts = () => {
  const {
    country,
    corridor,
    reporterCode,
    partnerCode,
    productId,
    startDate,
    endDate,
  } = useSelector((state) => state.corridor);

  const [priceHsCode, setPriceHsCode] = useState("27");
  const [demandHsCode, setDemandHsCode] = useState("27");

  const [metrics, setMetrics] = useState({
    currency: null,
    shipping: null,
    demand: null,
    supplier: null,
  });

  const [priceFilters, setPriceFilters] = useState({
    partnerCode: "",
    product: "",
    startDate: "",
    endDate: "",
  });

  const [demandFilters, setDemandFilters] = useState({
    partnerCode: "",
    product: "",
    startDate: "",
    endDate: "",
  });
  const pricePartner = priceFilters.partnerCode || partnerCode;
  const priceProduct = priceFilters.product || productId;
  const priceStartDate = priceFilters.startDate || startDate;
  const priceEndDate = priceFilters.endDate || endDate;

  const demandPartner = demandFilters.partnerCode || partnerCode;
  const demandProduct = demandFilters.product || productId;
  const demandStartDate = demandFilters.startDate || startDate;
  const demandEndDate = demandFilters.endDate || endDate;

  /* ===============================
     PRICE TREND
  ================================= */

  const { data: priceTrendData } = useQuery({
    queryKey: queryKeys.exportPriceTrend(
      reporterCode,
      pricePartner,
      priceProduct,
      priceStartDate,
      priceEndDate,
    ),
    queryFn: () =>
      DashboardExportPriceTrend({
        reporter: reporterCode,
        partner: pricePartner,
        product: priceProduct,
        startDate: priceStartDate || undefined,
        endDate: priceEndDate || undefined,
      }),
    enabled: !!reporterCode && !!pricePartner,
    staleTime: 1000 * 60 * 5,
  });

  // const priceData = useMemo(() => {
  //   const trend = priceTrendData?.data || [];

  //   return trend.map((item) => ({
  //     month: item.date?.slice(0, 4),
  //     value: Number(item.price?.toFixed(2)) || 0,
  //   }));
  // }, [priceTrendData]);
  const priceData = useMemo(() => {
    const trend = priceTrendData?.data || [];

    const mapped = trend.map((item) => ({
      month: item.date?.slice(0, 4),
      value: Number(item.price?.toFixed(2)) || 0,
    }));

    return fillMissingYears(mapped);
  }, [priceTrendData]);

  /* ===============================
     DEMAND TREND
  ================================= */

  const { data: demandTrendData } = useQuery({
    queryKey: queryKeys.importDemandTrend(
      reporterCode,
      demandPartner,
      demandProduct,
      demandStartDate,
      demandEndDate,
    ),
    queryFn: () =>
      DashboardImportDemandTrend({
        reporter: reporterCode,
        partner: demandPartner,
        product: demandProduct,
        startDate: demandStartDate || undefined,
        endDate: demandEndDate || undefined,
      }),
    enabled: !!reporterCode && !!demandPartner,
    staleTime: 1000 * 60 * 5,
  });

  // const demandData = useMemo(() => {
  //   const trend = demandTrendData?.data || [];

  //   return trend.map((item) => ({
  //     month: item.date?.slice(0, 4),
  //     value: Number(item.demand?.toFixed(2)) || 0,
  //   }));
  // }, [demandTrendData]);
  const demandData = useMemo(() => {
    const trend = demandTrendData?.data || [];

    const mapped = trend.map((item) => ({
      month: item.date?.slice(0, 4),
      value: Number(item.demand?.toFixed(2)) || 0,
    }));

    return fillMissingYears(mapped);
  }, [demandTrendData]);

  /* ===============================
     KPI METRICS
  ================================= */

  const { data: kpiData } = useQuery({
    queryKey: queryKeys.dashboardKPIs(
      reporterCode,
      partnerCode,
      productId,
      startDate,
      endDate,
    ),
    queryFn: () =>
      DashboardKPIs({
        reporter: reporterCode,
        partner: partnerCode,
        product: productId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
    enabled: !!reporterCode && !!partnerCode,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const data = kpiData?.data;

    if (!data) return;

    setMetrics({
      currency: {
        rate: data.fxImpact?.value ?? 0,
        changePercent: data.fxImpact?.changePercent ?? 0,
        pair: data.fxImpact?.pair ?? "",
      },
      shipping: {
        average: data.avgShippingCost?.value ?? 0,
        changePercent: data.avgShippingCost?.changePercent ?? 0,
        unit: data.avgShippingCost?.unit ?? "",
      },
      demand: {
        percent: data.importDemandSignal?.value ?? 0,
        changePercent: data.importDemandSignal?.changePercent ?? 0,
        product: "Import Demand",
      },
      supplier: {
        score: data.exporterReliabilityScore?.value ?? 0,
        maxScore: data.exporterReliabilityScore?.max ?? 0,
        trend: data.exporterReliabilityScore?.trend,
        risk: data.exporterReliabilityScore?.risk,
        description: data.exporterReliabilityScore?.description ?? "",
      },
    });
  }, [kpiData]);
  /* ===============================
   MARGIN IMPACT CALCULATION
================================= */

  const fxPercent = metrics.currency?.changePercent ?? 0;

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
          // trendDirection={
          //   (metrics.currency?.changePercent ?? 0) < 0 ? "down" : "up"
          // }
          />

          <TPMetricCard
            title={`Avg Shipping Cost (${corridor || "Selected Corridor"})`}
            value={`${metrics.shipping?.average ?? 0}`}
            unit={`${metrics.shipping?.unit || ""} per container`}
            footerLabel="Average container cost within selected trade corridor."
            trend={`${metrics.shipping?.changePercent ?? 0}`}
          // trendDirection={
          //   (metrics.shipping?.changePercent ?? 0) < 0 ? "down" : "up"
          // }
          />

          <TPMetricCard
            title={`${country || ""} Import Demand Signal`}
            value={`${metrics.demand?.percent ?? 0}`}
            footerLabel={
              metrics.demand?.product ||
              "Trend of UK import demand for selected product"
            }
            trend={`${metrics.demand?.changePercent ?? 0}`}
          // trendDirection={
          //   (metrics.demand?.changePercent ?? 0) < 0 ? "down" : "up"
          // }
          />

          <TPMetricCard
            title="Exporter Reliability Score"
            value={`${metrics.supplier?.score ?? 0}/${metrics.supplier?.maxScore ?? 0}`}
            footerLabel="Aggregate reliability index based on activity frequency and volatility consistency"
            trend={metrics.supplier?.trend}
            risk={metrics.supplier?.risk}
            className="tp-kpi-expoter-reliability"
            tooltip={metrics.supplier?.description}
          />
        </div>

        <div className="tp-grid tp-grid-2">
          <TPChart
            title="Export Price Trend"
            type="line"
            data={priceData}
            xKey="year"
            series={[{ key: "value", label: "Price" }]}
            activeFilters={{
              partnerCode: pricePartner,
              product: priceProduct,
              startDate: priceStartDate,
              endDate: priceEndDate,
            }}
            onFilterChange={(filters) => setPriceFilters(filters)}
          />
          <TPChart
            title={`${country || ""} Import Demand Trend`}
            type="area"
            data={demandData}
            xKey="year"
            series={[{ key: "value", label: "Demand" }]}
            activeFilters={{
              partnerCode: demandPartner,
              product: demandProduct,
              startDate: demandStartDate,
              endDate: demandEndDate,
            }}
            onFilterChange={(filters) => setDemandFilters(filters)}
          />
        </div>
      </div>
    </section>
  );
};

export default OverviewCharts;
