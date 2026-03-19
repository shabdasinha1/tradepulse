import React from "react";
import TradePulseCard from "../common/TradePulseCard";

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
        <span className="tp-metric-title">{title}</span>

        {/* 🔴 TOP RIGHT RISK */}
        {risk && (
          <span className={`tp-risk-badge tp-risk-${risk.toLowerCase()}`}>
            {capitalize(risk)} Risk
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="tp-metric-value-wrap">
        <span className="tp-metric-value">{value}</span>
        {unit && <span className="tp-metric-unit">{unit}</span>}
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
