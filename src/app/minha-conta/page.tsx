import { CustomerFiscalForm } from "@/components/customer/customer-fiscal-form";
import { CustomerSignOutButton } from "@/components/customer/customer-sign-out-button";
import { requireCustomerAccount } from "@/lib/customer-account";

export default async function CustomerAccountPage() {
  const { profile, user } = await requireCustomerAccount();

  return (
    <section className="section-space">
      <div className="container-shell max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Área do cliente</p>
            <h1 className="mt-2 font-serif text-4xl">Dados para nota fiscal</h1>
          </div>
          <CustomerSignOutButton />
        </div>
        <CustomerFiscalForm accountEmail={user.email || ""} mode="edit" profile={profile} />
      </div>
    </section>
  );
}
