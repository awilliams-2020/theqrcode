'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  QrCode, 
  Menu, 
  X, 
  User, 
  LogOut, 
  BarChart3, 
  LogIn,
  UserPlus,
  Settings,
  TrendingUp
} from 'lucide-react'
import NotificationBell from './NotificationBell'
import { useMatomo } from '@/hooks/useMatomo'
import { trackSignup } from '@/lib/matomo-tracking'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const matomo = useMatomo()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [router])

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleSignInClick = () => {
    matomo.trackEvent({
      category: 'CTA',
      action: 'click',
      name: 'signin-navbar'
    })
    router.push('/auth/signin')
  }

  const handleSignUpClick = () => {
    // Track comprehensive signup CTA click
    trackSignup.clickSignupCTA('Sign Up', 'navbar', 'home')
    
    // Also track with existing method for backward compatibility
    matomo.trackEvent({
      category: 'CTA',
      action: 'click',
      name: 'signup-navbar'
    })
    router.push('/auth/signup')
  }

  const navigationItems = (session ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ] : []).filter(item => item.href !== pathname)

  // Loading skeleton component
  const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - always visible */}
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                <QrCode className="h-8 w-8 text-blue-600" />
                <span className="hidden sm:block">TheQRCode</span>
              </button>
            </div>

            {/* Desktop Navigation Loading - only show if there would be navigation items */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Navigation skeleton is removed since we don't know if user will be authenticated */}
            </div>

            {/* Desktop Auth Section Loading */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                {/* Skeleton for auth buttons - matches Sign In/Sign Up structure */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                  <LoadingSkeleton className="h-4 w-4 rounded" />
                  <LoadingSkeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg">
                  <LoadingSkeleton className="h-4 w-4 rounded" />
                  <LoadingSkeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu Loading */}
          {isOpen && (
            <div ref={mobileMenuRef} className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
                {/* Mobile Navigation Items Loading - removed since we don't know if user will be authenticated */}

                {/* Mobile Auth Section Loading - matches real auth structure */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="space-y-2">
                    {/* Sign In button skeleton - matches real button structure */}
                    <div className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium rounded-lg">
                      <LoadingSkeleton className="h-5 w-5 rounded" />
                      <LoadingSkeleton className="h-5 w-16" />
                    </div>
                    {/* Sign Up button skeleton - matches real button structure */}
                    <div className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium rounded-lg">
                      <LoadingSkeleton className="h-5 w-5 rounded" />
                      <LoadingSkeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <QrCode className="h-8 w-8 text-blue-600" />
              <span className="hidden sm:block">TheQRCode</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <NotificationBell />
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden lg:block">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignInClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            {/* Mobile Navigation Items */}
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>{session.user?.name || session.user?.email}</span>
                    </div>
                    {/* Notification Bell for Mobile */}
                    <NotificationBell />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSignInClick}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-left text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
