import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex w-screen justify-between items-center bg-foreground text-background px-20 py-5">
      <div className="logo">
        <p>LawConnect</p>
      </div>
      <div className="links">
        <ul className="flex items-center gap-15">
          <Link href={"/home"}>
            <li>Home</li>
          </Link>
          <Link href={"/lawyers"}>
            <li>Lawyers</li>
          </Link>
          <Link href={"/dashboard/client"}>
            <li>Dashboard</li>
          </Link>
        </ul>
      </div>
      <div className="logout">
        <Link href={"/login"}>login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
