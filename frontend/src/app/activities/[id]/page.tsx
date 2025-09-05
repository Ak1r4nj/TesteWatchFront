"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../lib/api";

export default function EditActivityPage() {
  const [activity, setActivity] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const act = await api.getActivityById(params.id as string);
        setActivity(act);
        console.log("Atividade carregada:", act);
        const allUsers = await api.getUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar atividade");
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateActivity(activity.id, activity);
      console.log("✅ Atividade atualizada:", res);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar atividade");
    }
  };

  if (!activity) return <p className="p-6">Carregando...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-customPrimaryDark">
      <div className="bg-customPrimaryDark shadow-md rounded-lg p-6 w-full max-w-md shadow-md rounded-lg p-6 w-full max-w-md
                  border-2 border-white">
        <h1 className="text-xl font-bold mb-4">Editar Atividade</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={activity.name}
            onChange={(e) => setActivity({ ...activity, name: e.target.value })}
            className="w-full p-3 border rounded"
            placeholder="Nome da atividade"
            required
          />

          <input
            type="text"
            value={activity.category}
            onChange={(e) =>
              setActivity({ ...activity, category: e.target.value })
            }
            className="w-full p-3 border rounded"
            placeholder="Categoria"
          />

          <input
            type="number"
            value={activity.progress}
            onChange={(e) =>
              setActivity({ ...activity, progress: Number(e.target.value) })
            }
            className="w-full p-3 border rounded"
            placeholder="Progresso (0-100)"
            min={0}
            max={100}
          />

          <div>
            <label className="block mb-2 font-medium">Atribuir Usuários</label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => {
                    const already = activity.user_ids.includes(u.id);
                    setActivity({
                      ...activity,
                      user_ids: already
                        ? activity.user_ids.filter((id: string) => id !== u.id)
                        : [...activity.user_ids, u.id],
                    });
                  }}
                  className={`px-3 py-1 rounded border ${
                    activity.user_ids.includes(u.id)
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
            className="w-full bg-green-800 text-white py-3 rounded hover:bg-green-600"
          >
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full mt-4 bg-gray-400 text-white py-3 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
