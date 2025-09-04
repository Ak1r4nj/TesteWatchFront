"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
  const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setLoggedUser(JSON.parse(savedUser));
    }
  }, []);

  if (loggedUser) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo, {loggedUser.name}!</h1>
        <p>Você está logado com o e-mail: {loggedUser.email}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-customPrimaryDark shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const body = await api.loginUser(email, password);

            if (body.message) {
              setError(body.message ?? "Erro ao fazer login");
            } else {
              const user = body;
              localStorage.setItem("user", JSON.stringify(user));
              setLoggedUser(user);
              router.push("/users");
            }
          } catch (err: any) {
            setError(err.message);
          }
        }}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
