import Link from "next/link";

import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { requireAdminAccess } from "@/lib/auth";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/auditoria", label: "Auditoria" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdminAccess();

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-stone-200 bg-graphite px-6 py-8 text-stone-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.45em] text-stone-500">Atlas Móveis</p>
              <h1 className="mt-3 font-serif text-3xl">Painel</h1>
              <p className="mt-3 text-sm text-stone-400">{profile.full_name || "Administrador"}</p>
            </div>
            <AdminSignOutButton />
          </div>
          <nav className="mt-10 grid gap-2">
            {adminLinks.map((link) => (
              <Link className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
