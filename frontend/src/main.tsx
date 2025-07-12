import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes"; // <-- Import ici

import App from "./App";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/auth/RequireAuth";

import "./index.css";
import ConfirmEmailPage from "./pages/ ConfirmEmailPage";
import ChatBot from "./pages/ChatBot";
import AssistantVocal from "./pages/AssistantVocal";
import CoachVisuel from "./pages/CoachVisuel";
import Evaluation from "./pages/Evaluation";
import ExercicePage from "./pages/ExercisePage";
import StepDetail from "./pages/StepDetails";
import Settings from "./pages/Settings";
import Progress from "./pages/Progress";
// import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <ToastProvider />
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="system"
      >
        <HeroUIProvider>
          {/* <AuthProvider> */}
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route
              path="/profile-setup"
              element={
                <RequireAuth>
                  <ProfileSetup />
                </RequireAuth>
              }
            />
            <Route
              path="/evaluation"
              element={
                <RequireAuth>
                  <Evaluation />
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
                path="/coach-tsinjo"
                element={
                  <RequireAuth>
                    <ChatBot />
                  </RequireAuth>
                }
              />
              <Route
                path="/assistant-vocal"
                element={
                  <RequireAuth>
                    <AssistantVocal />
                  </RequireAuth>
                }
              />
              <Route
                path="/coach-visuel"
                element={
                  <RequireAuth>
                    <CoachVisuel />
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
              <Route
                path="/evaluation"
                element={
                  <RequireAuth>
                    <Evaluation />
                  </RequireAuth>
                }
              />
              <Route
                path="/exercise/:id"
                element={
                  <RequireAuth>
                    <ExercicePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/step/:id"
                element={
                  <RequireAuth>
                    <StepDetail />
                  </RequireAuth>
                }
              />
                 <Route
                path="/setings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />
                 <Route
                path="/progress"
                element={
                  <RequireAuth>
                    <Progress />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
          {/* </AuthProvider> */}
        </HeroUIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
