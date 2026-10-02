import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Loader2, AlertCircle, Printer, History, 
  RotateCcw, Languages, ChevronRight, Edit3, Trash2, 
  BookOpen, PlusCircle, Search, CheckCircle2 
} from 'lucide-react';
import { api } from './api';
import OrderInvoice from './OrderInvoice';

const STAGES = {
  INPUT: 0, PROCESSING: 1, CLARIFICATION: 2, SUMMARY: 3, SUCCESS: 4
};

const translations = {
  English: {
    appTitle: "DukaanAI",
    newOrder: "New Order",
    catalog: "Catalog",
    recentOrders: "Recent Orders",
    understandOrder: "✨ Understand Order",
    placeholder: "Type the customer's order...",
    clear: "Clear",
    processing: "Understanding order...",
    needsClarification: "Needs Clarification",
    orderDetected: "Order Items",
    whichOne: "Which one?",
    productNotFound: "Product not found. You can proceed or edit.",
    proceed: "Proceed",
    editRetry: "Edit / Retry",
    orderSummary: "Order Summary",
    total: "Total",
    confirmOrder: "Confirm Order",
    backToEdit: "Back to Edit",
    orderConfirmed: "Order Confirmed",
    orderId: "Order #",
    taxInvoice: "Tax Invoice / Bill of Supply",
    product: "Product",
    qty: "Qty",
    rate: "Rate",
    grandTotal: "Grand Total",
    newOrderBtn: "New Order",
    printBill: "Print Bill",
    printDeliveryNote: "Print Delivery Note",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    deliveryNotes: "Delivery Notes",
    translate: "Translate to shopkeeper language",
    searchProducts: "Search products...",
    allCategories: "All Categories",
    editOrder: "Edit Order",
    customerOrder: "Customer Order",
    view: "View",
    repeatOrder: "Repeat Order",
    readyForDelivery: "READY FOR DELIVERY",
    pendingPayment: "Pending"
  },
  Hindi: {
    appTitle: "दुकानAI",
    newOrder: "नया ऑर्डर",
    catalog: "कैटलॉग",
    recentOrders: "हाल के ऑर्डर",
    understandOrder: "✨ ऑर्डर समझें",
    placeholder: "ग्राहक का ऑर्डर यहाँ लिखें...",
    clear: "साफ़ करें",
    processing: "ऑर्डर समझ रहा हूँ...",
    needsClarification: "स्पष्टीकरण चाहिए",
    orderDetected: "ऑर्डर की वस्तुएं",
    whichOne: "कौन सा?",
    productNotFound: "उत्पाद नहीं मिला। आप आगे बढ़ सकते हैं।",
    proceed: "आगे बढ़ें",
    editRetry: "बदलें / फिर से कोशिश करें",
    orderSummary: "ऑर्डर सारांश",
    total: "कुल",
    confirmOrder: "ऑर्डर पक्का करें",
    backToEdit: "वापस जाएँ",
    orderConfirmed: "ऑर्डर सफल",
    orderId: "ऑर्डर #",
    taxInvoice: "बिल",
    product: "उत्पाद",
    qty: "मात्रा",
    rate: "भाव",
    grandTotal: "कुल राशि",
    newOrderBtn: "नया ऑर्डर",
    printBill: "बिल प्रिंट करें",
    printDeliveryNote: "डिलीवरी नोट प्रिंट करें",
    lowStock: "स्टॉक कम है",
    outOfStock: "स्टॉक में नहीं है",
    inStock: "स्टॉक में है",
    deliveryNotes: "डिलीवरी नोट्स",
    translate: "दुकानदार की भाषा में अनुवाद करें",
    searchProducts: "उत्पाद खोजें...",
    allCategories: "सभी श्रेणियां",
    editOrder: "ऑर्डर बदलें",
    customerOrder: "ग्राहक का ऑर्डर",
    view: "देखें",
    repeatOrder: "फिर से ऑर्डर करें",
    readyForDelivery: "डिलीवरी के लिए तैयार",
    pendingPayment: "बाकी"
  },
  Marathi: {
    appTitle: "दुकानAI",
    newOrder: "नवीन ऑर्डर",
    catalog: "कॅटलॉग",
    recentOrders: "अलीकडील ऑर्डर्स",
    understandOrder: "✨ ऑर्डर समजून घ्या",
    placeholder: "ग्राहकाची ऑर्डर इथे लिहा...",
    clear: "पुसून टाका",
    processing: "ऑर्डर समजून घेत आहे...",
    needsClarification: "स्पष्टीकरण आवश्यक",
    orderDetected: "ऑर्डर आयटम्स",
    whichOne: "कोणते?",
    productNotFound: "उत्पादन आढळले नाही. आपण पुढे जाऊ शकता.",
    proceed: "पुढे जा",
    editRetry: "बदल करा / पुन्हा प्रयत्न करा",
    orderSummary: "ऑर्डरचा सारांश",
    total: "एकूण",
    confirmOrder: "ऑर्डर निश्चित करा",
    backToEdit: "मागे जा",
    orderConfirmed: "ऑर्डर निश्चित झाला",
    orderId: "ऑर्डर #",
    taxInvoice: "बिल",
    product: "उत्पादन",
    qty: "प्रमाण",
    rate: "दर",
    grandTotal: "एकूण रक्कम",
    newOrderBtn: "नवीन ऑर्डर",
    printBill: "बिल प्रिंट करा",
    printDeliveryNote: "डिलिव्हरी नोट प्रिंट करा",
    lowStock: "कमी स्टॉक",
    outOfStock: "स्टॉक संपला",
    inStock: "स्टॉकमध्ये",
    deliveryNotes: "डिलिव्हरी नोट्स",
    translate: "दुकानदाराच्या भाषेत भाषांतर करा",
    searchProducts: "उत्पादन शोधा...",
    allCategories: "सर्व श्रेणी",
    editOrder: "ऑर्डर बदला",
    customerOrder: "ग्राहकाची ऑर्डर",
    view: "पहा",
    repeatOrder: "पुन्हा ऑर्डर करा",
    readyForDelivery: "डिलिव्हरीसाठी तयार",
    pendingPayment: "प्रलंबित"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('new_order');
  
  const [stage, setStage] = useState(STAGES.INPUT);
  const [orderText, setOrderText] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [resolutions, setResolutions] = useState({});
  const [language, setLanguage] = useState(localStorage.getItem('dukaanai_lang') || 'English');
  const [editableItems, setEditableItems] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [recentOrders, setRecentOrders] = useState([]);
  
  const [printMode, setPrintMode] = useState(null); // 'bill' | 'delivery'

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('dukaanai_lang', language);
  }, [language]);

  useEffect(() => {
    if (activeTab === 'catalog') fetchProducts();
    if (activeTab === 'recent') fetchRecentOrders();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const data = await api.getRecentOrders();
      setRecentOrders(data);
    } catch (e) {
      console.error(e);
    }
  };


  const handleAnalyze = async () => {
    if (!orderText.trim()) return;
    setError("");
    setStage(STAGES.PROCESSING);
    
    try {
      const result = await api.parseOrder(orderText);
      setOrderData(result);
      
      if (result.status === "NEEDS_CLARIFICATION") {
        setStage(STAGES.CLARIFICATION);
      } else {
        setEditableItems(result.matched_items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          product: item.product
        })));
        setStage(STAGES.SUMMARY);
      }
    } catch (err) {
      setError(err.message || "Unable to connect to DukaanAI.");
      setStage(STAGES.INPUT);
    }
  };

  const handleResolveOption = (originalQuery, productId) => {
    setResolutions(prev => ({
      ...prev,
      [originalQuery]: productId
    }));
  };

  const handleSubmitClarifications = async () => {
    const ambigItems = orderData.clarification_items.filter(c => c.options.length > 0);
    if (Object.keys(resolutions).length < ambigItems.length) {
      setError("Please resolve all ambiguous items.");
      return;
    }
    
    setError("");
    setStage(STAGES.PROCESSING);
    
    try {
      const result = await api.clarifyOrder(orderData.order_id, resolutions);
      setOrderData({
        ...orderData,
        status: result.order.status,
        matched_items: result.order.items,
        order_id: result.order.id,
        clarification_items: [],
        delivery_notes: result.order.delivery_notes
      });
      setEditableItems(result.order.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        product: item.product
      })));
      setStage(STAGES.SUMMARY);
    } catch (err) {
      setError(err.message || "Failed to submit clarifications.");
      setStage(STAGES.CLARIFICATION);
    }
  };

  const handleConfirm = async () => {
    setError("");
    setStage(STAGES.PROCESSING);
    try {
      const itemsToConfirm = editableItems.map(item => ({
        product_id: item.product_id,
        quantity: parseFloat(item.quantity)
      }));
      const result = await api.confirmOrder(orderData.order_id, itemsToConfirm);
      setOrderData({
        ...orderData,
        status: result.order.status,
        matched_items: result.order.items,
        delivery_notes: result.order.delivery_notes,
        total_amount: result.order.total_amount
      });
      setStage(STAGES.SUCCESS);
    } catch (err) {
      setError(err.message || "Order could not be confirmed.");
      setStage(STAGES.SUMMARY);
    }
  };

  const updateQuantity = (productId, val) => {
    setEditableItems(prev => prev.map(item => 
      item.product_id === productId ? { ...item, quantity: val } : item
    ));
  };

  const removeItem = (productId) => {
    setEditableItems(prev => prev.filter(item => item.product_id !== productId));
  };

  const executePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  };

  const startNewOrder = () => {
    setStage(STAGES.INPUT);
    setOrderText("");
    setOrderData(null);
    setResolutions({});
    setEditableItems([]);
  };

  const loadRepeatOrder = (rawText) => {
    setOrderText(rawText || "");
    setActiveTab('new_order');
    setStage(STAGES.INPUT);
  };

  // View a past order as success
  const viewOrder = async (orderId) => {
    try {
      const res = await api.getOrder(orderId);
      setOrderData({
        order_id: res.id,
        status: res.status,
        matched_items: res.items,
        delivery_notes: res.delivery_notes,
        total_amount: res.total_amount
      });
      setActiveTab('new_order');
      setStage(STAGES.SUCCESS);
    } catch(e) {
      console.error(e);
    }
  };

  // --- CATALOG HELPERS ---
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchQ = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.aliases.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: t.outOfStock, className: "stock-out", icon: <AlertCircle size={14}/> };
    if (stock <= 5) return { label: t.lowStock, className: "stock-low", icon: <AlertCircle size={14}/> };
    return { label: t.inStock, className: "stock-in", icon: <CheckCircle2 size={14}/> };
  };

  // Print logic is now handled strictly via CSS @media print and the OrderInvoice component
  
  return (
    <div className="app-container">
      <header className="app-header no-print">
        <div className="logo">
          <ShoppingBag className="text-primary" size={28} />
          <span>{t.appTitle}</span>
        </div>
        
        <nav className="top-nav">
          <button className={`nav-btn ${activeTab === 'new_order' ? 'active' : ''}`} onClick={() => setActiveTab('new_order')}>
            <PlusCircle size={18} /> {t.newOrder}
          </button>
          <button className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
            <BookOpen size={18} /> {t.catalog}
          </button>
          <button className={`nav-btn ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>
            <History size={18} /> {t.recentOrders}
          </button>
        </nav>

        <div className="language-selector">
          <Languages size={18} className="text-muted" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* --- NEW ORDER TAB --- */}
        {activeTab === 'new_order' && (
          <>
            {stage === STAGES.INPUT && (
              <div className="card animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-title">{t.newOrder}</h2>
                </div>
                
                <div className="input-group">
                  <label>{t.customerOrder}</label>
                  <textarea 
                    className="order-textarea"
                    value={orderText}
                    onChange={(e) => setOrderText(e.target.value)}
                    placeholder={t.placeholder}
                    rows={4}
                  />
                </div>
                
                <div className="actions">
                  <button className="btn primary-btn" onClick={handleAnalyze} disabled={!orderText.trim()}>
                    {t.understandOrder}
                  </button>
                  <button className="btn outline-btn" onClick={() => setOrderText("")}>
                    {t.clear}
                  </button>
                </div>
              </div>
            )}

            {stage === STAGES.PROCESSING && (
              <div className="card center-content animate-fade-in">
                <Loader2 className="loader spin text-primary" size={48} />
                <h2 className="mt-4">{t.processing}</h2>
              </div>
            )}

            {stage === STAGES.CLARIFICATION && (
              <div className="card animate-fade-in">
                <div className="warning-banner mb-4">
                  <AlertCircle size={24} />
                  <h2>{t.needsClarification}</h2>
                </div>
                
                {orderData.matched_items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="sub-title">{t.orderDetected}</h3>
                    <div className="item-list">
                      {orderData.matched_items.map((item, idx) => (
                        <div key={idx} className="list-row">
                          <span>{item.quantity} × {item.product.name}</span>
                          <span>₹{item.price_per_unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="clarification-section">
                  {orderData.clarification_items.map((cItem, idx) => (
                    <div key={idx} className="ambiguity-box">
                      <div className="ambiguity-query">
                        <span style={{ textTransform: 'capitalize' }}>{cItem.original_query}</span> × {cItem.quantity}
                      </div>
                      {cItem.reason === "ambiguous" ? (
                        <div>
                          <div className="text-muted mb-2">{t.whichOne}</div>
                          <div className="options-grid">
                            {cItem.options.map((opt) => {
                              const isSelected = resolutions[cItem.original_query] === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  className={`option-card ${isSelected ? 'selected' : ''}`}
                                  onClick={() => handleResolveOption(cItem.original_query, opt.id)}
                                >
                                  <div className="font-semibold">{opt.name} <span className="text-sm font-normal text-muted">({opt.unit})</span></div>
                                  <div className="text-primary mt-1 font-bold">₹{opt.price}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-danger mt-2">
                          — {t.productNotFound}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="actions mt-6">
                  <button 
                    className="btn primary-btn" 
                    onClick={handleSubmitClarifications}
                    disabled={Object.keys(resolutions).length < orderData.clarification_items.filter(c => c.options.length > 0).length}
                  >
                    {t.proceed} <ChevronRight size={20}/>
                  </button>
                  <button className="btn secondary-btn" onClick={() => setStage(STAGES.INPUT)}>
                    {t.editRetry}
                  </button>
                </div>
              </div>
            )}

            {stage === STAGES.SUMMARY && (
              <div className="card animate-fade-in">
                <h2 className="section-title mb-4">{t.orderSummary}</h2>
                
                <div className="summary-list">
                  <div className="summary-header">
                    <div>{t.product}</div>
                    <div className="text-right">{t.qty}</div>
                    <div className="text-right">{t.total}</div>
                    <div></div>
                  </div>
                  
                  {editableItems.map((item) => {
                    const isLowStock = item.quantity > item.product.stock;
                    return (
                      <div key={item.product_id} className={`summary-row ${isLowStock ? 'error-row' : ''}`}>
                        <div className="product-info">
                          <div className="font-semibold">{item.product.name}</div>
                          <div className="text-sm text-muted">₹{item.product.price} / {item.product.unit}</div>
                          {isLowStock && <div className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {t.lowStock}: {item.product.stock} left</div>}
                        </div>
                        <div className="qty-control text-right">
                          <input 
                            type="number" 
                            min="0"
                            step="0.1"
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                            className="qty-input"
                          />
                        </div>
                        <div className="item-total text-right font-bold">
                          ₹{(item.quantity * item.product.price).toFixed(2)}
                        </div>
                        <div className="item-actions">
                          <button className="icon-btn text-danger" onClick={() => removeItem(item.product_id)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {orderData.delivery_notes && (
                  <div className="delivery-notes-box mt-4">
                    <div className="font-semibold text-sm text-muted mb-1">{t.deliveryNotes}</div>
                    <p>"{orderData.delivery_notes}"</p>
                  </div>
                )}
                
                <div className="grand-total mt-6">
                  <span>{t.grandTotal}</span>
                  <span className="text-primary text-2xl">
                    ₹{editableItems.reduce((acc, item) => acc + (item.quantity * item.product.price), 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="actions mt-6">
                  <button className="btn primary-btn" onClick={handleConfirm} disabled={editableItems.length === 0}>
                    {t.confirmOrder} <CheckCircle2 size={20}/>
                  </button>
                  <button className="btn secondary-btn" onClick={() => setStage(STAGES.INPUT)}>
                    {t.editOrder}
                  </button>
                </div>
              </div>
            )}

            {stage === STAGES.SUCCESS && (
              <div className="card animate-fade-in">
                <div className="success-banner mb-6 no-print">
                  <CheckCircle2 size={32} />
                  <h2>{t.orderConfirmed}</h2>
                  <p>{t.orderId} ORD-{orderData.order_id}</p>
                  <p className="text-sm text-green-700 mt-2 font-medium">Inventory updated.</p>
                </div>

                <div className="bill-preview print-area mt-4">
                  <OrderInvoice order={orderData} translations={t} mode={printMode || 'bill'} />
                </div>

                <div className="actions mt-6 justify-center no-print">
                  <button className="btn secondary-btn" onClick={() => executePrint('bill')}>
                    <Printer size={18} /> {t.printBill}
                  </button>
                  <button className="btn outline-btn" onClick={() => executePrint('delivery')}>
                    <Printer size={18} /> {t.printDeliveryNote}
                  </button>
                  <button className="btn primary-btn" onClick={startNewOrder}>
                    <PlusCircle size={18} /> {t.newOrderBtn}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- CATALOG TAB --- */}
        {activeTab === 'catalog' && (
          <div className="card animate-fade-in catalog-page">
            <h2 className="section-title mb-4">{t.catalog}</h2>
            
            <div className="catalog-controls mb-6 flex gap-4 flex-wrap">
              <div className="search-box flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input 
                  type="text" 
                  placeholder={t.searchProducts}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 w-full p-2 rounded border"
                />
              </div>
              <select 
                className="category-filter p-2 rounded border"
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? t.allCategories : cat}</option>)}
              </select>
            </div>

            <div className="products-grid">
              {filteredProducts.map(p => {
                const stockStat = getStockStatus(p.stock);
                return (
                  <div key={p.id} className="product-card p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{p.brand}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{p.category}</div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-primary">₹{p.price} / {p.unit}</span>
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${stockStat.className}`}>
                      {stockStat.icon} {stockStat.label} ({p.stock} available)
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredProducts.length === 0 && <div className="text-center text-muted p-8">No products found.</div>}
          </div>
        )}

        {/* --- RECENT ORDERS TAB --- */}
        {activeTab === 'recent' && (
          <div className="card animate-fade-in">
            <h2 className="section-title mb-4">{t.recentOrders}</h2>
            {recentOrders.length === 0 ? (
              <div className="text-center p-8 text-muted">No recent orders found.</div>
            ) : (
              <div className="recent-orders-list flex flex-col gap-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="recent-order-card border p-4 rounded flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <div className="font-bold text-lg">ORD-{order.id}</div>
                      <div className="text-sm text-muted">{new Date(order.created_at).toLocaleString()}</div>
                      <div className="mt-2 text-sm">
                        {order.items.length} items • <strong>₹{order.total_amount}</strong>
                      </div>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded inline-block mt-2">
                        {order.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn outline-btn text-sm py-1 px-3" onClick={() => viewOrder(order.id)}>
                        <BookOpen size={14} className="mr-1"/> {t.view}
                      </button>
                      <button className="btn secondary-btn text-sm py-1 px-3" onClick={() => loadRepeatOrder(order.raw_text)}>
                        <RotateCcw size={14} className="mr-1"/> {t.repeatOrder}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
