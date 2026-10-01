import { ArrowUpRight, CheckCircle2, Clock3, PackageCheck, Scale } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const consumerRights = [
  {
    icon: Clock3,
    title: "Arrependimento em compras online",
    description:
      "Você pode desistir da compra em até 7 dias corridos, contados do recebimento do produto. Não é necessário justificar o motivo. O direito também vale para produtos fabricados sob encomenda.",
    detail:
      "A solicitação dentro do prazo dá direito à devolução integral dos valores pagos. Entre em contato para receber as instruções de devolução; a Atlas Móveis organizará a logística reversa sem custo para você."
  },
  {
    icon: PackageCheck,
    title: "Produto com defeito",
    description:
      "Móveis são produtos duráveis. Para defeitos aparentes ou de fácil identificação, o prazo legal para reclamar é de 90 dias a partir do recebimento. Em caso de defeito oculto, a contagem começa quando o problema se tornar evidente.",
    detail:
      "A lei prevê até 30 dias para sanar o defeito. Se ele não for resolvido nesse prazo, você poderá escolher entre a substituição do produto, a restituição do valor pago ou o abatimento proporcional do preço, conforme o CDC."
  },
  {
    icon: Scale,
    title: "Produto em desacordo com a oferta",
    description:
      "As características, medidas, cores e condições informadas no anúncio vinculam a loja. Se o produto entregue estiver diferente do que foi ofertado, entre em contato para registrar a divergência.",
    detail:
      "Nos termos do CDC, você poderá exigir o cumprimento da oferta, aceitar outro produto equivalente ou cancelar a compra com restituição dos valores pagos, conforme a situação."
  },
  {
    icon: CheckCircle2,
    title: "Troca por preferência",
    description:
      "Fora do prazo de arrependimento das compras online, a troca de um produto sem defeito por preferência de cor, modelo ou dimensão não é uma obrigação prevista pelo CDC.",
    detail:
      "Se o produto apresentar defeito, estiver em desacordo com a oferta ou se aplicar o direito de arrependimento, prevalecem os direitos legais descritos nesta política."
  }
];

export default function ExchangePolicyPage() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Quero solicitar atendimento sobre troca, devolução ou defeito em um pedido."
  )}`;

  return (
    <section className="section-space">
      <div className="container-shell space-y-10 sm:space-y-14">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Política de trocas" }]} />

        <header className="max-w-3xl">
          <span className="divider-line" />
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-stone-500">Atendimento e direitos do consumidor</p>
          <h1 className="font-serif text-4xl leading-none text-graphite sm:text-5xl">Política de trocas e devoluções</h1>
          <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
            Esta política resume como solicitar atendimento para compras feitas na Atlas Móveis e respeita os direitos previstos
            no Código de Defesa do Consumidor (Lei nº 8.078/1990).
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          {consumerRights.map(({ icon: Icon, title, description, detail }) => (
            <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 sm:p-7" key={title}>
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <h2 className="font-serif text-2xl leading-tight text-graphite">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{description}</p>
              <p className="mt-3 text-sm leading-7 text-stone-600">{detail}</p>
            </article>
          ))}
        </div>

        <section className="grid gap-8 rounded-[1.75rem] border border-stone-200 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Scale aria-hidden="true" className="size-5 text-stone-600" />
              <h2 className="font-serif text-2xl text-graphite">Como solicitar</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Fale com a nossa equipe informando o número do pedido, o nome usado na compra e o motivo do contato. Se for um
              defeito ou divergência, envie fotos que ajudem a identificar o problema. A equipe responderá com os próximos
              passos e acompanhará o caso.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Guarde a nota fiscal e os registros do atendimento. Nenhuma condição desta política limita os direitos garantidos
              pela legislação de defesa do consumidor.
            </p>
          </div>
          <Button href={whatsappHref} target="_blank">
            Solicitar atendimento
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Button>
        </section>

        <p className="max-w-3xl text-xs leading-6 text-stone-500">
          Referência: artigos 18, 26 e 49 do{" "}
          <a
            className="underline underline-offset-4 hover:text-graphite"
            href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"
            rel="noreferrer"
            target="_blank"
          >
            Código de Defesa do Consumidor
          </a>
          . Esta página apresenta informações gerais e não substitui a análise de situações específicas.
        </p>
      </div>
    </section>
  );
}
