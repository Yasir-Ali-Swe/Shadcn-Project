import React from "react";
const layout = ({ children }) => {
  return (
    <main className="min-h-screen w-full flex justify-center items-center">
      {children}
    </main>
  );
};

export default layout;
