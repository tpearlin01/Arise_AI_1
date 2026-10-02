import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  PackageCheck, 
  AlertCircle,
  FileText,
  Truck,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { parseOrder, clarifyOrder, confirmOrder } from './api';
import './index.css';

const Header = () => (
  <header className="app-header">
    <div className="container header-content">
      <div className="logo-section">
        <Bot size={32} className="logo-icon" />
        <div>
          <h1 className="logo-title">DukaanAI</h1>
          <p className="logo-subtitle">AI-Powered Hinglish Order Desk</p>
        </div>
      </div>
      <div className="badge badge-matched flex items-center gap-2">
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success-color)' }}></div>
        System Online
      </div>
    </div>
  </header>
);

const OrderInput = ({ onProcess, isProcessing }) => {
  const [text, setText] = useState('');
  
  const handleExample = () => {
    setText("bhaiya 2 kilo atta, ek Amul butter aur sugar half kilo, tel bhi chahiye");
  };

  return (
    <div className="card">
      <h2 className="flex items-center gap-2">
        <Sparkles size={24} className="logo-icon" />
        Customer Order
      </h2>
      <div className="textarea-wrapper">
        <textarea
          className="order-textarea"
          placeholder="Enter Hinglish order here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />
        <div className="textarea-hint flex justify-between">
          <span>Try an <span className="example-order" onClick={handleExample}>example order</span></span>
          <span>{text.length} chars</span>
        </div>
      </div>
      <div className="flex justify-end" style={{ marginTop: '1rem' }}>
        <button 
          className="btn btn-primary"
          onClick={() => onProcess(text)}
          disabled={!text.trim() || isProcessing}
        >
          {isProcessing ? <Loader2 size={18} className="spinner" /> : <RefreshCw size={18} />}
          Process Order
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'MATCHED') {
    return <span className="badge badge-matched flex items-center gap-2"><CheckCircle2 size={12}/> Matched</span>;
  }
  if (status === 'AMBIGUOUS' || status === 'NEEDS_CLARIFICATION') {
    return <span className="badge badge-ambiguous flex items-center gap-2"><AlertCircle size={12}/> Ambiguous</span>;
  }
  if (status === 'OUT_OF_STOCK') {
    return <span className="badge badge-error">Out of Stock</span>;
  }
  return <span className="badge">{status}</span>;
};

