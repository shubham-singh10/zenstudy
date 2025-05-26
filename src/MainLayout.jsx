import React, { Fragment } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import { Outlet, useLocation } from "react-router-dom";
import NewFooter from "./components/NewFooter";
import NewNavBar from "./components/NewNavBar";

const MainLayout = () => {
  const location = useLocation();

  const hideFooterRoutes = ["/courseDetailslive"];

  const shouldHideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const isWebinarPage = location.pathname === "/webinar";

  return (
    <Fragment>
     {isWebinarPage ? <NewNavBar /> : <NavBar />}
      <Outlet />
      {!shouldHideFooter && (
        isWebinarPage ? <NewFooter /> : <Footer />
      )}
    </Fragment>
  );
};

export default MainLayout;
