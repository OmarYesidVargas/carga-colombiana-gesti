

// Re-export toast functionality to avoid circular imports
import { toast } from "sonner";

// Simple hook for backward compatibility
export const useToast = () => {
  return {
    toast
  };
};

