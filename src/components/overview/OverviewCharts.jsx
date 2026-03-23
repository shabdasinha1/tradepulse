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
import useCurrencyConverter from "../../hooks/useCurrencyConverter";
import { CiLight } from "react-icons/ci";
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
    baseCurrency,
    currencySymbol,
  } = useSelector((state) => state.corridor);
  const exchangeRates = useMemo(() => [], []);
  const { convert } = useCurrencyConverter(exchangeRates);
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

    const rawShipping = data.avgShippingCost?.value ?? 0;
    const shippingCurrency = data.avgShippingCost?.unit || "USD";

    const convertedShipping = convert(rawShipping, shippingCurrency);

    setMetrics({
      currency: {
        // rate: data.fxImpact?.value ?? 0,
        // changePercent: data.fxImpact?.changePercent ?? 0,
        // pair: data.fxImpact?.pair ?? "",
        pairs: data.fxImpact?.pairs || []
      },
      shipping: {
        average: Number(convertedShipping.toFixed(2)),
        changePercent: data.avgShippingCost?.changePercent ?? 0,
        unit: baseCurrency,
        description: data.avgShippingCost?.note ?? ""
      },
      // demand: {
      //   percent: data.importDemandSignal?.value ?? 0,
      //   changePercent: data.importDemandSignal?.changePercent ?? 0,
      //   product: "Import Demand",
      // },
      demand: {
        demandData: {
          current: {
            currentYear: data.importDemandSignal.currentYear,
            currentValue: data.importDemandSignal.currentValue,
          },
          previous: {
            previousYear: data.importDemandSignal.previousYear,
            previousValue: data.importDemandSignal.previousValue,
          },

        },
        changePercent: data.importDemandSignal.changePercent,
        trend: data.importDemandSignal.trend,
      },
      supplier: {
        score: data.exporterReliabilityScore?.value ?? 0,
        maxScore: data.exporterReliabilityScore?.max ?? 0,
        trend: data.exporterReliabilityScore?.trend,
        risk: data.exporterReliabilityScore?.risk,
        description: data.exporterReliabilityScore?.description ?? "",
      },
    });
  }, [kpiData, baseCurrency]);
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
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">
        <div className="tp-metrics-row">
          {/* <TPMetricCard
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
          /> */}
          <TPMetricCard
            title={`FX Impact (${corridor || "Selected Corridor"})`}
            fxPairs={metrics.currency?.pairs}
            footerLabel={
              metrics.currency?.direction === "Up"
                ? "Recent FX movement affecting UK import costs"
                : "Current exchange rate movement affecting UK import cost."
            }
            tooltip={"Indicates how currency movements affect import/export costs  "}
          />

          {/* <TPMetricCard
            title={`Avg Shipping Cost (${corridor || "Selected Corridor"})`}
            value={`${currencySymbol}${metrics.shipping?.average ?? 0}`}
            unit={` per container`}
            footerLabel="Average container cost within selected trade corridor."
            trend={`${metrics.shipping?.changePercent ?? 0}`}
          // trendDirection={
          //   (metrics.shipping?.changePercent ?? 0) < 0 ? "down" : "up"
          // }
          /> */}
          <TPMetricCard
            title={`Avg Shipping Cost (${kpiData?.data?.avgShippingCost?.route || "Selected Corridor"})`}
            shippingData={{
              // route: kpiData?.data?.avgShippingCost?.route,
              internalRoute: kpiData?.data?.avgShippingCost?.internalRoute,
              value: `${currencySymbol}${metrics?.shipping?.average ?? 0}`, // ✅ formatted
              // lastUpdated: kpiData?.data?.avgShippingCost?.lastUpdated,
            }}
            lastUpdated={formatDate(kpiData?.data?.avgShippingCost?.lastUpdated)}
            // currencySymbol={currencySymbol}
            trend={`${metrics.shipping?.changePercent ?? 0}`}
            footerLabel="Average container cost within selected trade corridor."
            tooltip={metrics?.shipping?.description}
          />

          <TPMetricCard
            title={`${country || ""} Import Demand Signal`}
            footerLabel={
              metrics.demand?.product ||
              "Trend of UK import demand for selected product"
            }
            trend={`${metrics.demand?.changePercent ?? 0}`}
            fxPairs={
              metrics.demand?.demandData
                ? [
                  {
                    pair: `${metrics.demand.demandData.current.currentYear}`,
                    value: metrics.demand.demandData.current.currentValue,

                  },
                  {
                    pair: `${metrics.demand.demandData.previous.previousYear}`,
                    value: metrics.demand.demandData.previous.previousValue,

                  },
                ]
                : []
            }
            tooltip={"Represents total import demand for selected product "}
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
