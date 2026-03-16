import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { FiTruck } from "react-icons/fi";
import { MdOutlineCurrencyPound } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { useState } from "react";

import TradePulseCard from "../common/TradePulseCard.jsx";
import VerticalScroll from "../common/VerticalScroll.jsx";
import UniversalFilter from "../common/UniversalFilter";

import {
  DashboardExchangeRate,
  DashboardShippingCosts
} from "../../services/DashboardService.jsx";
import { queryKeys } from "../../utils/queryKeys";

const MarketOverview = () => {

  const [fxFilterOpen, setFxFilterOpen] = useState(false);
  const [shipFilterOpen, setShipFilterOpen] = useState(false);

  const { baseCurrency, partnerCode, startDate, endDate } =
    useSelector((state) => state.corridor);

  /* ===============================
     FX FILTER STATE
  =============================== */

  const [fxFilters, setFxFilters] = useState({
    quoteCurrency: "",
    startDate: "",
    endDate: "",
  });

  const activeQuote = fxFilters.quoteCurrency || "";
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
  baseCurrency,
  activeQuote,
  activeStart,
  activeEnd
),
    queryFn: () =>
      DashboardExchangeRate({
        baseCurrency,
        quoteCurrency: activeQuote,
        startDate: activeStart,
        endDate: activeEnd,
      }),
    enabled: !!partnerCode,
    select: (res) => res?.data || [],
    staleTime: 1000 * 60 * 5
  });

  /* ===============================
     SHIPPING QUERY
  =============================== */

  const { data: shippingData = [] } = useQuery({
    queryKey: queryKeys.shippingCosts(
  shipStart,
  shipEnd,
  shipFilters.origin,
  shipFilters.destination
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
    staleTime: 1000 * 60 * 5
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
                <h3 className="tp-card-title">
                  Corridor FX & Cost Impact Monitor
                </h3>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
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

              <div className="rtx-tp-rate-card-container">

                {exchangeRates.map((r, index) => (
                  <div key={index} className="tp-rate-card">

                    <div className="tp-rate-header">

                      <span className="tp-rate-symbol">
                        {r.currency}
                      </span>

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

                    <span className="tp-rate-pair">{r.pair}</span>

                    <strong className="tp-rate-value">
                      {r.rate}
                    </strong>

                  </div>
                ))}

              </div>

            </VerticalScroll>
          </div>
        </TradePulseCard>

        {/* ================= SHIPPING ================= */}

        <TradePulseCard
          header={
            <div className="tp-card-header tp-card-filter-header">

              <div className="tp-card-title-wrap">
                <FiTruck />
                <h3 className="tp-card-title">
                  Latest Shipping Costs
                </h3>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setShipFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>

            </div>
          }
        >

          <div className="tp-grid tp-ship-grid">

            {shippingData.map((s, i) => (
              <div key={i} className="tp-ship-card">

                <div className="tp-ship-header">

                  <div>
                    <h4 className="tp-ship-route">
                      {s.corridor}
                    </h4>

                    <span className="tp-ship-port">
                      {s.currency}
                    </span>
                  </div>

                  <span className="tp-ship-days">
                    {s.days ? `${s.days} Days` : "0 Days"}
                  </span>

                </div>

                <div className="tp-ship-footer">

                  <strong className="tp-ship-price">
                    {s.currency} {s.cost}
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

        </TradePulseCard>

        {/* ================= FX FILTER ================= */}

        {fxFilterOpen && (
          <UniversalFilter
            showTimeRange
            showQuoteCurrency
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