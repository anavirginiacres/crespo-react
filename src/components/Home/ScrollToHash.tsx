"use client";

import { useEffect } from "react";

export default function ScrollToHash() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const targetId = hash.replace("#", "");
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
