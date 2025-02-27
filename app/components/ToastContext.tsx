import { createContext, ReactNode, useContext } from "react";
import Toast from "react-native-toast-message";

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        Toast.show({
            type,
            text1: message,
        });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
