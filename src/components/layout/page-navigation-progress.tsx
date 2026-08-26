"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PageNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.getAttribute("href") || "", window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.search === window.location.search) return;
      setLoading(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <div aria-hidden className={`fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-graphite transition-all duration-300 ${loading ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} />;
}
