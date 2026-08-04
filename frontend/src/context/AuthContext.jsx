//add context api

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const isValidToken = (t) => {
  return t && t !== "null" && t !== "undefined" && t !== "[object Object]" && typeof t === "string" && t.trim() !== "";
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return isValidToken(savedToken) ? savedToken : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Helper to extract userId from JWT token payload
  const getUserIdFromToken = useCallback((jwtToken) => {
    if (!isValidToken(jwtToken)) return null;
    try {
      const parts = jwtToken.split(".");
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      if (!base64Url) return null;
      const payload = JSON.parse(atob(base64Url));
      return payload.userId || payload.id || null;
    } catch (err) {
      console.error("Error parsing JWT token:", err);
      return null;
    }
  }, []);

  // Fetch current user profile
  const fetchUserProfile = useCallback(async (currentToken, currentUserId) => {
    const activeToken = currentToken || token;
    const activeUserId = currentUserId || userId || getUserIdFromToken(activeToken);

    if (!isValidToken(activeToken) || !activeUserId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/myprofile/${activeUserId}`,
        {
          headers: { Authorization: `Bearer ${activeToken}` },
          withCredentials: true,
        }
      );
      if (res.data && res.data.user) {
        setUser(res.data.user);
        if (res.data.user.role) {
          setRole(res.data.user.role);
          localStorage.setItem("role", res.data.user.role);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile in AuthContext:", error.response?.data || error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token, userId, getUserIdFromToken]);

  // Initial load effect
  useEffect(() => {
    if (token) {
      const parsedId = getUserIdFromToken(token);
      setUserId(parsedId);
      if (parsedId) {
        fetchUserProfile(token, parsedId);
      } else {
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, getUserIdFromToken, fetchUserProfile]);

  // Login handler
  const login = (newToken, newRole, userData = null) => {
    localStorage.setItem("token", newToken);
    if (newRole) localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
    const parsedId = getUserIdFromToken(newToken);
    setUserId(parsedId);
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else if (parsedId) {
      fetchUserProfile(newToken, parsedId);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setToken(null);
      setRole(null);
      setUser(null);
      setUserId(null);
      setLoading(false);
    }
  };

  // Update user state manually (e.g. after profile edit)
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  // Manual refresh profile
  const refreshProfile = () => {
    if (token && userId) {
      return fetchUserProfile(token, userId);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        userId,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
