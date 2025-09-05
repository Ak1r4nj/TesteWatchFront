"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setName(parsed.name);
      setEmail(parsed.email);
    }
  }, [router]);

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateUser(user.id, { name, email, password });
      
      localStorage.setItem("user", JSON.stringify(updated));
      alert("Perfil atualizado com sucesso!");

      router.push("/");
    } catch (err: any) {
      alert("Erro ao atualizar perfil: " + err.message);
    }
  };

  const handleDelete = async () => {
  try {
    await api.deleteUser(user.id);
    localStorage.clear();
    alert("Conta deletada com sucesso.");
    router.push("/login");
  } catch (err: any) {
    alert("Erro ao deletar perfil: " + err.message);
  } finally {
    setIsDeleteModalOpen(false);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customPrimaryDark">
      <div className="bg-customPrimaryDark shadow-md rounded-lg p-6 w-full max-w-md shadow-md rounded-lg p-6 w-full max-w-md
                  border-2 border-white">
        <h1 className="text-xl font-bold mb-4">Meu Perfil</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded mt-1"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded mt-1"
              placeholder="Seu e-mail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded mt-1"
              placeholder="Digite sua senha para confirmar"
              required 
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Atualizar Perfil
          </button>
        </form>

        <div className="mt-4 flex flex-col space-y-2">
            <button
                onClick={handleLogout}
                className="w-full bg-gray-500 text-white py-3 rounded hover:bg-gray-600"
            >
                Sair (Logout)
            </button>
        </div>
      </div>
    </div>
  );
}