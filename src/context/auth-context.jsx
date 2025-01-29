import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use AuthContext
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
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}zenstudy/api/user/userdetail`,
                    { withCredentials: true }
                );

                if (response.data.message === "Success") {
                    setAuthState({
                        isAuthenticated: true,
                        role: response.data.userdetail.role, // Assuming role is in userdetail
                        user: response.data.userdetail,
                    });
                }
            } catch (error) {
                console.error("Auth check failed:", error.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);
console.log("auth: ", authState)
    // Login function - Only sets auth state
    const login = (user) => {
        setAuthState({
            isAuthenticated: true,
            role: user.role,
            user,
        });
    };

    // Logout function
    const logout = async () => {
        setLogoutLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}zenstudy/api/auth/signout`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === "Signout successful") {
                setAuthState({
                    isAuthenticated: false,
                    role: null,
                    user: null,
                });

                navigate("/");
                // setTimeout(() => {
                //     window.location.reload();
                // }, 100);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, loading, logoutLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
