import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import Users from './users'

interface SidebarItem {
  id: string
  label: string
}

function Settings() {
  const [activeTab, setActiveTab] = useState<string>('users')

  function sidebarItems(): SidebarItem[] {
    return [
      { id: 'users', label: 'Users' },
      { id: 'general', label: 'General' },
    ]
  }

  function renderGeneral() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general application settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            General settings content will go here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="md:container sm:mt-2 md:mt-4 lg:mt-16 mx-auto lg:max-w-4xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>
      <Separator className="my-6" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {sidebarItems().map((item: SidebarItem) => {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'users' && <Users />}
          {activeTab === 'general' && renderGeneral()}
        </div>
      </div>
    </div>
  )
}

export default Settings
