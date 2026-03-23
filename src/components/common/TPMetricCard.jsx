import React from "react";
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
  icon,
  className = "",
  tooltip,
  fxPairs,
  shippingData,
}) => {
  const numericTrend = Number(trend);
  const isStringTrend = Number.isNaN(numericTrend);

  // Trend color logic
  let trendClass = "tp-text-neutral";

  if (!isStringTrend) {
    if (numericTrend > 0) trendClass = "tp-text-up";
    else if (numericTrend < 0) trendClass = "tp-text-down";
  } else if (typeof trend === "string") {
    if (trend.toLowerCase() === "up") trendClass = "tp-text-up";
    else if (trend.toLowerCase() === "down") trendClass = "tp-text-down";
  }
  return (
    <TradePulseCard className={`tp-metric-card ${className}`}>
      {/* Header */}
      <div className="tp-metric-header">
        <div className="tp-metric-title">
          <span>{title}</span>

          {tooltip && (
            <span className="tp-tooltip-wrapper">
              <FiInfo size={14} />
              <span className="tp-tooltip-text">{tooltip}</span>
            </span>
          )}
        </div>

        {/* 🔴 TOP RIGHT RISK */}
        {risk && (
          <span className={`tp-risk-badge tp-risk-${risk.toLowerCase()}`}>
            {capitalize(risk)} Risk
          </span>
        )}
      </div>

      {/* Main Value */}
      {/* <div className="tp-metric-value-wrap">
        <span className="tp-metric-value">{value}</span>
        {unit && <span className="tp-metric-unit">{unit}</span>}
      </div> */}
      <div className="tp-metric-value-wrap">
        {shippingData ? (
          <div className="tp-shipping-data">
            <div className="tp-shipping-row">
              <span className="tp-ship-route">{shippingData.route}</span>
            </div>

            <div className="tp-shipping-row">
              <span className="tp-ship-port">{shippingData.internalRoute}</span>
            </div>

            <div className="tp-shipping-row">
              <span className="tp-ship-price">
                {shippingData.value ? `${shippingData.value}` : "--"}
              </span>
              <span>{shippingData.unit}</span>
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
                      {Number(item.value).toFixed(4)}
                    </span>
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
          <span className={`tp-muted tp-trend-width`}>{footerLabel}</span>
        )}

        {/* 🔽 BOTTOM RIGHT TREND */}
        {trend !== undefined && trend !== null && (
          <span
            className={`${isStringTrend ? `tp-risk-badge tp-risk-${capitalize(trend) === "Down" ? "high" : "low"}` : ""} ${trendClass} `}
          >
            {isStringTrend ? `${capitalize(trend)} Trend` : trend + "%"}
          </span>
        )}
      </div>
    </TradePulseCard>
  );
};

export default TPMetricCard;
