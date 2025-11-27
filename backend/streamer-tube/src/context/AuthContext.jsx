import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const recoverUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Verifica se o token ainda é válido chamando /me
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (error) {
          // Se o token expirou, desloga
          logout();
        }
      }
      setLoading(false);
    };

    recoverUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      
      // Busca dados do usuário após login para atualizar o estado
      const userResponse = await api.get("/auth/me");
      setUser(userResponse.data);
      
      navigate("/"); // Redireciona para home
    } catch (error) {
      console.error("Erro no login", error);
      throw error; // Lança erro para o formulário tratar
    }
  };

  const register = async (name, username, password) => {
    try {
      await api.post("/auth/register", { name, username, password });
      // Após registrar, faz o login automático
      await login(username, password);
    } catch (error) {
      console.error("Erro no registro", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};