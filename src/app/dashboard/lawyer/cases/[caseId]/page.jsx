"use client";
import React from "react";
import { useParams } from "next/navigation";

const page = () => {
  const { caseId } = useParams();
  return (
    <div className="h-full flex items-center justify-center">
      <h1 className="text-foreground text-2xl font-semibold">
        Lawyer Cases Detail Page for case id : {caseId}
      </h1>
    </div>
  );
};

export default page;
