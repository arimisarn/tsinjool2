import Navigation from "../clients/Navigation";
import MainHeader from "../clients/MainHeader";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Layout = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkNotifications = async () => {
      try {
        const res = await axios.get(
          "https://tsinjool-backend.onrender.com/api/check-scheduled-exercises/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (res.data.notifications_sent > 0) {
          window.dispatchEvent(new Event("refresh-notifications"));
        }
      } catch (error) {
        console.error("Erreur vérification notifications", error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MainHeader />
      <Navigation />
      <Outlet />
    </>
  );
};

export default Layout;
