import React from "react";
import TradePulseCard from "../common/TradePulseCard";

const TPMetricCard = ({
  title,
  value,
  unit,
  footerLabel,
  trend,
  trendDirection = "neutral",
  icon,
  className = "",
}) => {
  const trendClass =
    trendDirection === "up"
      ? "tp-text-up"
      : trendDirection === "Downward"
      ? "tp-text-down"
      : "tp-text-neutral";

  return (
    <TradePulseCard className={`tp-metric-card ${className}`}>
      {/* Header */}
      <div className="tp-metric-header">
        <span className="tp-metric-title">{title}</span>

        {icon && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="tp-metric-icon">{icon}</div>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="tp-metric-value-wrap">
        <span className="tp-metric-value">{value}</span>
        {unit && <span className="tp-metric-unit">{unit}</span>}
      </div>

      {/* Footer */}
      <div className="tp-metric-footer">
        {footerLabel && <span className="tp-muted">{footerLabel}</span>}

        {trend !== undefined && (
          <span className={trendClass}>
            {/* {trendDirection === "up" && "↗ "} */}
            {/* {trendDirection === "Downward" && "↘ "} */}
            {trend}%
          </span>
        )}
      </div>
    </TradePulseCard>
  );
};

export default TPMetricCard;