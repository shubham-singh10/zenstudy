import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create the context with a default value
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        role: null,
        user: null,
        token: null,
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    // Load the auth state from localStorage when the app starts
    useEffect(() => {
        const storedUser = window.localStorage.getItem("userData");
        const storedRole = window.localStorage.getItem("role");
        const storedToken = window.localStorage.getItem("token");

        if (storedUser && storedRole && storedToken) {
            setAuthState({
                isAuthenticated: true,
                role: storedRole,
                token: storedToken,
                user: JSON.parse(storedUser), // Now, it's typed as `User | null`
            });
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (user, role, token) => {
        window.localStorage.setItem("userData", JSON.stringify(user));
        window.localStorage.setItem("role", role);
        window.localStorage.setItem("token", token);

        setAuthState({
            isAuthenticated: true,
            role,
            user,
            token,
        });
    };

    // Logout function
    const logout = async () => {
        setLogoutLoading(true)
        try {
            // Call the signout API
            const response = await axios.post(`${process.env.REACT_APP_API}zenstudy/api/auth/signout`, {}, { withCredentials: true });
            if (response.data.message === "Signout successful") {
                // Clear local storage and cookies
                window.localStorage.removeItem("userData");
                window.localStorage.removeItem("role");
                window.localStorage.removeItem("token");
                Cookies.remove("access_tokennew");

                // Update auth state and redirect to home
                setAuthState({
                    isAuthenticated: false,
                    role: null,
                    user: null,
                    token: null,
                });
                navigate("/");
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally, show an error message to the user
        } finally {
            setLogoutLoading(false);  // End loading
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, loading, logoutLoading  }}>
            {children}
        </AuthContext.Provider>
    );
};
