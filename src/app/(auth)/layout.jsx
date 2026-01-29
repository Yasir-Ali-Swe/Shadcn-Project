import React from 'react'

const layout = ({children}) => {
  return (
    <main className='w-screen h-screen flex justify-center items-center'>{children}</main>
  )
}

export default layout