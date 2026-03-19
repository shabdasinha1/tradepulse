import { useMemo } from "react";
import { useSelector } from "react-redux";

const useCurrencyConverter = (exchangeRates = []) => {
  const { baseCurrency } = useSelector((state) => state.corridor);

  // ✅ Create map: { USD: rate, GBP: rate }
  const rateMap = useMemo(() => {
    const map = {};

    exchangeRates.forEach((r) => {
      if (!r?.pair || !r?.rate) return;

      const [base] = r.pair.split("/");

      if (base) {
        map[base] = r.rate;
      }
    });

    return map;
  }, [exchangeRates]);

  // ✅ universal convert function
  const convert = useMemo(() => {
    return (amount, currency) => {
      // ✅ handle invalid values safely
      if (amount === null || amount === undefined) return 0;

      // ✅ same currency → no conversion
      if (currency === baseCurrency) return amount;

      // ✅ if no FX data at all → return original
      if (!exchangeRates.length) return amount;

      const sourceRate = rateMap[currency];
      const targetRate = rateMap[baseCurrency];

      // ❗ CRITICAL: if missing any rate → NO conversion
      if (!sourceRate || !targetRate) {
        // silently fallback (no console spam in prod)
        return amount;
      }

      // ✅ formula: (A/NGN) / (B/NGN)
      const converted = amount * (sourceRate / targetRate);

      // ✅ prevent NaN / Infinity
      if (!isFinite(converted)) return amount;

      return converted;
    };
  }, [rateMap, baseCurrency, exchangeRates]);

  return { convert };
};

export default useCurrencyConverter;