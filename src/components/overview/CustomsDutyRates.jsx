import { FiBox } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { DashboardDutySnapshot } from "../../services/DashboardService";
import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../common/EmptyState.jsx";

const CustomsDutyRates = () => {
  const { country, startDate, endDate, reporterCode } = useSelector(
    (state) => state.corridor,
  );

  const { data: duties = [] } = useQuery({
    queryKey: queryKeys.dutySnapshot(reporterCode, startDate, endDate),
    queryFn: () =>
      DashboardDutySnapshot({
        startDate,
        endDate,
        reporterCode,
      }),
    enabled: !!reporterCode,
    staleTime: 1000 * 60 * 10,
    select: (res) => res?.data || [],
  });

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiBox />
              <h3 className="tp-card-title">
                {country || "UK"} Import Duty Snapshot
              </h3>
            </div>
          }
        >
          {duties.length === 0 ? (
            <EmptyState message="No duty data available" />
          ) : (
            <div className="tp-grid tp-duty-grid">
              {duties.map((item) => (
                <div key={item.hsCode} className="tp-duty-card">
                  <span className="tp-duty-title">{item.category}</span>

                  <strong className="tp-duty-rate tp-font-data tp-text-neutral">
                    {item.range}
                  </strong>

                  <span className="tp-duty-note tp-muted">
                    HS Code: {item.hsCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TradePulseCard>
      </div>
    </section>
  );
};

export default CustomsDutyRates;
