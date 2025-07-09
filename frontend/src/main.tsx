import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { Toaster } from "sonner";

import App from "./App";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProfileSetup from "./pages/clients/ProfileSetup";
import Dashboard from "./pages/clients/Dashboard";
import ProfilePage from "./pages/clients/ProfilePage";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/auth/RequireAuth"; // ✅ ajouté

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <ToastProvider />
      <HeroUIProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Routes protégées */}
          <Route
            path="/profile-setup"
            element={
              <RequireAuth>
                <ProfileSetup />
              </RequireAuth>
            }
          />

          <Route element={<Layout />}>
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
