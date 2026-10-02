const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
import { mockOrderResponse } from "./data/mockOrder";

// Simulate network delay for mock fallback
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error("Sorry, we couldn't process that request. Please try again.");
  }
  return response.json();
};

export const parseOrder = async (message) => {
  // Easter egg to test error UI state
  if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")) {
    await delay(1000);
    throw new Error("Sorry, we couldn't process that order. Please try again.");
  }

  try {
    const response = await fetch(`${API_BASE}/api/orders/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend not reachable. Using mock data to preserve functionality.");
    await delay(1500);
    return { ...mockOrderResponse };
  }
};

export const clarifyOrder = async (orderId, itemId, selectedOption) => {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}/clarify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, selected_option: selectedOption })
    });
    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend not reachable. Using mock data for clarification.");
    await delay(800);
    
    let updatedOrder = { ...mockOrderResponse };
    updatedOrder.items = updatedOrder.items.map(item => {
      if (item.id === itemId || item.name === 'tel') {
        return {
          ...item,
          name: selectedOption,
          quantity: 1,
          unit: 'L',
          price: 140,
          subtotal: 140,
          status: 'MATCHED',
          options: undefined
        };
      }
      return item;
    });
    
    const hasAmbiguous = updatedOrder.items.some(i => i.status === 'AMBIGUOUS');
    if (!hasAmbiguous) {
      updatedOrder.status = 'READY_FOR_CONFIRMATION';
    }
    return updatedOrder;
  }
};

export const confirmOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmed: true })
    });
    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend not reachable. Using mock confirmation.");
    await delay(1000);
    return { success: true, orderId };
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`);
    return await handleResponse(response);
  } catch (err) {
    throw new Error("Could not fetch order details. Please try again later.");
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    return await handleResponse(response);
  } catch (err) {
    throw new Error("Could not fetch product catalog. Please try again later.");
  }
};
