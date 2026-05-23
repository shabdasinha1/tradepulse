const STORAGE_KEY = "tp_recent_products";

export const getRecentProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRecentProduct = (product) => {
  try {
    const existing = getRecentProducts();

    // remove duplicate if already exists
    const filtered = existing.filter(
      (item) => item.selectedHsCode !== product.selectedHsCode
    );

    // latest first
    const updated = [product, ...filtered].slice(0, 3);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  } catch (err) {
    console.log(err);
  }
};

export const initializeRecentProducts = (products) => {
  try {
    const existing = getRecentProducts();

    // only initialize once
    if (existing.length === 0 && products?.length > 0) {
      const initialProducts = products.slice(0, 3);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialProducts)
      );
    }
  } catch (err) {
    console.log(err);
  }
};