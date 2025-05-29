'use client'

import { AccountSidebar, MobileAccountNav } from '@/components/account/account-sidebar'

interface AccountLayoutProps {
  children: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileAccountNav />
      
      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <AccountSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
