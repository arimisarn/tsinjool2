import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import App from "./App";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { Toaster } from "sonner";
import ProfileSetup from "./pages/clients/ProfileSetup";

import "./index.css";
import Dashboard from "./pages/clients/Dashboard";
import ProfilePage from "./pages/clients/ProfilePage";
import Layout from "./components/layout/Layout";

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
          <Route element={<Layout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Routes>
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
