"use client"
import React from 'react'
import { useParams } from 'next/navigation'
const page = () => {
    const { proposalId } = useParams();
  return (
    <div className='h-full flex items-center justify-center'>
        <h1 className='text-foreground text-2xl font-semibold'>Proposal details for proposal ID: {proposalId}</h1>
    </div>
  )
}

export default page