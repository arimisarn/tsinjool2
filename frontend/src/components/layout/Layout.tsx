import Navigation from "../clients/Navigation";
import MainHeader from "../clients/MainHeader";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Layout = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(
        "https://tsinjool-backend.onrender.com/api/check-scheduled-exercises/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then((res) => {
        console.log("🔔 Notifications planifiées vérifiées :", res.data);
        window.dispatchEvent(new Event("refresh-notifications"));
      })
      .catch((err) => {
        console.error("❌ Erreur vérification exercices planifiés", err);
      });
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
