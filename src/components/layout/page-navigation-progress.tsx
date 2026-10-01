"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingPanel } from "@/components/layout/loading-panel";

export function PageNavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    let timeout: number | undefined;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.getAttribute("href") || "", window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      setLoading(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setLoading(false), 12000);
    }

    function onPopState() {
      setLoading(false);
      window.clearTimeout(timeout);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.clearTimeout(timeout);
    };
  }, []);

  return loading ? <LoadingPanel /> : null;
}
