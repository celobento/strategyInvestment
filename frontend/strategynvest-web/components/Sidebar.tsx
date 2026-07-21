'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Wallet,
  FileText,
  Package,
  Tag,
  LayoutGrid,
  Building2,
  Briefcase,
  Globe,
  Users,
  LogOut,
  BarChart2,
  Target,
  Layers,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { WalletSwitcher } from '@/components/WalletSwitcher'

const topItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'My Assets', href: '/my-assets', icon: TrendingUp },
  { label: 'Dividends', href: '/dividends', icon: DollarSign },
  { label: 'Wallets', href: '/wallets', icon: Wallet },
  { label: 'Revisions', href: '/revisions', icon: FileText },
  { label: 'Goals', href: '/goals', icon: Target },
]

const analysisItems = [
  { label: 'FII', href: '/analysisFii', icon: BarChart2 },
]

const settingsItems = [
  { label: 'Assets', href: '/assets', icon: Package },
  { label: 'Asset Types', href: '/asset-types', icon: Tag },
  { label: 'Categories', href: '/categories', icon: LayoutGrid },
  { label: 'Sectors', href: '/sectors', icon: Building2 },
  { label: 'Segments', href: '/segments', icon: Layers },
  { label: 'Brokers', href: '/brokers', icon: Briefcase },
  { label: 'Countries', href: '/countries', icon: Globe },
  { label: 'Users', href: '/users', icon: Users },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const initials = user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'

  return (
    <Sidebar collapsible="icon">
      {/* Wallet switcher */}
      <SidebarHeader>
        <WalletSwitcher />
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analysis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisItems.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user?.name ?? 'User'}>
              <Avatar className="h-7 w-7 rounded-lg">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#6ba513' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name ?? user?.email ?? 'User'}</span>
                {user?.email && (
                  <span className="truncate text-xs text-sidebar-foreground/50">{user.email}</span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={() => signOut({ callbackUrl: '/signin' })}
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
