import { useSelector } from "react-redux";
import { useMemo } from "react";

const useCurrency = () => {
  const { rates } = useSelector((state) => state.fx);
  const { baseCurrency } = useSelector((state) => state.corridor);

  const convert = useMemo(() => {
    return (amount, currency) => {
      if (amount === null || amount === undefined) return 0;

      // ✅ same currency
      if (currency === baseCurrency) return amount;

      const sourceRate = rates[currency];
      const targetRate = rates[baseCurrency];

      // ❗ handle missing rates
      if (!sourceRate || !targetRate) {
        if (process.env.NODE_ENV === "development") {
          console.warn("FX missing:", currency, baseCurrency);
        }
        return amount;
      }

      const converted = amount * (sourceRate / targetRate);

      return isFinite(converted) ? converted : amount;
    };
  }, [rates, baseCurrency]);

  return { convert };
};

export default useCurrency;