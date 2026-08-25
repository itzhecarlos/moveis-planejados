import { signOutCustomer } from "@/actions/customer-auth";

export function CustomerSignOutButton() {
  return (
    <form action={signOutCustomer}>
      <button className="rounded-full border border-stone-300 px-5 py-3 text-sm text-graphite transition hover:border-graphite" type="submit">
        Sair da conta
      </button>
    </form>
  );
}
