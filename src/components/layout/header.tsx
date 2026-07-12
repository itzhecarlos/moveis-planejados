"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { navLinks, siteConfig } from "@/lib/site";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((state) => state.count());

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
          <Link className="relative rounded-full border border-stone-200 p-3 hover:border-stone-300" href="/carrinho">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-graphite text-[10px] text-white">
              {count}
            </span>
          </Link>
        </div>

        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex rounded-full border border-stone-200 p-3 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className={cn("border-t border-stone-200 bg-white lg:hidden", open ? "block" : "hidden")}>
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
          <div className="flex items-center gap-3">
            <Button className="flex-1" href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" variant="secondary">
              WhatsApp
            </Button>
            <Button className="flex-1" href="/carrinho">
              Carrinho ({count})
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
