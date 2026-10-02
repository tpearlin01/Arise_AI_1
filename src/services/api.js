import { mockOrderResponse } from "../data/mockOrder";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const parseOrder = async (message) => {
  await delay(1500); // Simulate AI processing time
  // In the future, this will be:
  // const response = await fetch('/api/orders/parse', { method: 'POST', body: JSON.stringify({ message }) });
  // return response.json();
  return { ...mockOrderResponse };
};

export const clarifyOrder = async (orderId, itemId, selectedOption) => {
  await delay(800);
  // In the future:
  // const response = await fetch(`/api/orders/${orderId}/clarify`, { method: 'POST', body: JSON.stringify({ item_id: itemId, selected_option: selectedOption }) });
  
  // For mock: resolve the ambiguous item
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
  
  // Check if all ambiguous items are resolved
  const hasAmbiguous = updatedOrder.items.some(i => i.status === 'AMBIGUOUS');
  if (!hasAmbiguous) {
    updatedOrder.status = 'READY_FOR_CONFIRMATION';
  }

  return updatedOrder;
};

export const confirmOrder = async (orderId) => {
  await delay(1000);
  // In the future:
  // const response = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST', body: JSON.stringify({ confirmed: true }) });
  return { success: true, orderId };
};
