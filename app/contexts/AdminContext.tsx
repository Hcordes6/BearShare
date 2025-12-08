"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
    isAdmin: boolean;
    adminPassword: string | null;
    setAdminPassword: (password: string | null) => void;
    clearAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    // Start with default values to avoid hydration mismatch
    const [adminPassword, setAdminPasswordState] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Load from localStorage only after mount (client-side only)
    useEffect(() => {
        const storedPassword = localStorage.getItem("adminPassword");
        const storedAuth = localStorage.getItem("adminAuthenticated") === "true";
        
        if (storedPassword && storedAuth) {
            setAdminPasswordState(storedPassword);
            setIsAdmin(true);
        }
    }, []);

    // Sync to localStorage when adminPassword changes
    useEffect(() => {
        if (adminPassword) {
            localStorage.setItem("adminPassword", adminPassword);
            localStorage.setItem("adminAuthenticated", "true");
            setIsAdmin(true);
        } else {
            localStorage.removeItem("adminPassword");
            localStorage.removeItem("adminAuthenticated");
            setIsAdmin(false);
        }
    }, [adminPassword]);

    const setAdminPassword = (password: string | null) => {
        setAdminPasswordState(password);
    };

    const clearAdmin = () => {
        setAdminPasswordState(null);
        localStorage.removeItem("adminPassword");
        localStorage.removeItem("adminAuthenticated");
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminPassword, setAdminPassword, clearAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}

