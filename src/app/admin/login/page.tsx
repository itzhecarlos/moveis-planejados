import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.32em] text-stone-500">Admin</p>
        <h1 className="mt-3 font-serif text-4xl">Entrar no painel</h1>
        <form className="mt-8 grid gap-4">
          <Input placeholder="E-mail" type="email" />
          <Input placeholder="Senha" type="password" />
          <Button type="submit">Entrar</Button>
        </form>
      </div>
    </div>
  );
}
