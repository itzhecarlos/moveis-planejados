"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { CartPreview } from "@/components/cart/cart-preview";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/site";

export function Header() {
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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link className="text-sm text-stone-700 hover:text-graphite" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-xs flex-1 lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input className="pl-10" placeholder="Buscar móveis" />
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" variant="secondary">
            WhatsApp
          </Button>
          <CartPreview />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartPreview mobile />
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex rounded-full border border-stone-200 bg-white p-3"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <button aria-label="Fechar menu móvel" className="fixed inset-0 top-20 z-40 bg-black/25" onClick={() => setOpen(false)} type="button" />
        <div className="absolute inset-x-0 top-full z-50 border-t border-stone-200 bg-white">
          <div className="container-shell space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input className="pl-10" placeholder="Buscar móveis" />
            </div>
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link className="rounded-2xl px-3 py-3 text-sm hover:bg-stone-50" href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="grid gap-3">
              <Button className="w-full" href="/carrinho" variant="secondary">
                Ver carrinho completo
              </Button>
              <Button className="w-full" href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
