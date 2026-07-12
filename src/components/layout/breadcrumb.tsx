import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
      {items.map((item, index) => (
        <span className="inline-flex items-center gap-2" key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="text-graphite">{item.label}</span>}
          {index < items.length - 1 ? <ChevronRight className="size-4" /> : null}
        </span>
      ))}
    </nav>
  );
}
