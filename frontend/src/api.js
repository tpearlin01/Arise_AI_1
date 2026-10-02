import { mockOrderData } from './mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const parseOrder = async (orderText) => {
  await delay(1500); // Simulate network delay
  return { ...mockOrderData };
};

export const clarifyOrder = async (orderId, updates) => {
  await delay(1000);
  // Reconstruct mock data with the clarified option
  // In reality, backend will re-parse and match. We mock it here.
  const updatedItems = mockOrderData.items.map(item => {
    if (item.status === 'AMBIGUOUS' && updates[item.name]) {
      const selectedOption = updates[item.name];
      // Mocking prices and quantities for the selected oil
      const isSunflower = selectedOption === 'Sunflower Oil';
      const isGroundnut = selectedOption === 'Groundnut Oil';
      const price = isSunflower ? 140 : isGroundnut ? 160 : 130;
      
      return {
        ...item,
        name: selectedOption,
        quantity: 1,
        unit: 'L',
        price,
        subtotal: price,
        status: 'MATCHED',
        options: undefined
      };
    }
    return item;
  });

  return {
    ...mockOrderData,
    status: 'READY_TO_CONFIRM',
    items: updatedItems,
    clarification: null
  };
};

export const confirmOrder = async (orderId) => {
  await delay(1500);
  return {
    success: true,
    orderId,
    message: "Order Confirmed"
  };
};
