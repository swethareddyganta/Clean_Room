"use client"

import React from 'react'
import { Button } from './button'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { logoutUser } from '@/actions/users-mysql'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default", 
  className = "",
  showIcon = true 
}: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      
      // Call logout action
      const response = await logoutUser()
      
      if (response.success) {
        // Clear cookies
        Cookies.remove('token')
        Cookies.remove('role')
        
        // Show success message
        toast.success('Logged out successfully')
        
        // Redirect to home page
        router.push('/')
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during logout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  )
} 