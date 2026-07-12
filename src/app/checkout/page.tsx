import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CheckoutShell } from "@/components/checkout/checkout-shell";

export default function CheckoutPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { href: "/carrinho", label: "Carrinho" }, { label: "Checkout" }]} />
        <CheckoutShell />
      </div>
    </section>
  );
}
