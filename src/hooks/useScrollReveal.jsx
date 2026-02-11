import { useEffect, useRef } from "react";

/**
 * useScrollReveal
 * ----------------------------------
 * direction: "up" | "down" | "left" | "right"
 * threshold: number (0 → 1)
 * rootMargin: string
 * delay: number (seconds)
 * once: boolean
 */
const useScrollReveal = ({
  direction = "up",
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
  delay = 0,
  once = true,
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("tp-reveal", `tp-reveal--${direction}`);

    if (delay) {
      el.style.transitionDelay = `${delay}s`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("is-visible");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [direction, threshold, rootMargin, delay, once]);

  return ref;
};

export default useScrollReveal;