const ClarificationPanel = ({ clarification, options, onSelect, selectedOption, itemRef }) => {
  if (!clarification) return null;
  return (
    <div className="clarification-panel">
      <div className="clarification-header">
        <AlertCircle size={20} />
        <span>Action Needed: {clarification}</span>
      </div>
      <div className="clarification-options">
        {options.map((opt) => (
          <button
            key={opt}
            className={`btn btn-outline ${selectedOption === opt ? 'active' : ''}`}
            onClick={() => onSelect(itemRef, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const OrderAnalysis = ({ order, onClarify, isClarifying }) => {
  const [clarifications, setClarifications] = useState({});

  const handleSelectOption = (itemRef, option) => {
    setClarifications(prev => ({ ...prev, [itemRef]: option }));
  };

  const submitClarification = () => {
    onClarify(order.order_id, clarifications);
  };

  const hasPendingClarification = order.items.some(
    (item) => item.status === 'AMBIGUOUS' && !clarifications[item.name]
  );
  
  const isAmbiguousState = order.status === 'NEEDS_CLARIFICATION';

  return (
    <div className="card">
      <h2 className="flex items-center gap-2">
        <PackageCheck size={24} style={{ color: 'var(--success-color)' }} />
        AI Order Analysis
      </h2>
      <div className="item-list">
        {order.items.map((item, idx) => (
          <div key={idx} className="item-row">
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-meta">
                {item.quantity ? `${item.quantity} ${item.unit}` : 'Quantity unspecified'} 
                {item.price ? ` • ₹${item.price}/${item.unit}` : ''}
              </span>
            </div>
            <div>
              <StatusBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>

      {isAmbiguousState && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="clarification-panel">
            <div className="clarification-header">
              <AlertCircle size={20} />
              <span>Clarification Needed: {order.clarification}</span>
            </div>
            
            {order.items
              .filter(item => item.status === 'AMBIGUOUS')
              .map(item => (
                <div key={item.name} className="clarification-options">
                  {item.options.map(opt => (
                    <button
                      key={opt}
                      className={`btn btn-outline ${clarifications[item.name] === opt ? 'active' : ''}`}
                      onClick={() => handleSelectOption(item.name, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ))}
          </div>
          <div className="flex justify-end" style={{ marginTop: '1.5rem' }}>
            <button 
              className="btn btn-primary"
              disabled={hasPendingClarification || isClarifying}
              onClick={submitClarification}
            >
              {isClarifying ? <Loader2 size={18} className="spinner" /> : <ChevronRight size={18} />}
              Update Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderSummary = ({ order, onConfirm, isConfirming }) => {
  const total = order.items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  
  return (
    <div className="card">
      <h2 className="flex items-center gap-2">
        <FileText size={24} style={{ color: 'var(--primary-color)' }} />
        Order Summary
      </h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th style={{ textAlign: 'right' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity} {item.unit}</td>
              <td style={{ textAlign: 'right' }}>₹{item.subtotal}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" className="summary-total">Total</td>
            <td className="summary-total" style={{ textAlign: 'right' }}>₹{total}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end" style={{ marginTop: '1.5rem' }}>
        <button 
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center' }}
          onClick={() => onConfirm(order.order_id)}
          disabled={isConfirming}
        >
          {isConfirming ? <Loader2 size={18} className="spinner" /> : <CheckCircle2 size={18} />}
          Confirm Order
        </button>
      </div>
    </div>
  );
};

const SuccessView = ({ orderId, onReset }) => (
  <div className="card success-state">
    <div className="success-icon-wrapper">
      <CheckCircle2 size={32} />
    </div>
    <h2 style={{ marginBottom: '0.5rem' }}>Order Confirmed!</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Order ID: {orderId}</p>
    
    <div className="flex gap-4 w-full justify-center">
      <button className="btn btn-outline" style={{ flex: 1 }}>
        <FileText size={18} />
        View Bill
      </button>
      <button className="btn btn-outline" style={{ flex: 1 }}>
        <Truck size={18} />
        Delivery Note
      </button>
    </div>
    
    <button 
      className="btn btn-primary" 
      style={{ marginTop: '2rem' }}
      onClick={onReset}
    >
      Process Another Order
    </button>
  </div>
);

const EmptyState = () => (
  <div className="card empty-state">
    <PackageCheck size={48} strokeWidth={1} />
    <h3>No order selected</h3>
    <p>Enter a Hinglish order text and process it to see the AI analysis.</p>
  </div>
);

export default function App() {
  const [orderState, setOrderState] = useState({
    status: 'IDLE', // IDLE, PROCESSING, CLARIFYING, CONFIRMING, SUCCESS, ERROR
    orderData: null,
    confirmedOrderId: null,
    error: null
  });

  const handleProcess = async (text) => {
    setOrderState({ ...orderState, status: 'PROCESSING', error: null });
    try {
      const data = await parseOrder(text);
      setOrderState({ status: 'ANALYZED', orderData: data, error: null });
    } catch (err) {
      setOrderState({ ...orderState, status: 'ERROR', error: "Failed to parse order" });
    }
  };

  const handleClarify = async (orderId, updates) => {
    setOrderState({ ...orderState, status: 'CLARIFYING', error: null });
    try {
      const data = await clarifyOrder(orderId, updates);
      setOrderState({ status: 'ANALYZED', orderData: data, error: null });
    } catch (err) {
      setOrderState({ ...orderState, status: 'ERROR', error: "Failed to clarify order" });
    }
  };

  const handleConfirm = async (orderId) => {
    setOrderState({ ...orderState, status: 'CONFIRMING', error: null });
    try {
      const res = await confirmOrder(orderId);
      setOrderState({ status: 'SUCCESS', orderData: null, confirmedOrderId: res.orderId, error: null });
    } catch (err) {
      setOrderState({ ...orderState, status: 'ERROR', error: "Failed to confirm order" });
    }
  };

  const reset = () => {
    setOrderState({ status: 'IDLE', orderData: null, confirmedOrderId: null, error: null });
  };

  return (
    <>
      <Header />
      <main className="container main-content">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <OrderInput 
              onProcess={handleProcess} 
              isProcessing={orderState.status === 'PROCESSING'} 
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {orderState.status === 'IDLE' && <EmptyState />}
            
            {(orderState.status === 'ANALYZED' || orderState.status === 'CLARIFYING' || orderState.status === 'CONFIRMING') && orderState.orderData && (
              <>
                <OrderAnalysis 
                  order={orderState.orderData} 
                  onClarify={handleClarify}
                  isClarifying={orderState.status === 'CLARIFYING'}
                />
                
                {orderState.orderData.status === 'READY_TO_CONFIRM' && (
                  <OrderSummary 
                    order={orderState.orderData}
                    onConfirm={handleConfirm}
                    isConfirming={orderState.status === 'CONFIRMING'}
                  />
                )}
              </>
            )}

            {orderState.status === 'SUCCESS' && (
              <SuccessView 
                orderId={orderState.confirmedOrderId} 
                onReset={reset}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
