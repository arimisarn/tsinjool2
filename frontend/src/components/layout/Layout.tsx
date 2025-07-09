import Navigation from "../clients/Navigation";
import MainHeader from "../clients/MainHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <MainHeader />
      <Navigation />
      <Outlet />
    </>
  );
};

export default Layout;
