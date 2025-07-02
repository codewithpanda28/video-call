import { LoaderIcon } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <LoaderIcon className="w-12 h-12 animate-spin text-blue-500" />
      <span className="ml-2 text-lg text-gray-700">Loading...</span>
    </div>
  )
}
export default PageLoader
