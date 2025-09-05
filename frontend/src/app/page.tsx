"use client";

import ActivityCard from "./components/ActivityCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState<"mine" | "all">("mine");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (!userJson || !JSON.parse(userJson).id) {
      router.push("/login");
      return;
    }

    const storedUser = JSON.parse(userJson);
    setUser(storedUser);

    const savedFilter = localStorage.getItem("activityFilter");
    if (savedFilter === "all" || savedFilter === "mine") {
      setFilter(savedFilter);
    }

    async function fetchActivities() {
      try {
        const res = await api.getActivities();
        setActivities(res);
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  const handleFilterChange = (newFilter: "mine" | "all") => {
    setFilter(newFilter);
    localStorage.setItem("activityFilter", newFilter);
  };

  const filteredActivities =
    filter === "mine" && user
      ? activities.filter((a) => a.user_ids.includes(user.id))
      : activities;

  const groupedActivities = {
    waiting: filteredActivities.filter((a) => a.progress === 0),
    inProgress: filteredActivities.filter(
      (a) => a.progress > 0 && a.progress < 100
    ),
    done: filteredActivities.filter((a) => a.progress === 100),
  };

  return (
    <div className="min-h-screen p-6 bg-customPrimaryDark">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <div>
            <button
              onClick={() => handleFilterChange("mine")}
              className={`px-3 py-1 rounded-l ${
                filter === "mine" ? "bg-customPrimaryDark text-white" : "bg-gray-900"
              }`}
            >
              Minhas Tarefas
            </button>
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-r ${
                filter === "all" ? "bg-customPrimaryDark text-white" : "bg-gray-900"
              }`}
            >
              Todas
            </button>
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
          >
            Perfil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-300">
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-2">Em Espera</h2>
          {groupedActivities.waiting.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>

        <div className="px-4">
          <h2 className="text-lg font-semibold mb-2">Em Andamento</h2>
          {groupedActivities.inProgress.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-2">Concluído</h2>
          {groupedActivities.done.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/activities/new")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
}