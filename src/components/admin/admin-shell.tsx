"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  profileName: string;
};

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/auditoria", label: "Auditoria" }
];

export function AdminShell({ children, profileName }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto min-h-screen max-w-[1440px] lg:grid lg:grid-cols-[260px_1fr]">
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-4 lg:hidden">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-stone-400">Atlas Móveis</p>
            <p className="mt-1 font-serif text-2xl text-graphite">Painel</p>
          </div>
          <button
            aria-label={open ? "Fechar menu do painel" : "Abrir menu do painel"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white text-graphite"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <button
          aria-label="Fechar menu do painel"
          className={cn(
            "fixed inset-0 z-40 bg-black/35 transition-opacity lg:hidden",
            open ? "visible opacity-100" : "invisible opacity-0"
          )}
          onClick={() => setOpen(false)}
          type="button"
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[min(82vw,300px)] border-r border-stone-200 bg-graphite px-6 py-8 text-stone-200 transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.45em] text-stone-500">Atlas Móveis</p>
              <h1 className="mt-3 font-serif text-3xl">Painel</h1>
              <p className="mt-3 text-sm text-stone-400">{profileName}</p>
            </div>
            <AdminSignOutButton />
          </div>

          <nav className="mt-10 grid gap-2">
            {adminLinks.map((link) => (
              <Link
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm hover:bg-white/10",
                  pathname === link.href && "bg-white/10 text-white"
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
