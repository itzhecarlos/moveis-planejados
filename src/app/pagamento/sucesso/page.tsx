import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export default function PaymentSuccessPage() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-soft">
          <SectionHeading
            align="center"
            description="Recebemos a confirmação do pagamento e enviaremos os próximos passos por e-mail."
            title="Pagamento aprovado"
          />
          <div className="mt-8">
            <Button href="/produtos">Voltar ao catálogo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
