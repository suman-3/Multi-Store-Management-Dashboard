import React from 'react'
import { BillBoardClient } from './_components/client'



const Billboards = () => {
  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillBoardClient/>
        </div>
    </div>
  )
}

export default Billboards