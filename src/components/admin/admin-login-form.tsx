"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { signInAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      const result = await signInAdmin({ email, password });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
      <Input onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" type="email" value={email} />
      <Input onChange={(event) => setPassword(event.target.value)} placeholder="Senha" type="password" value={password} />
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <Button disabled={pending} type="submit">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
