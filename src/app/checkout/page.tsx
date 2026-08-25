import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getCustomerProfile } from "@/lib/customer-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const profile = user ? await getCustomerProfile(user.id) : null;

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { href: "/carrinho", label: "Carrinho" }, { label: "Checkout" }]} />
        <CheckoutShell
          initialCustomer={
            profile
              ? {
                  fullName: profile.full_name,
                  email: profile.email,
                  phone: profile.phone,
                  document: profile.document_number,
                  postalCode: profile.postal_code,
                  street: profile.street,
                  number: profile.number,
                  complement: profile.complement || "",
                  neighborhood: profile.neighborhood,
                  city: profile.city,
                  state: profile.state,
                  notes: profile.notes || "",
                  acceptedTerms: true
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}
