// MainLayout.jsx
import React, { Fragment } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom"
const MainLayout = ({ children }) => {
  return (
    <Fragment>
      <NavBar />
      <Outlet/>
      <Footer />
    </Fragment>
  );
};

export default MainLayout;
