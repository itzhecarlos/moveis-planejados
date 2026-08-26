import { getAdminAuditLogs } from "@/lib/admin-data";

export default async function AdminAuditPage() {
  const logs = await getAdminAuditLogs();
  return <div className="space-y-8"><div><p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Auditoria</p><h1 className="mt-2 font-serif text-4xl">Auditoria</h1></div><div className="rounded-[1.75rem] border border-stone-200 bg-white p-6"><ul className="space-y-4 text-sm text-stone-600">
    {logs.map((log) => <li key={log.id}><strong>{log.action}</strong> em {log.entity_type}{log.entity_id ? ` (${log.entity_id})` : ""} · {(log.profiles as { full_name?: string } | null)?.full_name || "Sistema"} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(log.created_at))}</li>)}
    {logs.length === 0 ? <li>Nenhum evento de auditoria registrado ainda.</li> : null}
  </ul></div></div>;
}
