export const mockOrderResponse = {
  order_id: "ORD-1001",
  status: "NEEDS_CLARIFICATION",
  items: [
    {
      id: "item-1",
      name: "Aashirvaad Atta",
      quantity: 2,
      unit: "kg",
      price: 65,
      subtotal: 130,
      status: "MATCHED"
    },
    {
      id: "item-2",
      name: "Amul Butter",
      quantity: 1,
      unit: "packet",
      price: 60,
      subtotal: 60,
      status: "MATCHED"
    },
    {
      id: "item-3",
      name: "Sugar",
      quantity: 0.5,
      unit: "kg",
      price: 48,
      subtotal: 24,
      status: "MATCHED"
    },
    {
      id: "item-4",
      name: "tel",
      quantity: null,
      unit: null,
      price: null,
      subtotal: null,
      status: "AMBIGUOUS",
      options: [
        "Sunflower Oil",
        "Groundnut Oil",
        "Mustard Oil"
      ]
    }
  ],
  clarification: "Which oil would you like: sunflower, groundnut or mustard?"
};
