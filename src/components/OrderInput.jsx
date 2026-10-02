import React, { useState } from 'react';
import { Send } from 'lucide-react';
import VoiceInput from './VoiceInput';

export default function OrderInput({ onProcessOrder, isProcessing }) {
  const [message, setMessage] = useState("bhaiya 2 kilo atta, ek Amul butter aur sugar half kilo, tel bhi chahiye");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onProcessOrder(message);
    }
  };

  const handleTranscription = (text) => {
    setMessage(prev => (prev + ' ' + text).trim());
  };

  return (
    <div className="panel animate-fade-in">
      <h2>Customer Order</h2>
      <p className="text-muted mb-4">Type or speak the customer's order in Hinglish, Hindi or English.</p>
      
      <form onSubmit={handleSubmit} className="input-group">
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type the order message here..."
          disabled={isProcessing}
        />
        <div className="flex gap-4 mt-2">
          <VoiceInput onTranscription={handleTranscription} />
          
          <button 
            type="submit" 
            className="btn btn-primary flex-1"
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
        </div>
      </form>
    </div>
  );
}
