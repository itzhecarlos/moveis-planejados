import { redirect } from "next/navigation";

import { CustomerFiscalForm } from "@/components/customer/customer-fiscal-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CustomerSignUpPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/minha-conta");
  }

  return (
    <section className="section-space">
      <div className="container-shell max-w-4xl">
        <CustomerFiscalForm mode="create" />
      </div>
    </section>
  );
}
