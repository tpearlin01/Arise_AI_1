import React, { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import OrderInput from './components/OrderInput';
import OrderAnalysis from './components/OrderAnalysis';
import ClarificationPanel from './components/ClarificationPanel';
import OrderSummary from './components/OrderSummary';
import DeliveryNote from './components/DeliveryNote';
import Bill from './components/Bill';
import OrderHistory from './components/OrderHistory';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import { parseOrder, clarifyOrder, confirmOrder } from './services/api';
import { CheckCircle, PlusCircle } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, PROCESSING, ERROR, NEEDS_CLARIFICATION, READY, CONFIRMED
  const [isResolving, setIsResolving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setOrder(null);
    setStatus('IDLE');
  };

  const handleNewOrder = () => {
    setOrder(null);
    setStatus('IDLE');
  };

  const handleProcessOrder = async (message) => {
    try {
      setStatus('PROCESSING');
      setOrder(null);
      const data = await parseOrder(message);
      setOrder(data);
      setStatus(data.status === 'NEEDS_CLARIFICATION' ? 'NEEDS_CLARIFICATION' : 'READY');
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const handleClarifyItem = async (orderId, itemId, selectedOption) => {
    try {
      setIsResolving(true);
      const data = await clarifyOrder(orderId, itemId, selectedOption);
      setOrder(data);
      if (data.status !== 'NEEDS_CLARIFICATION') {
        setStatus('READY');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setIsConfirming(true);
      await confirmOrder(order.order_id);
      setStatus('CONFIRMED');
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  };

  const renderContent = () => {
    if (status === 'IDLE') return <EmptyState />;
    if (status === 'PROCESSING') return <LoadingState message="Understanding order..." />;
    if (status === 'ERROR') return <ErrorState onRetry={() => setStatus('IDLE')} />;

    const ambiguousItems = order?.items?.filter(item => item.status === 'AMBIGUOUS') || [];

    if (status === 'CONFIRMED') {
      return (
        <div className="grid gap-6 animate-fade-in">
          <div className="panel text-center" style={{ borderLeft: '4px solid var(--success)' }}>
            <CheckCircle size={48} color="var(--success)" className="mb-4 mx-auto" />
            <h2 className="justify-center mb-2">Order Confirmed!</h2>
            <p className="text-muted mb-4">Order ID: {order.order_id}</p>
            <button className="btn btn-primary" onClick={handleNewOrder}>
              <PlusCircle size={18} />
              Start New Order
            </button>
          </div>
          <Bill order={order} />
          <DeliveryNote order={order} />
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        <OrderAnalysis order={order} onClarify={() => {}} />
        
        {status === 'NEEDS_CLARIFICATION' && (
          <ClarificationPanel 
            orderId={order.order_id}
            clarificationText={order.clarification}
            ambiguousItems={ambiguousItems}
            onOptionSelected={handleClarifyItem}
            isResolving={isResolving}
          />
        )}

        {status === 'READY' && (
          <div className="grid gap-6 animate-fade-in">
            <OrderSummary order={order} />
            <div className="panel text-center">
              <p className="mb-4 text-main">Please review the order before confirming.</p>
              <button 
                className="btn btn-success w-full"
                onClick={handleConfirmOrder}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <span className="spinner" style={{width: 16, height: 16, borderWidth: 2}}></span>
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />
      <main className="grid grid-cols-1 lg:grid-cols-2 mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Left column for input */}
        <div className="flex flex-col gap-6">
          <OrderInput 
            onProcessOrder={handleProcessOrder} 
            isProcessing={status === 'PROCESSING'} 
          />
          {status === 'IDLE' && <OrderHistory />}
        </div>
        
        {/* Right column for results */}
        <div className="flex flex-col gap-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
