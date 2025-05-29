'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  LayoutDashboard,
  Settings,
  LogOut 
} from 'lucide-react'

const accountNavigation = [
  {
    name: 'Dashboard',
    href: '/account-dashboard',
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  {
    name: 'Profile',
    href: '/account-profile',
    icon: User,
    description: 'Personal information and settings'
  },
  {
    name: 'Orders',
    href: '/account-orders',
    icon: ShoppingBag,
    description: 'Track your orders and history'
  },
  {
    name: 'Addresses',
    href: '/account-addresses',
    icon: MapPin,
    description: 'Manage delivery addresses'
  },
  {
    name: 'Wishlist',
    href: '/account-wishlist',
    icon: Heart,
    description: 'Your saved items'
  }
]

interface AccountSidebarProps {
  className?: string
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('w-64 bg-white border-r', className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">John Doe</div>
            <div className="text-sm text-gray-500">john@example.com</div>
          </div>
        </div>

        <nav className="space-y-1">
          {accountNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  {!isActive && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t">
          <button 
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
            onClick={() => {
              // Add logout logic here
              console.log('Logout')
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export function MobileAccountNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden bg-white border-b">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">John Doe</div>
            <div className="text-xs text-gray-500">john@example.com</div>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-1 pb-2">
          {accountNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
