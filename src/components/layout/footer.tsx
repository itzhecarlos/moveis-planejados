import Link from "next/link";
import { Globe, Instagram, Mail, MessageCircle } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-graphite text-stone-200">
      <div className="container-shell grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo className="text-white [&_span:last-child]:text-stone-400" />
          <p className="max-w-md text-sm leading-7 text-stone-300">{siteConfig.slogan}</p>
        </div>

        <div className="grid gap-3 text-sm">
          {navLinks.map((link) => (
            <Link className="hover:text-white" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="hover:text-white" href="/politica-de-privacidade">
            Política de privacidade
          </Link>
          <Link className="hover:text-white" href="/termos-de-uso">
            Termos de uso
          </Link>
          <Link className="hover:text-white" href="/politica-de-entrega">
            Política de entrega
          </Link>
          <Link className="hover:text-white" href="/politica-de-trocas">
            Política de trocas
          </Link>
        </div>

        <div className="space-y-4 text-sm text-stone-300">
          <p className="flex items-center gap-3">
            <Instagram className="size-4" /> {siteConfig.instagram}
          </p>
          <p className="flex items-center gap-3">
            <MessageCircle className="size-4" /> WhatsApp comercial
          </p>
          <p className="flex items-center gap-3">
            <Mail className="size-4" /> {siteConfig.email}
          </p>
          <p className="flex items-center gap-3">
            <Globe className="size-4" /> {siteConfig.url.replace(/^https?:\/\//, "")}
          </p>
          <p className="pt-4 text-xs uppercase tracking-[0.24em] text-stone-500">
            Uma marca brasileira criada para valorizar os detalhes que tornam sua casa única.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Atlas Móveis. Todos os direitos reservados.
      </div>
    </footer>
  );
}
