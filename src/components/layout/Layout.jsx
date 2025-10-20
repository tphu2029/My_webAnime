import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="bg-gray-950 text-white min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
