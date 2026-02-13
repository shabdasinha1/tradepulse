import { useToast } from "./ToastProvider";

export const useAppToast = () => {
  const { addToast } = useToast();

  return {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    default: (msg) => addToast(msg),
  };
};
