"use client";
import React from "react";
import { useParams } from "next/navigation";

const page = () => {
  const { courtId } = useParams();
  return (
    <div className="h-full flex items-center justify-center">
      <h1 className="text-foreground text-2xl font-semibold">
        Admin court Detail Page for court id : {courtId}
      </h1>
    </div>
  );
};

export default page;
