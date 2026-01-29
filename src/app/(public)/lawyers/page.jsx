import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Button className={"rounded-full"}>Lawyers Listing Page</Button>
      <Link href={"/lawyers/1123"} className="mt-4 text-blue-500 underline">
      Go to lawyer detail page for lawyer id 1123
      </Link>
    </div>
  )
}

export default page