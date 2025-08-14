import React from 'react'
import { LogoutButton } from "@/components/ui/logout-button"

function page() {
  return (
    <div>
      {/* Project Title Header */}
      <div className="text-center py-6 border-b border-border mb-6 relative">
        {/* Arrant Dynamics Logo - Top Left */}
        <div className="absolute top-6 left-6">
          <img 
            src="/Arrant Logo -1.jpg" 
            alt="Arrant Dynamics Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">STERI Clean Air - HVAC Matrix</h1>
        <p className="text-muted-foreground mt-2">Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd.</p>
        <p className="text-sm text-muted-foreground mt-1">Administrator Dashboard</p>
        
        {/* Logout Button - positioned in top right */}
        <div className="absolute top-6 right-6">
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-primary mb-4">Admin Dashboard</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">Project Reports</h3>
            <p className="text-muted-foreground">View and analyze project data</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">System Settings</h3>
            <p className="text-muted-foreground">Configure application settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
