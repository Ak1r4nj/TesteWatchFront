"use client";

import { useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const body = await api.createUser({ name, email, password });

      if (body.message) {
        setError(body?.message || "Erro ao criar usuário");
        return;
      }

      localStorage.setItem("user", JSON.stringify(body));
      setLoggedUser(body);
      console.log("✅ Usuário criado:", body);
      router.push("/users");
    } catch (err) {
      console.error("Failed to create user", err);
      setError(String(err));
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-customPrimaryLight shadow p-6 rounded w-96 space-y-4"
      >
        <h1 className="text-customPrimaryDark font-bold">Cadastro</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="w-full border p-2 rounded"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
