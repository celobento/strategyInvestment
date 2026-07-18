'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const topItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'My Assets', href: '/my-assets' },
  { label: 'Dividends', href: '/dividends' },
  { label: 'Wallets', href: '/wallets' },
  { label: 'Revisions', href: '/revisions' },
]

const settingsItems = [
  { label: 'Assets', href: '/assets' },
  { label: 'Asset Types', href: '/asset-types' },
  { label: 'Categories', href: '/categories' },
  { label: 'Sectors', href: '/sectors' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Countries', href: '/countries' },
  { label: 'Users', href: '/users' },
]

const settingsPaths = settingsItems.map((i) => i.href)

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const settingsActive = settingsPaths.some((p) => pathname.startsWith(p))
  const [settingsOpen, setSettingsOpen] = useState(settingsActive)

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="px-5 py-4 border-b border-sidebar-border">
        <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-widest mb-0.5">Admin</p>
        <h1 className="text-base font-bold text-sidebar-foreground">Strategy Invest</h1>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {topItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-5 py-2 text-sm transition-colors ${
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              {item.label}
            </Link>
          )
        })}

        {/* Settings group */}
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-5 py-2 text-sm transition-colors mt-1 ${
            settingsActive
              ? 'text-sidebar-accent-foreground font-medium'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
          }`}
        >
          <span>Settings</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {settingsOpen && (
          <div className="mt-0.5">
            {settingsItems.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center pl-9 pr-5 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {session?.user?.name ?? session?.user?.email ?? 'User'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => signOut({ callbackUrl: '/signin' })}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
