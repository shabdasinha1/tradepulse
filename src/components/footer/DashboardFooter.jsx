import React from "react";

export const DashboardFooter = () => {
  return (
    <>
      {/* <div className="tp-footer-divider"></div> */}
      <div className="tp-dashboard-footer-bottom">
        © {new Date().getFullYear()} TradePulse. All rights reserved.
      </div>
    </>
  );
};
