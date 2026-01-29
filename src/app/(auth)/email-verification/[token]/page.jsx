"use client"
import React from 'react'
import { useParams } from 'next/navigation'
const page = () => {
    const params = useParams();
    const token=params.token;
  return (
    <div>
        <h1 className='text-foreground font-semibold text-2xl'>Congratulation your email has been verified.{token}</h1>
    </div>
  )
}

export default page