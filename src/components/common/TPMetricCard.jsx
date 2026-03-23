import React, { useState } from "react";
import TradePulseCard from "../common/TradePulseCard";
import { FiInfo } from "react-icons/fi";

const capitalize = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const TPMetricCard = ({
  title,
  value,
  unit,
  footerLabel,
  trend,
  risk,
  lastUpdated,
  icon,
  className = "",
  tooltip,
  fxPairs,
  shippingData,
  demandData, // ✅ added
}) => {
  const numericTrend = Number(trend);
  const isStringTrend = Number.isNaN(numericTrend);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Trend color logic
  let trendClass = "tp-text-neutral";

  if (!isStringTrend) {
    if (numericTrend > 0) trendClass = "tp-text-up";
    else if (numericTrend < 0) trendClass = "tp-text-down";
  } else if (typeof trend === "string") {
    if (trend.toLowerCase() === "up") trendClass = "tp-text-up";
    else if (trend.toLowerCase() === "down") trendClass = "tp-text-down";
  }
  const handleMouseMove = (e) => {
    setTooltipPos({
      x: e.clientX + 12, // small offset from cursor
      y: e.clientY + 12,
    });
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  return (
    <TradePulseCard
      className={`tp-metric-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="tp-metric-header">
        <div className="tp-metric-title">
          <span className="tp-title-with-icon">
            {title}

            {tooltip && (
              <span
                className="tp-info-icon"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FiInfo size={14} />
              </span>
            )}
          </span>

          {/* {tooltip && (
            <span className="tp-tooltip-wrapper">
              <FiInfo size={14} />
            </span>
          )} */}
          {/* <span className="tp-tooltip-text">{tooltip}</span> */}
          
        </div>

        {/* 🔴 TOP RIGHT RISK */}
        {risk && (
          <span className={`tp-risk-badge tp-risk-${risk.toLowerCase()}`}>
            {capitalize(risk)} Risk
          </span>
        )}
        {lastUpdated && (
          <span className={`tp-risk-badge`}>
            {lastUpdated}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="tp-metric-value-wrap">
        {shippingData ? (
          <div className="tp-shipping-data">
            <div className="tp-shipping-row">
              <span className="tp-ship-route">{shippingData.route}</span>
            </div>

            <div className="tp-shipping-row">
              <span className="tp-ship-port">{"Internal Route: "}  </span>
              <span className="tp-ship-port">{" "}{shippingData.internalRoute}</span>
            </div>

            <div className="tp-shipping-row">
              <span className="tp-ship-price">
                {shippingData?.value ? `${shippingData?.value}` : "--"}
              </span>
            </div>
          </div>
        ) : demandData ? ( // ✅ added block
          <div className="tp-demand-data">
            <div className="tp-demand-row">
              <span className="tp-demand-year">
                {demandData.current?.currentYear}
              </span>
              <span className="tp-demand-value">
                {Number(
                  demandData.current?.currentValue || 0
                ).toLocaleString()}
              </span>
            </div>

            <div className="tp-demand-row tp-muted">
              <span className="tp-demand-year">
                {demandData.previous?.previousYear}
              </span>
              <span className="tp-demand-value">
                {Number(
                  demandData.previous?.previousValue || 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        ) : fxPairs?.length ? (
          <div className="tp-fx-pairs">
            {fxPairs.map((item, index) => {
              const isUp = item.changePercent > 0;
              const isDown = item.changePercent < 0;

              return (
                <div key={index} className="tp-fx-row tp-card">
                  <span className="tp-fx-pair">{item.pair}</span>
                  <span className="tp-fx-value-wraper">
                    <span className="tp-fx-value">
                      {Number(item.value).toFixed(2)}
                    </span>
                    {item.changePercent !== null && item.changePercent !== undefined && (
                      <span
                        className={
                          isUp
                            ? "tp-text-up"
                            : isDown
                              ? "tp-text-down"
                              : "tp-text-neutral"
                        }
                      >
                        {item.changePercent > 0
                          ? `+${item.changePercent}%`
                          : `${item.changePercent}%`}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <span className="tp-metric-value">{value}</span>
            {unit && <span className="tp-metric-unit">{unit}</span>}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="tp-metric-footer">
        {footerLabel && (
          <span className={`tp-muted tp-trend-width`}>
            {footerLabel}
          </span>
        )}

        {/* 🔽 BOTTOM RIGHT TREND */}
        {trend !== undefined && trend !== null && (
          <span
            className={`${isStringTrend
              ? `tp-risk-badge tp-risk-${capitalize(trend) === "Down" ? "high" : "low"
              }`
              : ""
              } ${trendClass} `}
          >
            {isStringTrend
              ? `${capitalize(trend)} Trend`
              : trend + "%"}
          </span>
        )}
      </div>
    </TradePulseCard>
  );
};

export default TPMetricCard;