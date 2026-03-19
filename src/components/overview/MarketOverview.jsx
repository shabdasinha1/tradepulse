import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { FiTruck } from "react-icons/fi";
import { MdOutlineCurrencyPound } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { useState } from "react";

import TradePulseCard from "../common/TradePulseCard.jsx";
import VerticalScroll from "../common/VerticalScroll.jsx";
import UniversalFilter from "../common/UniversalFilter";
import EmptyState from "../common/EmptyState.jsx";

import {
  DashboardExchangeRate,
  DashboardShippingCosts,
} from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys";

const MarketOverview = () => {
  const [fxFilterOpen, setFxFilterOpen] = useState(false);
  const [shipFilterOpen, setShipFilterOpen] = useState(false);

  const { baseCurrency, reporterCode, partnerCode, startDate, endDate } =
    useSelector((state) => state.corridor);

  /* ===============================
     FX FILTER STATE
  =============================== */

  const [fxFilters, setFxFilters] = useState({
    partnerCode: "",
    startDate: "",
    endDate: "",
  });

  const activePartner = fxFilters.partnerCode || partnerCode;
  const activeStart = fxFilters.startDate || startDate;
  const activeEnd = fxFilters.endDate || endDate;

  /* ===============================
     SHIPPING FILTER STATE
  =============================== */

  const [shipFilters, setShipFilters] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const shipStart = shipFilters.startDate || startDate;
  const shipEnd = shipFilters.endDate || endDate;

  /* ===============================
     EXCHANGE QUERY
  =============================== */

  const { data: exchangeRates = [] } = useQuery({
    queryKey: queryKeys.exchangeRates(
      reporterCode,
      activePartner,
      activeStart,
      activeEnd,
    ),
    queryFn: () =>
      DashboardExchangeRate({
        reporterCode,
        partnerCode: activePartner,
        startDate: activeStart,
        endDate: activeEnd,
      }),
    enabled: !!activePartner,
    select: (res) =>
      (res?.data || []).map((item) => {
        const [base, quote] = item.pair.split("/");

        const volatility = item.volatility || 0;

        let trend = "NEUTRAL";
        if (volatility > 0) trend = "UP";
        if (volatility < 0) trend = "DOWN";

        return {
          pair: item.pair,
          currency: quote,
          rate: item.rate,
          changePercent: Math.abs(volatility),
          trend,
          riskLevel: item.risk_level,
          alert: item.alert,
          date: item.date,
        };
      }),
    staleTime: 1000 * 60 * 5,
  });

  /* ===============================
     SHIPPING QUERY
  =============================== */

  const { data: shippingData = [] } = useQuery({
    queryKey: queryKeys.shippingCosts(
      shipStart,
      shipEnd,
      shipFilters.origin,
      shipFilters.destination,
    ),
    queryFn: () =>
      DashboardShippingCosts({
        page: 1,
        limit: 50,
        startDate: shipStart,
        endDate: shipEnd,
        origin: shipFilters.origin || "",
        destination: shipFilters.destination || "",
      }),
    select: (res) => res?.data || [],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* ================= EXCHANGE ================= */}

        <TradePulseCard
          header={
            <div className="tp-card-header tp-card-filter-header">
              <div className="tp-card-title-wrap">
                <MdOutlineCurrencyPound />
                <div className="tp-card-title-parent">
                  <h3 className="tp-card-title">
                    Corridor FX & Cost Impact Monitor
                  </h3>
                </div>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn tp-margin-bottom"
                onClick={() => setFxFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>
            </div>
          }
        >
          <div className="tp-grid tp-rates-grid">
            <VerticalScroll className="rtx-vertical-scroll">
              {exchangeRates.length === 0 ? (
                <EmptyState message="No exchange rate data available" />
              ) : (
                <div className="rtx-tp-rate-card-container">
                  {exchangeRates.map((r, index) => (
                    <div key={index} className="tp-rate-card">
                      <div className="tp-rate-header">
                        <div className="tp-rate-symbol-wrap">
                          <strong className="tp-kpi-card-highliter">
                            {r.pair}
                          </strong>
                        </div>

                        <span
                          className={`tp-risk-badge tp-risk-${r.riskLevel?.toLowerCase()}`}
                        >
                          {r.riskLevel} <span>Risk</span>
                        </span>

                        {r.alert && <span className="tp-rate-alert">⚠</span>}
                      </div>

                      <div className="tp-rate-changepercent-wrap">
                        <strong className="tp-kpi-card-highliter">
                          {r.rate}
                        </strong>
                        <span
                          className={`tp-rate-change ${
                            r.trend === "UP"
                              ? "tp-text-up"
                              : r.trend === "DOWN"
                                ? "tp-text-down"
                                : "tp-text-neutral"
                          }`}
                        >
                          {r.changePercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </VerticalScroll>
          </div>
        </TradePulseCard>

        {/* ================= SHIPPING ================= */}

        <TradePulseCard
          header={
            <div className="tp-card-header tp-card-filter-header">
              <div className="tp-card-title-wrap">
                <FiTruck />
                <h3 className="tp-card-title">Latest Shipping Costs</h3>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn tp-margin-bottom"
                onClick={() => setShipFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>
            </div>
          }
        >
          {shippingData.length === 0 ? (
            <EmptyState message="No shipping data available" />
          ) : (
            <div className="tp-grid tp-ship-grid">
              {shippingData.map((s, i) => (
                <div key={i} className="tp-ship-card">
                  <div className="tp-ship-header">
                    <div>
                      <span className="tp-ship-route tp-kpi-card-highliter">
                        {s.corridor}
                      </span>
                    </div>

                    <span className="tp-ship-days">
                      {s.age ? `${s.age}` : "0 Days"}
                    </span>
                  </div>

                  <div className="tp-ship-footer">
                    <strong className="tp-kpi-card-highliter">
                      <span className="tp-ship-port">{s.currency}</span>{" "}
                      {s.cost}
                    </strong>

                    <span
                      className={`tp-ship-change ${
                        s.changePercent !== 0
                          ? s.changePercent > 0
                            ? "tp-text-up"
                            : "tp-text-down"
                          : "tp-muted"
                      }`}
                    >
                      {s.changePercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TradePulseCard>

        {/* ================= FX FILTER ================= */}

        {fxFilterOpen && (
          <UniversalFilter
            showCorridor
            showTimeRange
            defaultValues={fxFilters}
            onChange={(filters) => {
              setFxFilters(filters);
              setFxFilterOpen(false);
            }}
          />
        )}

        {/* ================= SHIPPING FILTER ================= */}

        {shipFilterOpen && (
          <UniversalFilter
            showOrigin
            showDestination
            showTimeRange
            defaultValues={shipFilters}
            onChange={(filters) => {
              setShipFilters(filters);
              setShipFilterOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default MarketOverview;
