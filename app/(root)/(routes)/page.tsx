import { UserButton } from '@clerk/nextjs'
import React from 'react'

const SetupPage = () => {
  return (
    <div>page
      <UserButton afterSignOutUrl='/' />

    </div>
  )
}

export default SetupPage