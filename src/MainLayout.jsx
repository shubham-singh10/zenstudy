import React, { Fragment } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import { Outlet, useLocation } from "react-router-dom";
import NewFooter from "./components/NewFooter";
import NewNavBar from "./components/NewNavBar";

const MainLayout = () => {
  const location = useLocation();

 
  return (
    <Fragment>
     <NewNavBar />
      <Outlet />
       <NewFooter />      
    </Fragment>
  );
};

export default MainLayout;
