import React from "react";

export const DashboardFooter = () => {
  return (
    <>
      {/* <div className="tp-footer-divider"></div> */}
      <div className="tp-dashboard-footer-bottom">
        <div>© {new Date().getFullYear()} TradePulse. All rights reserved.</div>

        <div className="tp-dashboard-footer-dev">
          Developed by{" "}
          <a href="https://robotronix.co.in/" target="_blank" rel="noreferrer">
            Robotronix Engineering Tech Pvt. Ltd.
          </a>
        </div>
      </div>
    </>
  );
};
