import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export default function PaymentFailurePage() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-soft">
          <SectionHeading
            align="center"
            description="O pagamento não foi concluído. Você pode revisar seus dados e tentar novamente."
            title="Pagamento não concluído"
          />
          <div className="mt-8">
            <Button href="/checkout">Tentar novamente</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
