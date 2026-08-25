"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signUpCustomer, updateCustomerFiscalProfile } from "@/actions/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerProfileRow } from "@/lib/customer-account";
import type { CustomerFiscalProfileInput } from "@/validations/customer-account";

type CustomerFiscalFormProps = {
  accountEmail?: string;
  mode: "create" | "edit";
  profile?: CustomerProfileRow | null;
};

type FormState = CustomerFiscalProfileInput & {
  password: string;
};

const emptyState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  documentType: "cpf",
  documentNumber: "",
  isCompany: false,
  legalName: "",
  tradeName: "",
  stateRegistration: "",
  municipalRegistration: "",
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  notes: "",
  fiscalConsent: true,
  password: ""
};

export function CustomerFiscalForm({ accountEmail, mode, profile }: CustomerFiscalFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<FormState>(() => profileToState(profile, accountEmail));

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      const result =
        mode === "create"
          ? await signUpCustomer(form)
          : await updateCustomerFiscalProfile({
              ...form,
              fiscalConsent: form.fiscalConsent
            });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      setMessage(result.message);

      if (mode === "create") {
        router.replace("/minha-conta");
        router.refresh();
      }
    });
  }

  return (
    <form className="grid gap-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Dados fiscais</p>
        <h1 className="mt-3 font-serif text-4xl">{mode === "create" ? "Criar conta" : "Minha conta"}</h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Esses dados serão usados para cadastro, entrega e emissão fiscal dos pedidos realizados na Atlas Móveis.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Nome completo" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
        <Input
          disabled={mode === "edit"}
          placeholder="E-mail"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        {mode === "create" ? (
          <Input
            autoComplete="new-password"
            placeholder="Senha"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        ) : null}
        <Input placeholder="Telefone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />

        <select
          className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-graphite shadow-sm"
          value={form.documentType}
          onChange={(event) => {
            const documentType = event.target.value as "cpf" | "cnpj";
            updateField("documentType", documentType);
            updateField("isCompany", documentType === "cnpj");
          }}
        >
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
        </select>
        <Input
          placeholder={form.documentType === "cnpj" ? "CNPJ" : "CPF"}
          value={form.documentNumber}
          onChange={(event) => updateField("documentNumber", event.target.value)}
        />
        {form.documentType === "cnpj" ? (
          <>
            <Input placeholder="Razão social" value={form.legalName} onChange={(event) => updateField("legalName", event.target.value)} />
            <Input placeholder="Nome fantasia" value={form.tradeName} onChange={(event) => updateField("tradeName", event.target.value)} />
            <Input
              placeholder="Inscrição estadual"
              value={form.stateRegistration}
              onChange={(event) => updateField("stateRegistration", event.target.value)}
            />
            <Input
              placeholder="Inscrição municipal"
              value={form.municipalRegistration}
              onChange={(event) => updateField("municipalRegistration", event.target.value)}
            />
          </>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="CEP" value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} />
        <Input placeholder="Rua" value={form.street} onChange={(event) => updateField("street", event.target.value)} />
        <Input placeholder="Número" value={form.number} onChange={(event) => updateField("number", event.target.value)} />
        <Input placeholder="Complemento" value={form.complement} onChange={(event) => updateField("complement", event.target.value)} />
        <Input placeholder="Bairro" value={form.neighborhood} onChange={(event) => updateField("neighborhood", event.target.value)} />
        <Input placeholder="Cidade" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
        <Input
          maxLength={2}
          placeholder="UF"
          value={form.state}
          onChange={(event) => updateField("state", event.target.value.toUpperCase().slice(0, 2))}
        />
      </div>

      <Textarea placeholder="Observações fiscais ou de entrega" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />

      <label className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-600">
        <input
          checked={form.fiscalConsent}
          className="mt-1"
          onChange={(event) => updateField("fiscalConsent", event.target.checked)}
          type="checkbox"
        />
        Autorizo o uso desses dados para cadastro, entrega, processamento do pedido e emissão fiscal.
      </label>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}

      <Button disabled={pending} type="submit">
        {pending ? "Salvando..." : mode === "create" ? "Criar conta" : "Salvar dados"}
      </Button>
    </form>
  );
}

function profileToState(profile?: CustomerProfileRow | null, accountEmail?: string): FormState {
  if (!profile) {
    return {
      ...emptyState,
      email: accountEmail || ""
    };
  }

  return {
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    documentType: profile.document_type,
    documentNumber: profile.document_number,
    isCompany: profile.is_company,
    legalName: profile.legal_name || "",
    tradeName: profile.trade_name || "",
    stateRegistration: profile.state_registration || "",
    municipalRegistration: profile.municipal_registration || "",
    postalCode: profile.postal_code,
    street: profile.street,
    number: profile.number,
    complement: profile.complement || "",
    neighborhood: profile.neighborhood,
    city: profile.city,
    state: profile.state,
    notes: profile.notes || "",
    fiscalConsent: profile.fiscal_consent,
    password: ""
  };
}
