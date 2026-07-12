import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export default function PaymentPendingPage() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-soft">
          <SectionHeading
            align="center"
            description="Seu pedido foi criado e aguarda a confirmação do pagamento pelo Mercado Pago."
            title="Pagamento pendente"
          />
          <div className="mt-8">
            <Button href="/contato" variant="secondary">
              Falar com a equipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
