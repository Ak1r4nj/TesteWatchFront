"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="p-3 border rounded shadow flex justify-between">
            <span>{u.name} - {u.email}</span>
            <button
              onClick={() => {
                api.deleteUser(u.id).then(() => {
                  setUsers(users.filter((x) => x.id !== u.id));
                });
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
