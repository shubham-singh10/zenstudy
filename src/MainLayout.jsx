// MainLayout.jsx
import React, { Fragment } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom"
const MainLayout = ({ children }) => {
  const location = useLocation()

  // Hide footer on this path
  const hideFooterRoutes = ["/courseDetailslive"];

  // Check if current route matches (including dynamic params)
  const shouldHideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );


  return (
    <Fragment>
      <NavBar />
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </Fragment>
  );
};

export default MainLayout;
