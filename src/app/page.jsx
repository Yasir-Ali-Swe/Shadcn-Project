"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, []);
  return null;
};

export default page;
