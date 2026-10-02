const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = {
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  parseOrder: async (message) => {
    const res = await fetch(`${API_BASE}/api/orders/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Backend unavailable. Please start the API server.");
    return res.json();
  },
  clarifyOrder: async (orderId, resolutions) => {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/clarify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolutions }),
    });
    if (!res.ok) throw new Error("Failed to submit clarifications");
    return res.json();
  },
  confirmOrder: async (orderId, items = null) => {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: items ? JSON.stringify({ items }) : JSON.stringify({}),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to confirm order");
    }
    return res.json();
  },
  getOrder: async (orderId) => {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
  },
  getRecentOrders: async () => {
    const res = await fetch(`${API_BASE}/api/orders/`);
    if (!res.ok) throw new Error("Failed to fetch recent orders");
    return res.json();
  },
  translateMessage: async (message, targetLanguage) => {
    const res = await fetch(`${API_BASE}/api/orders/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, target_language: targetLanguage }),
    });
    if (!res.ok) throw new Error("Failed to translate");
    return res.json();
  },

  async chatWithAssistant(message) {
    const res = await fetch(`${API_BASE}/api/assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to communicate with assistant");
    }
    return res.json();
  }
};
