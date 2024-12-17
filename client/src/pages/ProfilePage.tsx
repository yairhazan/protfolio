import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Edit2, Mail, User as UserIcon } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              <h1 className="text-3xl font-semibold text-gray-100 mb-6">Profile</h1>
              
              <div className="grid gap-6">
                {/* Profile Information */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center mb-6">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full border-2 border-green-500"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Name</p>
                            <p className="text-gray-100">{user?.displayName || 'Not set'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="text-gray-100">{user?.email || 'Not set'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-gray-400 hover:text-green-500 bg-gray-700 hover:bg-gray-600"
                      >
                        Change Password
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-gray-400 hover:text-green-500 bg-gray-700 hover:bg-gray-600"
                      >
                        Two-Factor Authentication
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-400 hover:text-red-500 bg-gray-700 hover:bg-gray-600"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 