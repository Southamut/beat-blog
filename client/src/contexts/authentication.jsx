import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, setState] = useState({
        user: {
            id: "1", // Mock user ID
            name: "Thompson P.", // Mock user name
            email: "thompson@example.com"
        },
        isAuthenticated: true
    });

    return (
        <AuthContext.Provider value={{ state, setState }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
