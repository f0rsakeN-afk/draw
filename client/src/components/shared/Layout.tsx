import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-12 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
