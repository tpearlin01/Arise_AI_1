import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

export default function ClarificationPanel({ orderId, clarificationText, ambiguousItems, onOptionSelected, isResolving }) {
  // If no items need clarification, don't render the panel
  if (!ambiguousItems || ambiguousItems.length === 0) return null;

  const itemToClarify = ambiguousItems[0];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleConfirm = () => {
    if (selectedOption) {
      onOptionSelected(orderId, itemToClarify.id, selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div className="panel animate-fade-in" style={{ borderLeft: '4px solid var(--warning)' }}>
      <h2>
        <HelpCircle size={20} color="var(--warning)" />
        Action Required
      </h2>
      <p className="mb-4">
        <span className="font-bold">"{itemToClarify.name}"</span> is ambiguous. <br/>
        <span className="text-muted">{clarificationText || 'Please clarify the item.'}</span>
      </p>

      {itemToClarify.options && itemToClarify.options.length > 0 && (
        <div className="options-grid">
          {itemToClarify.options.map(option => (
            <div 
              key={option}
              className={`option-card ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
              {selectedOption === option && <Check size={16} style={{ float: 'right' }} />}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <button 
          className="btn btn-primary flex-1"
          disabled={!selectedOption || isResolving}
          onClick={handleConfirm}
        >
          {isResolving ? 'Resolving...' : 'Update Order'}
        </button>
      </div>

      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Or type a custom clarification:</p>
        <div className="flex gap-2">
          <input type="text" placeholder="Customer clarification..." className="flex-1" />
          <button className="btn btn-secondary">Submit</button>
        </div>
      </div>
    </div>
  );
}
