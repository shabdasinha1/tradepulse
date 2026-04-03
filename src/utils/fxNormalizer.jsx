export const normalizeFxRates = (data = []) => {
  const rates = {};

  // ✅ Always include NGN base
  rates["NGN"] = 1;

  data.forEach((item) => {
    if (!item?.pair || !item?.rate) return;

    const [base, quote] = item.pair.split("/");

    // ✅ Only take rates where quote = NGN
    if (quote === "NGN") {
      rates[base] = item.rate;
    }
  });

  return rates;
};