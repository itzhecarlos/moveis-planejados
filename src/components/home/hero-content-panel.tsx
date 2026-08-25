import { Button } from "@/components/ui/button";

export function HeroContentPanel() {
  return (
    <div className="mx-auto flex h-full min-h-[620px] w-full max-w-[560px] flex-col px-8 py-12 sm:min-h-[650px] sm:px-10 sm:py-12 lg:min-h-full lg:px-12 lg:py-12 xl:px-14">
      <div className="flex h-full min-h-0 flex-col">
        <span className="divider-line" />
        <h1 className="max-w-[9.2ch] pt-3 font-serif text-[2.25rem] leading-[0.96] tracking-normal sm:text-[3.05rem] md:text-[3.45rem] lg:max-w-[8.6ch] lg:text-[4.05rem] xl:text-[4.35rem]">
          Design que organiza. Qualidade que permanece.
        </h1>

        <p className="mt-6 max-w-[35ch] text-[14px] leading-7 text-stone-700 sm:text-[15px] lg:mt-7 lg:max-w-[35ch] lg:text-[0.95rem] lg:leading-8">
          Criados-mudos em MDF de alta qualidade, com acabamentos impecáveis, desenhados para transformar o quarto com
          calma, organização e elegância.
        </p>

        <div className="mt-8 flex flex-col gap-3 pb-10 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:pb-12 lg:mt-9 lg:gap-4 lg:pb-16 xl:pb-20">
          <Button className="w-full sm:w-auto" href="/categoria/criados-mudos" size="lg">
            Conheça a coleção
          </Button>
        </div>
      </div>
    </div>
  );
}
