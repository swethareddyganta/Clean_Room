'use client'
import React from 'react'
import { Button } from '../ui/button'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

function LogoutButton() {
    const router = useRouter();
    const handleLogout = () => {
        try {
            Cookies.remove("token");
            Cookies.remove("token");
            router.push("/?form=login");
            toast.success("Logout Successful!");
        } catch (error) {
            toast.error("Logout failed. Please try again!");
            
        }
    }
  return (
    <div>
      <Button onClick={handleLogout}> Logout </Button>
    </div>
  )
}

export default LogoutButton
