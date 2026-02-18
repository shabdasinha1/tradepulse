const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="tp-toast-wrapper">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`tp-toast tp-toast--${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
