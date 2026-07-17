import { signOutAdmin } from "@/actions/auth";

export function AdminSignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10" type="submit">
        Sair
      </button>
    </form>
  );
}
