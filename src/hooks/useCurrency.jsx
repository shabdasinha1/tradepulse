import { useSelector } from "react-redux";
import { useMemo } from "react";

const useCurrency = () => {
  const { rates } = useSelector((state) => state.fx);
  const { baseCurrency } = useSelector((state) => state.corridor);

  const isFxReady = Object.keys(rates).length > 1; // ✅ NGN + at least 1 more

const convert = useMemo(() => {
  return (amount, currency) => {
    if (amount === null || amount === undefined) return 0;

    if (!isFxReady) return amount;

    if (currency === baseCurrency) return amount;

    const sourceRate = rates[currency];
    const targetRate = rates[baseCurrency];

    if (!sourceRate || !targetRate) {
      console.warn("FX missing:", currency, baseCurrency);
      return amount;
    }

    const converted = amount * (sourceRate / targetRate);

    return isFinite(converted) ? converted : amount;
  };
}, [rates, baseCurrency, isFxReady]);
  return { convert, isFxReady };
};

export default useCurrency;