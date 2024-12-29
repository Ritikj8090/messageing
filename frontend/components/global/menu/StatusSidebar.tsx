import { AddIcon, MenuIcon } from '@/svgs'
import React from 'react'

const StatusSidebar = () => {
  return (
    <div className=' min-h-screen min-w-[250px] border-r'>
      <div className=' flex justify-between items-center mx-2 my-4'>
        <h1 className=' text-2xl font-bold'>Status</h1>
        <div className=" flex items-center gap-2">
                  <span><AddIcon width="25" height="25" /></span>
                  <span><MenuIcon width="25" height="25"/></span>
                </div>
      </div>
    </div>
  )
}

export default StatusSidebar