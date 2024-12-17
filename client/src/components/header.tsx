import { useState } from 'react'
import { useLocation } from 'wouter'
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { signOutUser } from "@/lib/firebase"

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const [, setLocation] = useLocation()
  const [notificationsActive, setNotificationsActive] = useState(false)

  const handleLogout = async () => {
    try {
      await signOutUser()
      setLocation('/')
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive)
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between py-3 px-4 sm:px-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-3">
        {children}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`hidden sm:flex text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950 ${
            notificationsActive ? 'bg-gray-950 text-green-500' : ''
          }`}
          onClick={toggleNotifications}
        >
          <Bell className={`h-5 w-5 ${notificationsActive ? 'animate-ring' : ''}`} />
        </Button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950"
          onClick={() => setLocation('/profile')}
        >
          <User className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
