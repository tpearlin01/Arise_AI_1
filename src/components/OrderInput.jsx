import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function OrderInput({ onProcessOrder, isProcessing }) {
  const [message, setMessage] = useState("bhaiya 2 kilo atta, ek Amul butter aur sugar half kilo, tel bhi chahiye");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onProcessOrder(message);
    }
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Customer Order</h2>
      <p className="text-muted mb-4">Enter the customer's message in Hinglish, Hindi or English.</p>
      
      <form onSubmit={handleSubmit} className="input-group">
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type the order message here..."
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className="btn btn-primary mt-2 w-full"
          disabled={isProcessing || !message.trim()}
        >
          {isProcessing ? (
            <>
              <span className="spinner" style={{width: 16, height: 16, borderWidth: 2}}></span>
              Processing...
            </>
          ) : (
            <>
              <Send size={18} />
              Process Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}
