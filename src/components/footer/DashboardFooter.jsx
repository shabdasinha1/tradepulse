export const DashboardFooter = () => {
  return (
    <>
      <div className="tp-dashboard-footer-bottom">
        <div>© {new Date().getFullYear()} TradePulse. All rights reserved.</div>

        <div className="tp-dashboard-footer-dev">
          <a
            href="https://robotronix.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="tp-dashboard-footer-link"
          >
            Developed by Robotronix Engineering Tech Pvt. Ltd.
          </a>
        </div>
      </div>
    </>
  );
};