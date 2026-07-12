"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkoutSchema, type CheckoutInput } from "@/validations/checkout";
import { useCartStore } from "@/stores/cart-store";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      items,
      customer: {
        fullName: "",
        email: "",
        phone: "",
        document: "",
        postalCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        notes: "",
        acceptedTerms: true
      }
    }
  });

  async function onSubmit(values: CheckoutInput) {
    setSubmitting(true);
    const response = await fetch("/api/checkout/mercado-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, items })
    });

    setSubmitting(false);

    if (!response.ok) {
      form.setError("root", {
        message: "Não foi possível iniciar o checkout. Revise os dados e tente novamente."
      });
      return;
    }

    const data = (await response.json()) as { init_point: string };
    clear();
    router.push(data.init_point || "/pagamento/pendente");
  }

  const fields = form.register;

  return (
    <form className="space-y-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft sm:p-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h2 className="font-serif text-3xl">Dados para entrega e pagamento</h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          O pedido é validado no servidor, com recálculo de preços, estoque e geração segura da preferência de pagamento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Nome completo" {...fields("customer.fullName")} />
        <Input placeholder="E-mail" type="email" {...fields("customer.email")} />
        <Input placeholder="Telefone" {...fields("customer.phone")} />
        <Input placeholder="CPF ou CNPJ" {...fields("customer.document")} />
        <Input placeholder="CEP" {...fields("customer.postalCode")} />
        <Input placeholder="Rua" {...fields("customer.street")} />
        <Input placeholder="Número" {...fields("customer.number")} />
        <Input placeholder="Complemento" {...fields("customer.complement")} />
        <Input placeholder="Bairro" {...fields("customer.neighborhood")} />
        <Input placeholder="Cidade" {...fields("customer.city")} />
        <Input placeholder="UF" maxLength={2} {...fields("customer.state")} />
      </div>

      <Textarea placeholder="Observações do pedido" {...fields("customer.notes")} />

      <label className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
        <input className="mt-1" type="checkbox" {...fields("customer.acceptedTerms")} />
        Li e aceito os termos de uso, política de entrega e política de trocas da Atlas Móveis.
      </label>

      {form.formState.errors.root?.message ? (
        <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
      ) : null}

      <Button className="w-full" disabled={submitting} type="submit">
        {submitting ? "Iniciando pagamento..." : "Ir para o pagamento"}
      </Button>
    </form>
  );
}
