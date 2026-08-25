import { redirect } from "next/navigation";

import { CustomerSignInForm } from "@/components/customer/customer-sign-in-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CustomerSignInPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/minha-conta");
  }

  return (
    <section className="section-space">
      <div className="container-shell flex justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-500">Conta</p>
          <h1 className="mt-3 font-serif text-4xl">Entrar na conta</h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Faça login para acessar seus dados fiscais. Se ainda não tiver cadastro, use o link abaixo do formulário.
          </p>
          <CustomerSignInForm />
        </div>
      </div>
    </section>
  );
}
