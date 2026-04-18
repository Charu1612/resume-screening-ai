import { useState } from 'react'
import ProfileDropdown from './ProfileDropdown'

const TopNavbar = ({ jobTitle, companyName, showATSBadge = false }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {companyName && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {companyName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{jobTitle}</h2>
                <p className="text-sm text-gray-500">{companyName}</p>
              </div>
              {showATSBadge && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  ATS Match Report
                </span>
              )}
            </div>
          )}
        </div>
        
        <ProfileDropdown />
      </div>
    </div>
  )
}

export default TopNavbar