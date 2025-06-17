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

  const isWebinarPage = location.pathname === "/webinar" || location.pathname === "/courseDetailNew/Personalised-Mentorship-Programme" || location.pathname === "/courseDetailslive/UPSC-Foundation-Batch";

  return (
    <Fragment>
     {isWebinarPage ? <NewNavBar /> :  <NewNavBar />}
      <Outlet />
      {!shouldHideFooter && (
        isWebinarPage ? <NewFooter /> : <NewFooter />
      )}
    </Fragment>
  );
};

export default MainLayout;
