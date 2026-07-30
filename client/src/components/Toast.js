import { useState, useEffect } from 'react';

const toastStyles = `
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toast-item {
    padding: 14px 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-left: 4px solid transparent;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: #1a0808;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .toast-item.closing {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes slideIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }

  .toast-success { border-left-color: #10B981; }
  .toast-error   { border-left-color: #EF4444; }
  .toast-warning { border-left-color: #F59E0B; }
  .toast-info    { border-left-color: #3B82F6; }

  .toast-icon {
    font-size: 1.2rem;
  }
`;

// Simple event-based toast system
export const toastEvent = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  emit(message, type = 'info', duration = 3000) {
    this.listeners.forEach(listener => listener({ id: Date.now(), message, type, duration }));
  }
};

export const toast = {
  success: (msg, dur) => toastEvent.emit(msg, 'success', dur),
  error:   (msg, dur) => toastEvent.emit(msg, 'error', dur),
  warning: (msg, dur) => toastEvent.emit(msg, 'warning', dur),
  info:    (msg, dur) => toastEvent.emit(msg, 'info', dur),
};

const iconMap = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

export function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toastEvent.subscribe((newToast) => {
      setToasts(prev => [...prev, { ...newToast, closing: false }]);

      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === newToast.id ? { ...t, closing: true } : t));
        
        // Actually remove from DOM after animation finishes
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 300); // 300ms matches slideOut animation

      }, newToast.duration);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{toastStyles}</style>
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item toast-${t.type} ${t.closing ? 'closing' : ''}`}>
            <span className="toast-icon">{iconMap[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
