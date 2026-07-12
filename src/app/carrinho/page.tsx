import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CartPage } from "@/components/cart/cart-page";

export default function CartRoutePage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Carrinho" }]} />
        <CartPage />
      </div>
    </section>
  );
}
