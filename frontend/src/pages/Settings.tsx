"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Trash2,
  Download,
  LogOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisible: boolean;
    progressVisible: boolean;
    shareData: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    soundEnabled: boolean;
    autoPlay: boolean;
  };
}

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      reminders: true,
      achievements: true,
    },
    privacy: {
      profileVisible: true,
      progressVisible: false,
      shareData: false,
    },
    preferences: {
      theme: "light",
      language: "fr",
      soundEnabled: true,
      autoPlay: false,
    },
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    document.title = "Tsinjool - Paramètres";
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // En mode démo, utiliser les paramètres par défaut
    // Dans la vraie app, charger depuis l'API
    try {
      const savedSettings = localStorage.getItem("tsinjool-settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // En mode démo, sauvegarder dans localStorage
      localStorage.setItem("tsinjool-settings", JSON.stringify(settings));

      // Dans la vraie app, envoyer à l'API
      // await axios.put('/api/settings/', settings)

      toast.success("Paramètres sauvegardés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde des paramètres.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("tsinjool-settings");
      toast.success("Déconnexion réussie !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      // En mode démo, juste nettoyer le localStorage
      localStorage.clear();
      toast.success("Compte supprimé avec succès.");
      navigate("/register");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du compte.");
    }
  };

  const exportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tsinjool-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Données exportées avec succès !");
  };

  const updateNotificationSetting = (
    key: keyof Settings["notifications"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePrivacySetting = (
    key: keyof Settings["privacy"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const updatePreferenceSetting = (
    key: keyof Settings["preferences"],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-600">
                  Gérez vos préférences et paramètres
                </p>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-600">
                  Gérez vos préférences de notification
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Notifications par email
                    </p>
                    <p className="text-sm text-gray-600">
                      Recevez des emails pour les mises à jour importantes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      updateNotificationSetting("email", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Notifications push
                    </p>
                    <p className="text-sm text-gray-600">
                      Recevez des notifications sur votre appareil
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      updateNotificationSetting("push", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Rappels d'exercices
                    </p>
                    <p className="text-sm text-gray-600">
                      Rappels quotidiens pour vos exercices
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.reminders}
                    onChange={(e) =>
                      updateNotificationSetting("reminders", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Préférences */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Préférences
                </h2>
                <p className="text-sm text-gray-600">
                  Personnalisez votre expérience
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Thème
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Clair", icon: Sun },
                    { value: "dark", label: "Sombre", icon: Moon },
                    { value: "auto", label: "Auto", icon: Palette },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updatePreferenceSetting("theme", value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        settings.preferences.theme === value
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Langue
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) =>
                    updatePreferenceSetting("language", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.preferences.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-gray-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Sons activés</p>
                    <p className="text-sm text-gray-600">
                      Sons pour les interactions et notifications
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preferences.soundEnabled}
                    onChange={(e) =>
                      updatePreferenceSetting("soundEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Confidentialité
                </h2>
                <p className="text-sm text-gray-600">
                  Contrôlez vos données personnelles
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Profil public</p>
                  <p className="text-sm text-gray-600">
                    Permettre aux autres de voir votre profil
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.profileVisible}
                    onChange={(e) =>
                      updatePrivacySetting("profileVisible", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Partage des progrès
                  </p>
                  <p className="text-sm text-gray-600">
                    Partager vos statistiques de progression
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.progressVisible}
                    onChange={(e) =>
                      updatePrivacySetting("progressVisible", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={exportData}
                className="flex items-center gap-3 w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Exporter mes données
                  </p>
                  <p className="text-sm text-gray-600">
                    Télécharger une copie de vos données
                  </p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Se déconnecter</p>
                  <p className="text-sm text-gray-600">
                    Fermer votre session actuelle
                  </p>
                </div>
              </button>

              <button
                onClick={handleDeleteAccount}
                className={`flex items-center gap-3 w-full p-4 text-left border rounded-lg transition-colors ${
                  showDeleteConfirm
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">
                    {showDeleteConfirm
                      ? "Confirmer la suppression"
                      : "Supprimer mon compte"}
                  </p>
                  <p className="text-sm text-red-600">
                    {showDeleteConfirm
                      ? "Cette action est irréversible. Cliquez à nouveau pour confirmer."
                      : "Supprimer définitivement votre compte et toutes vos données"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
