import { FiBox } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { DashboardDutySnapshot } from "../../services/DashboardService";

const CustomsDutyRates = () => {

  const { startDate, endDate, reporterCode } = useSelector(
    (state) => state.corridor
  );

  const { data } = useQuery({
    queryKey: ["dutySnapshot", startDate, endDate, reporterCode],
    queryFn: () =>
      DashboardDutySnapshot({
        startDate,
        endDate,
        reporterCode,
      }),
    enabled: !!reporterCode,
  });

  const duties = data?.data || [];

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">

        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiBox />
              <h3 className="tp-card-title">
                UK Import Duty Snapshot
              </h3>
            </div>
          }
        >
          <div className="tp-grid tp-duty-grid">
            {duties.map((item, i) => (
              <div key={i} className="tp-duty-card">

                <span className="tp-duty-title">
                  {item.category}
                </span>

                <strong className="tp-duty-rate tp-text-neutral">
                  {item.range}
                </strong>

                <span className="tp-duty-note tp-muted">
                  HS Code: {item.hsCode}
                </span>

              </div>
            ))}
          </div>
        </TradePulseCard>

      </div>
    </section>
  );
};

export default CustomsDutyRates;