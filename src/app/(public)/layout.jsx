import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const layout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <main className="px-15 flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
