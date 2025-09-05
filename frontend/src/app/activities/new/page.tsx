"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

export default function NewActivityPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.getUsers();
        setUsers(res);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    }
    fetchUsers();
  }, []);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Criando atividade com:", { name, category, progress, user_ids: selectedUsers });
    try {
      const res = await api.createActivity({
        name,
        category,
        progress,
        user_ids: selectedUsers,
      });

      console.log("✅ Atividade criada:", res);

      router.push("/"); 
    } catch (err: any) {
      console.error("❌ Erro ao criar atividade:", err);
      setError(err.message || "Erro ao criar atividade");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customPrimaryDark">
      <div className="bg-customPrimaryDark shadow-md rounded-lg p-6 w-full max-w-md shadow-md rounded-lg p-6 w-full max-w-md
                  border-2 border-white">
        <h1 className="text-xl font-bold mb-4">Nova Atividade</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Nome da atividade"
            required
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Categoria"
          />

        <p>Progresso (Porcentagem):</p>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full p-3 border rounded"
            placeholder="Progresso (0-100)"
            min={0}
            max={100}
            required
          />

          <div>
            <label className="block mb-2 font-medium">Atribuir Usuários</label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => {
                    const already = selectedUsers.includes(u.id);
                    toggleUserSelection(u.id);
                  }}
                  className={`px-3 py-1 rounded border ${
                    selectedUsers.includes(u.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Criar Atividade
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-gray-400 text-white py-3 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
