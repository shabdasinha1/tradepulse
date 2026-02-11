import { useEffect, useState } from "react";

const THEME_KEY = "tp-theme";

const isBrowser = typeof window !== "undefined";

const getSystemTheme = () => {
  if (!isBrowser || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  const applyTheme = (nextTheme, persist = true) => {
    if (!isBrowser) return;

    const root = document.documentElement;

    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${nextTheme}`);

    if (persist) {
      localStorage.setItem(THEME_KEY, nextTheme);
    }

    setTheme(nextTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  /* INIT THEME */
  useEffect(() => {
    if (!isBrowser) return;

    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      applyTheme(savedTheme);
    } else {
      applyTheme(getSystemTheme(), false);
    }
  }, []);

  /* SYNC ACROSS TABS */
  useEffect(() => {
    if (!isBrowser) return;

    const onStorage = (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        applyTheme(e.newValue, false);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: applyTheme,
  };
};
