"use client";

import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
// import notificationSoundFile from "../../public/notifications.mp3"; // adapte le chemin

interface Notification {
  id: number;
  message: string;
  type: "info" | "alert" | "success";
  is_read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://backend-tsinjool.onrender.com/api/notifications/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des notifications");
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.post(
        `https://backend-tsinjool.onrender.com/api/notifications/${id}/read/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };
  const notificationSoundFile = "/notifications.mp3";
  const notificationSound = new Audio(notificationSoundFile);
  useEffect(() => {
    const unread = notifications.filter((n) => !n.is_read);

    unread.forEach((notif) => {
      const shownKey = `shown-notif-${notif.id}`;
      if (!sessionStorage.getItem(shownKey)) {
        if (notif.type === "alert") {
          toast.error(notif.message);
          notificationSound.play();
        } else if (notif.type === "success") {
          toast.success(notif.message);
          notificationSound.play();
        } else {
          toast.info(notif.message);
          notificationSound.play();
        }

        sessionStorage.setItem(shownKey, "true");
      }
    });
  }, [notifications]);

  // ✅ Récupération au montage
  useEffect(() => {
    fetchNotifications();

    // 🔄 Écouteur personnalisé quand on veut forcer le refresh
    const handleRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);

    return () => {
      window.removeEventListener("refresh-notifications", handleRefresh);
    };
  }, []);

  // ✅ Affichage automatique des nouvelles notifications
  useEffect(() => {
    const unread = notifications.filter((n) => !n.is_read);

    unread.forEach((notif) => {
      const shownKey = `shown-notif-${notif.id}`;
      if (!sessionStorage.getItem(shownKey)) {
        if (notif.type === "alert") toast.error(notif.message);
        else if (notif.type === "success") toast.success(notif.message);
        else toast.info(notif.message);

        sessionStorage.setItem(shownKey, "true");
      }
    });
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };
  useEffect(() => {
    const handleRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);
    return () => {
      window.removeEventListener("refresh-notifications", handleRefresh);
    };
  }, []);

  return (
    <div className="relative">
      {/* Bouton cloche */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center
             bg-gradient-to-br from-blue-600 to-purple-600
             dark:from-blue-400 dark:to-purple-600
             shadow-md"
          >
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 shadow-lg rounded-xl border dark:border-zinc-700 z-50"
          >
            <div className="p-4 max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  Aucune notification
                </p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-2 p-3 rounded-lg mb-2 transition hover:shadow-sm ${
                      notif.is_read
                        ? "bg-white dark:bg-zinc-900"
                        : "bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600"
                    }`}
                  >
                    <div>{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.created_at).toLocaleString("fr-FR")}
                      </p>
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs mt-1 text-purple-600 hover:underline"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
