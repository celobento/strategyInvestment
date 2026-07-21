'use client'

import { ChevronsUpDown, Wallet, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getWallets } from '@/lib/api'
import { useWalletStore } from '@/lib/stores/wallet-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function WalletSwitcher() {
  const { isMobile, state } = useSidebar()
  const { selectedWalletId, setSelectedWalletId } = useWalletStore()

  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getWallets(),
  })

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) ?? null
  const displayName = selectedWallet?.name ?? 'StrategyInvest'
  const displaySub = selectedWallet ? 'Active wallet' : 'Select a wallet'

  const isCollapsed = !isMobile && state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              // base button look matching SidebarMenuButton size="lg"
              'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm',
              'outline-none ring-sidebar-ring transition-[width,height,padding]',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              'focus-visible:ring-2',
              'data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground',
              '[&_svg]:pointer-events-none [&_svg]:shrink-0',
              // size lg
              'h-12',
              // icon-only mode (collapsed sidebar)
              'group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center'
            )}
          >
            {/* Brand icon — always visible */}
            <div
              className="flex aspect-square size-8 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: '#00250c' }}
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6ba513"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>

            {/* Text — hidden when collapsed */}
            {!isCollapsed && (
              <>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-sidebar-foreground/50">{displaySub}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-60" />
              </>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile || !isCollapsed ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
            className="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Wallets</DropdownMenuLabel>

              {wallets.length === 0 ? (
                <DropdownMenuItem disabled>No wallets found</DropdownMenuItem>
              ) : (
                wallets.map((wallet) => {
                  const name = wallet.name ?? `Wallet #${wallet.id}`
                  const isSelected = wallet.id === selectedWalletId
                  return (
                    <DropdownMenuItem
                      key={wallet.id}
                      onClick={() => setSelectedWalletId(wallet.id)}
                      className="gap-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border border-sidebar-border bg-sidebar-accent/30 shrink-0">
                        <Wallet className="size-3.5 shrink-0" />
                      </div>
                      <span className="flex-1 truncate">{name}</span>
                      {isSelected && <Check className="size-4 shrink-0" style={{ color: '#6ba513' }} />}
                    </DropdownMenuItem>
                  )
                })
              )}
            </DropdownMenuGroup>

            {selectedWalletId !== null && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setSelectedWalletId(null)}
                    className="gap-2 text-muted-foreground"
                  >
                    View all wallets
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
