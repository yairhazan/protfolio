import { useState } from 'react'
import { useLocation } from 'wouter'
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { signOutUser } from "@/lib/firebase"

export function Header() {
  const [, setLocation] = useLocation()
  const [notificationsActive, setNotificationsActive] = useState(false)

  const handleLogout = async () => {
    try {
      await signOutUser()
      setLocation('/login')
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive)
  }

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className={`text-gray-300 hover:text-green-500 transition-colors duration-300 ${
            notificationsActive ? 'bg-green-500 text-white hover:bg-green-600' : ''
          }`}
          onClick={toggleNotifications}
        >
          <Bell className={`h-5 w-5 ${notificationsActive ? 'animate-ring' : ''}`} />
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="text-gray-300 hover:text-green-500" onClick={() => setLocation('/profile')}>
          <User className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="text-gray-300 hover:text-green-500" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
