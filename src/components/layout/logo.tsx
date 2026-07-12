import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link className={cn("inline-flex flex-col text-graphite", className)} href="/">
      <span className="text-[1.75rem] uppercase tracking-logo sm:text-[2rem]">Atlas</span>
      <span className="ml-1 mt-1 text-[0.68rem] uppercase tracking-[0.55em] text-stone-500">Móveis</span>
    </Link>
  );
}
