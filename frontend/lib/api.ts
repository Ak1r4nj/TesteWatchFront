export const api = {
  async getUsers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return res.json();
  },

  async loginUser(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async createUser(user: { name: string; email: string; password: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return res.json();
  },

  async updateUser(id: string, user: { name: string; email: string; password?: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  getActivities: async () => fetchJson("/activities", "GET"),
  getActivityById: async (id: string) => fetchJson(`/activities/${id}`, "GET"),
  createActivity: async (data: any) => fetchJson("/activities", "POST", data),
  updateActivity: async (id: string, data: any) =>
    fetchJson(`/activities/${id}`, "PUT", data),
  deleteActivity: async (id: string) =>
    fetchJson(`/activities/${id}`, "DELETE"),
};

async function fetchJson(path: string, method: string, body?: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).message || "Erro na API");
  return res.json();
}
