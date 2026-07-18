'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  return email?.[0]?.toUpperCase() ?? 'U'
}

export default function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const initials = getInitials(user?.name, user?.email)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1" />

      {/* Avatar → user sheet */}
      <Sheet>
        <SheetTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-xs font-semibold text-white" style={{ backgroundColor: '#6ba513' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-64 p-0 flex flex-col"
          style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
        >
          <SheetHeader className="px-5 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-sm font-semibold text-white" style={{ backgroundColor: '#6ba513' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-sm truncate" style={{ color: 'var(--sidebar-foreground)' }}>
                  {user?.name ?? user?.email ?? 'User'}
                </SheetTitle>
                {user?.email && (
                  <p className="text-xs truncate" style={{ color: 'var(--sidebar-foreground)', opacity: 0.5 }}>
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </SheetHeader>

          <SheetFooter className="border-t border-sidebar-border mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => signOut({ callbackUrl: '/signin' })}
            >
              Sign Out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  )
}
