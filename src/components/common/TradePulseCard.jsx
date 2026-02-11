const TradePulseCard = ({ header, children, className = "" }) => {
  return (
    <div className={`tp-card ${className}`}>
      {header && (
        <div className="tp-card-header">
          {header}
        </div>
      )}
      {children}
    </div>
  );
};

export default TradePulseCard;
