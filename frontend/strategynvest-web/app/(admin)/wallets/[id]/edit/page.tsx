'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import {
  getWalletById, updateWalletMinAssetPays,
  getWalletAssets, addWalletAsset, removeWalletAsset,
  getWalletStrategies, addWalletStrategy, updateWalletStrategy, removeWalletStrategy,
  getAssets, getCategories,
} from '@/lib/api'
import type { WalletStrategy } from '@/lib/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function WalletEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const walletId = Number(id)
  const queryClient = useQueryClient()

  // ── Wallet info ──────────────────────────────────────────────────────────────
  const { data: wallet } = useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () => getWalletById(walletId),
  })

  // ── Strategy tab ─────────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [addPercent, setAddPercent] = useState('')

  const [editingStrategy, setEditingStrategy] = useState<WalletStrategy | null>(null)
  const [editPercent, setEditPercent] = useState('')

  const { data: strategies = [] } = useQuery({
    queryKey: ['wallet-strategies', walletId],
    queryFn: () => getWalletStrategies(walletId),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const categoryItems = categories.map((c) => ({ value: String(c.id), label: c.name }))

  const addStrategyMutation = useMutation({
    mutationFn: () => addWalletStrategy(walletId, Number(selectedCategoryId), Number(addPercent)),
    onSuccess: () => {
      toast.success('Allocation added')
      queryClient.invalidateQueries({ queryKey: ['wallet-strategies', walletId] })
      setAddOpen(false)
      setSelectedCategoryId('')
      setAddPercent('')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? err.message ?? 'Unknown error'
      toast.error(`Failed to add: ${msg} (HTTP ${err.response?.status ?? 'network'})`)
    },
  })

  const editStrategyMutation = useMutation({
    mutationFn: () => updateWalletStrategy(walletId, editingStrategy!.id, Number(editPercent)),
    onSuccess: () => {
      toast.success('Percent updated')
      queryClient.invalidateQueries({ queryKey: ['wallet-strategies', walletId] })
      setEditingStrategy(null)
      setEditPercent('')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? err.message ?? 'Unknown error'
      toast.error(`Failed to update: ${msg} (HTTP ${err.response?.status ?? 'network'})`)
    },
  })

  const removeStrategyMutation = useMutation({
    mutationFn: (wsId: number) => removeWalletStrategy(walletId, wsId),
    onSuccess: () => {
      toast.success('Allocation removed')
      queryClient.invalidateQueries({ queryKey: ['wallet-strategies', walletId] })
    },
    onError: () => toast.error('Failed to remove allocation'),
  })

  const totalPercent = strategies.reduce((sum, s) => sum + Number(s.percent), 0)

  // ── Min asset pays field ──────────────────────────────────────────────────────
  const [minAssetPaysInput, setMinAssetPaysInput] = useState('')

  useEffect(() => {
    if (wallet?.minAssetPays != null) {
      setMinAssetPaysInput(Number(wallet.minAssetPays).toFixed(2))
    }
  }, [wallet?.minAssetPays])

  const minAssetPaysMutation = useMutation({
    mutationFn: () => {
      const val = minAssetPaysInput.trim() === '' ? null : Number(minAssetPaysInput)
      return updateWalletMinAssetPays(walletId, val)
    },
    onSuccess: () => {
      toast.success('Saved')
      queryClient.invalidateQueries({ queryKey: ['wallet', walletId] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
    onError: () => toast.error('Failed to save'),
  })

  // Group by country (from category.countryName)
  const grouped = strategies.reduce<Record<string, WalletStrategy[]>>((acc, s) => {
    const key = s.countryName ?? 'No country'
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  // ── Assets tab ───────────────────────────────────────────────────────────────
  const [assetOpen, setAssetOpen] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [assetSearch, setAssetSearch] = useState('')

  const { data: walletAssets = [] } = useQuery({
    queryKey: ['wallet-assets', walletId],
    queryFn: () => getWalletAssets(walletId),
  })

  const { data: allAssets = [] } = useQuery({
    queryKey: ['assets', assetSearch],
    queryFn: () => getAssets(assetSearch || undefined),
    enabled: assetOpen,
  })

  const assetItems = allAssets.map((a) => ({ value: String(a.id), label: `${a.ticket} — ${a.name}` }))

  const addAssetMutation = useMutation({
    mutationFn: () => addWalletAsset(walletId, Number(selectedAssetId)),
    onSuccess: () => {
      toast.success('Asset added to wallet')
      queryClient.invalidateQueries({ queryKey: ['wallet-assets', walletId] })
      setAssetOpen(false)
      setSelectedAssetId('')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? err.message ?? 'Unknown error'
      toast.error(`Failed to add asset: ${msg} (HTTP ${err.response?.status ?? 'network'})`)
    },
  })

  const removeAssetMutation = useMutation({
    mutationFn: (waId: number) => removeWalletAsset(walletId, waId),
    onSuccess: () => {
      toast.success('Asset removed')
      queryClient.invalidateQueries({ queryKey: ['wallet-assets', walletId] })
    },
    onError: () => toast.error('Failed to remove asset'),
  })

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/wallets" className="text-sm text-muted-foreground hover:text-foreground">
          ← Wallets
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{wallet?.name ?? `Wallet #${walletId}`}</span>
      </div>

      <Tabs defaultValue="strategy">
        <TabsList>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        {/* ── STRATEGY TAB ──────────────────────────────────────────────────── */}
        <TabsContent value="strategy">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Allocation Strategy</CardTitle>
                <CardDescription>Target % per category — total: {totalPercent.toFixed(2)}%</CardDescription>
              </div>

              {/* Add dialog */}
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger render={<Button size="sm">+ Add Allocation</Button>} />
                <DialogPortal>
                  <DialogOverlay />
                  <DialogContent className="max-w-sm">
                    <DialogTitle>New Allocation</DialogTitle>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={selectedCategoryId} onValueChange={(v) => setSelectedCategoryId(v ?? '')} items={categoryItems}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryItems.map((c) => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-percent">Percent (%)</Label>
                        <Input
                          id="add-percent"
                          type="number"
                          min="0.01"
                          max="100"
                          step="0.01"
                          value={addPercent}
                          onChange={(e) => setAddPercent(e.target.value)}
                          placeholder="e.g. 30"
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button
                          onClick={() => addStrategyMutation.mutate()}
                          disabled={!selectedCategoryId || !addPercent || addStrategyMutation.isPending}
                        >
                          {addStrategyMutation.isPending ? 'Adding...' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </CardHeader>

            {/* Edit percent dialog (controlled via state, no trigger) */}
            <Dialog
              open={!!editingStrategy}
              onOpenChange={(open) => { if (!open) { setEditingStrategy(null); setEditPercent('') } }}
            >
              <DialogPortal>
                <DialogOverlay />
                <DialogContent className="max-w-sm">
                  <DialogTitle>Edit Percent — {editingStrategy?.categoryName}{editingStrategy?.countryAcronym ? ` - ${editingStrategy.countryAcronym}` : ''}</DialogTitle>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-percent">New Percent (%)</Label>
                      <Input
                        id="edit-percent"
                        type="number"
                        min="0.01"
                        max="100"
                        step="0.01"
                        value={editPercent}
                        onChange={(e) => setEditPercent(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <DialogClose render={<Button variant="outline">Cancel</Button>} />
                      <Button
                        onClick={() => editStrategyMutation.mutate()}
                        disabled={!editPercent || editStrategyMutation.isPending}
                      >
                        {editStrategyMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>

            <CardContent>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Label htmlFor="min-asset-pays" className="whitespace-nowrap text-sm font-medium">
                  Each asset pays at least:
                </Label>
                <Input
                  id="min-asset-pays"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minAssetPaysInput}
                  onChange={(e) => setMinAssetPaysInput(e.target.value)}
                  placeholder="0.00"
                  className="w-36"
                />
                <Button
                  size="sm"
                  onClick={() => minAssetPaysMutation.mutate()}
                  disabled={minAssetPaysMutation.isPending}
                >
                  {minAssetPaysMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>

              {strategies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No allocations yet. Click &quot;+ Add Allocation&quot; to define your strategy.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Target %</th>
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(grouped).map(([country, rows]) => {
                      const countryTotal = rows.reduce((sum, s) => sum + Number(s.percent), 0)
                      return (
                      <>
                        <tr key={`group-${country}`} className="bg-muted/30">
                          <td className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {country}
                          </td>
                          <td className="px-4 py-2 text-xs font-semibold tabular-nums text-right text-muted-foreground">
                            {countryTotal.toFixed(2)}%
                          </td>
                          <td />
                        </tr>
                        {rows.map((s) => (
                          <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium pl-8">{s.categoryName}</td>
                            <td className="py-3 px-4 text-right tabular-nums font-semibold">
                              {Number(s.percent).toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setEditingStrategy(s); setEditPercent(String(s.percent)) }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => removeStrategyMutation.mutate(s.id)}
                                  disabled={removeStrategyMutation.isPending}
                                >
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                      )
                    })}
                  </tbody>
                  {totalPercent !== 100 && (
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="px-4 pt-3 text-xs text-muted-foreground">
                          {totalPercent > 100
                            ? `⚠ Total exceeds 100% by ${(totalPercent - 100).toFixed(2)}%`
                            : `ℹ ${(100 - totalPercent).toFixed(2)}% still unallocated`}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ASSETS TAB ────────────────────────────────────────────────────── */}
        <TabsContent value="assets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Wallet Assets</CardTitle>
                <CardDescription>{walletAssets.length} asset{walletAssets.length !== 1 ? 's' : ''} in this wallet</CardDescription>
              </div>

              <Dialog open={assetOpen} onOpenChange={setAssetOpen}>
                <DialogTrigger render={<Button size="sm">+ Add Asset</Button>} />
                <DialogPortal>
                  <DialogOverlay />
                  <DialogContent className="max-w-sm">
                    <DialogTitle>Add Asset to Wallet</DialogTitle>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Search &amp; Select Asset</Label>
                        <Input
                          placeholder="Search by name..."
                          value={assetSearch}
                          onChange={(e) => setAssetSearch(e.target.value)}
                        />
                        <Select value={selectedAssetId} onValueChange={(v) => setSelectedAssetId(v ?? '')} items={assetItems}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                          <SelectContent>
                            {assetItems.map((a) => (
                              <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button
                          onClick={() => addAssetMutation.mutate()}
                          disabled={!selectedAssetId || addAssetMutation.isPending}
                        >
                          {addAssetMutation.isPending ? 'Adding...' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </CardHeader>

            <CardContent>
              {walletAssets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No assets yet. Click &quot;+ Add Asset&quot; to add one.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ticker</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sector</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Country</th>
                        <th className="py-3 px-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {walletAssets.map((wa) => (
                        <tr key={wa.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold font-mono">
                              {wa.assetTicket}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">{wa.assetName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{wa.categoryName ?? '—'}</td>
                          <td className="py-3 px-4 text-muted-foreground">{wa.sectorName ?? '—'}</td>
                          <td className="py-3 px-4 text-muted-foreground">{wa.countryAcronym ?? '—'}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" render={<Link href={`/assets/${wa.assetId}/edit`} />}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeAssetMutation.mutate(wa.id)}
                                disabled={removeAssetMutation.isPending}
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
