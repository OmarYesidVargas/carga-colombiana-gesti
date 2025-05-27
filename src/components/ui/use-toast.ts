
// Re-export toast functionality to avoid circular imports
export { toast } from "sonner";

// Simple hook for backward compatibility
export const useToast = () => {
  return {
    toast
  };
};
