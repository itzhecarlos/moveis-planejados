"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signInCustomer } from "@/actions/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CustomerSignInForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      const result = await signInCustomer({ email, password });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      router.replace("/minha-conta");
      router.refresh();
    });
  }

  return (
    <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
      <Input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" type="email" value={email} />
      <Input
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Senha"
        type="password"
        value={password}
      />
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <Button disabled={pending} type="submit">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-center text-sm text-stone-600">
        Ainda não tem conta?{" "}
        <Link className="font-semibold text-graphite underline" href="/criar-conta">
          Criar cadastro
        </Link>
      </p>
    </form>
  );
}
