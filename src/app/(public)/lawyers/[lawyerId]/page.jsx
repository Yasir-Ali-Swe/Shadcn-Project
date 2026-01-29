"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
const page = () => {
    const params = useParams();
    const { lawyerId } = params;
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Button className={"rounded-full"}>Lawyers Detail Page for Lawyer Id {lawyerId}</Button>
    </div>
  )
}

export default page