import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "./Footer";
import Badges from "@/features/home/Badges";

const Layout: React.FC = () => {
  return (
    <div >
      <Header />
      <Badges/>
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
