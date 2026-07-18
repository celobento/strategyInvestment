'use client'

import { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMyAssets,
  getWallets,
  getAssets,
  addWalletAsset,
  removeWalletAsset,
  updateWalletAssetPosition,
  getUsdBrlRate,
} from '@/lib/api'
import type { WalletAsset } from '@/lib/types'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function fmt(n?: number | null) {
  if (n == null) return '—'
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function diffColor(diff?: number | null) {
  if (diff == null) return 'text-muted-foreground'
  return diff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
}

const USD_ACRONYMS = new Set(['US', 'USA', 'EUA'])
const isUsd = (acronym?: string) => acronym != null && USD_ACRONYMS.has(acronym.toUpperCase())

export default function MyAssetsPage() {
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['my-assets'],
    queryFn: getMyAssets,
  })

  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getWallets(),
  })

  const { data: allAssets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })

  const { data: usdRate } = useQuery({
    queryKey: ['usd-brl-rate'],
    queryFn: getUsdBrlRate,
    staleTime: 5 * 60 * 1000, // refresh at most every 5 min
  })

  // Group by category
  const grouped = items.reduce<Record<string, WalletAsset[]>>((acc, wa) => {
    const key = wa.categoryName ?? 'Uncategorized'
    if (!acc[key]) acc[key] = []
    acc[key].push(wa)
    return acc
  }, {})

  // Grand totals
  const grandTotalBrl = items.reduce((sum, wa) => {
    const rate = isUsd(wa.countryAcronym) ? (usdRate ?? 1) : 1
    return sum + (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * rate
  }, 0)

  const grandTotalUsd = items.reduce((sum, wa) => {
    const rate = isUsd(wa.countryAcronym) ? 1 : 1 / (usdRate ?? 1)
    return sum + (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * rate
  }, 0)

  // ── Edit dialog ────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState<WalletAsset | null>(null)
  const [qty, setQty] = useState('')
  const [medPrice, setMedPrice] = useState('')
  const [curPrice, setCurPrice] = useState('')

  function openEdit(wa: WalletAsset) {
    setEditing(wa)
    setQty(wa.quantity != null ? String(wa.quantity) : '')
    setMedPrice(wa.mediumPrice != null ? String(wa.mediumPrice) : '')
    setCurPrice(wa.currentPrice != null ? String(wa.currentPrice) : '')
  }

  const updateMutation = useMutation({
    mutationFn: () =>
      updateWalletAssetPosition(editing!.walletId!, editing!.id, {
        quantity: qty !== '' ? Number(qty) : undefined,
        mediumPrice: medPrice !== '' ? Number(medPrice) : undefined,
        currentPrice: curPrice !== '' ? Number(curPrice) : undefined,
      }),
    onSuccess: () => {
      toast.success('Position updated')
      queryClient.invalidateQueries({ queryKey: ['my-assets'] })
      setEditing(null)
    },
    onError: () => toast.error('Failed to update position'),
  })

  // ── Import dialog ──────────────────────────────────────────────────────────
  const [importOpen, setImportOpen] = useState(false)
  const [importWalletId, setImportWalletId] = useState<string>('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !importWalletId) return
    const walletId = Number(importWalletId)

    setImporting(true)
    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer)

      // Collect data rows from all sheets (skip header row 0 per sheet)
      const dataRows: unknown[][] = []
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
        if (sheetRows.length > 1) dataRows.push(...sheetRows.slice(1))
      }

      // Normalize: lowercase, replace dashes/underscores with spaces
      // e.g. "tesouro-selic-2025" === "Tesouro Selic 2025"
      const norm = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ').trim()

      // columns: 0=ATIVO, 2=PREÇO MÉDIO, 3=PREÇO ATUAL, 5=QUANTIDADE
      const updateTasks: Promise<WalletAsset>[] = []
      let updated = 0
      let linked = 0
      const notInSystem: string[] = []

      for (const rawRow of dataRows) {
        const row = rawRow as unknown[]
        const rawTicket = String(row[0] ?? '').trim()
        if (!rawTicket) continue
        const ticketUpper = rawTicket.toUpperCase()
        const ticketNorm = norm(rawTicket)

        const patrimony = Number(row[6])
        const mediumPrice = Number(row[2])
        const currentPrice = Number(row[3])
        const quantity = Number(row[5])
        const positionData = {
          quantity: isNaN(quantity) ? undefined : quantity,
          mediumPrice: isNaN(mediumPrice) ? undefined : mediumPrice,
          currentPrice: isNaN(currentPrice) ? undefined : currentPrice,
        }

        // Match existing wallet-asset by ticket (exact) or normalized ticket/name
        const existing = items.find((w) =>
          w.assetTicket.toUpperCase() === ticketUpper ||
          norm(w.assetTicket) === ticketNorm
        )

        // PATRIMÔNIO ATUAL = 0 → remove if linked, skip if not
        if (!isNaN(patrimony) && patrimony === 0) {
          if (existing && existing.walletId != null) {
            updateTasks.push(
              removeWalletAsset(existing.walletId, existing.id).then(() => existing)
            )
          }
          continue
        }

        if (existing && existing.walletId != null) {
          // Already linked — just update position
          updated++
          updateTasks.push(updateWalletAssetPosition(existing.walletId, existing.id, positionData))
        } else {
          // Not linked yet — find in assets catalogue by ticket or name (normalized)
          const asset = allAssets.find((a) =>
            a.ticket.toUpperCase() === ticketUpper ||
            norm(a.ticket) === ticketNorm ||
            norm(a.name) === ticketNorm
          )
          if (!asset) {
            notInSystem.push(rawTicket)
            continue
          }
          linked++
          // Sequential: link first, then update position with the new wallet-asset id
          try {
            const wa = await addWalletAsset(walletId, asset.id)
            updateTasks.push(updateWalletAssetPosition(walletId, wa.id, positionData))
          } catch {
            // May already be linked (409) — try to refresh and match
            notInSystem.push(rawTicket)
          }
        }
      }

      await Promise.all(updateTasks)
      await queryClient.invalidateQueries({ queryKey: ['my-assets'] })

      const parts: string[] = []
      if (updated > 0) parts.push(`${updated} updated`)
      if (linked > 0) parts.push(`${linked} newly linked`)
      if (notInSystem.length > 0) parts.push(`${notInSystem.length} not in system: ${notInSystem.join(', ')}`)

      if (updated + linked > 0) {
        toast.success(parts.join(' · '))
      } else {
        toast.warning(parts.join(' · ') || 'No matching assets found in file.')
      }

      setImportOpen(false)
    } catch {
      toast.error('Failed to read file. Make sure it is a valid .xlsx file.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Assets</h1>
          <p className="text-muted-foreground text-sm mt-1">Portfolio overview grouped by category</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            Import Excel
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total in BRL</p>
            <p className="text-2xl font-bold tabular-nums">R$ {fmt(grandTotalBrl)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total in USD</p>
            <p className="text-2xl font-bold tabular-nums">
              {usdRate != null
                ? `$ ${grandTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">USD/BRL Rate</p>
            <p className="text-2xl font-bold tabular-nums">
              {usdRate != null
                ? usdRate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>
            {items.length} asset{items.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-6 text-center">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">
              No assets yet. Add assets to a wallet to see them here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Qty</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Med. Price</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cur. Price</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Diff</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cur. Value</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(grouped).map(([category, rows]) => {
                    const catTotal = rows.reduce((s, r) => {
                      const rate = isUsd(r.countryAcronym) ? (usdRate ?? 1) : 1
                      return s + (r.currentPrice ?? 0) * (r.quantity ?? 0) * rate
                    }, 0)
                    return (
                      <>
                        <tr key={`cat-${category}`} className="bg-muted/30">
                          <td className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {category}
                          </td>
                          <td colSpan={4} />
                          <td className="px-4 py-2 text-xs font-semibold tabular-nums text-right text-muted-foreground">
                            R$ {fmt(catTotal)}
                          </td>
                          <td />
                        </tr>

                        {rows.map((wa) => {
                          const rate = isUsd(wa.countryAcronym) ? (usdRate ?? 1) : 1

                          const medPriceBrl = wa.mediumPrice != null ? wa.mediumPrice * rate : null
                          const curPriceBrl = wa.currentPrice != null ? wa.currentPrice * rate : null

                          const diff =
                            curPriceBrl != null && medPriceBrl != null
                              ? curPriceBrl - medPriceBrl
                              : null
                          const diffPct =
                            diff != null && medPriceBrl != null && medPriceBrl !== 0
                              ? (diff / medPriceBrl) * 100
                              : null
                          const currentValue =
                            curPriceBrl != null && wa.quantity != null
                              ? curPriceBrl * wa.quantity
                              : null

                          return (
                            <tr key={wa.id} className="border-b last:border-0 hover:bg-muted/50">
                              <td className="py-3 px-4 pl-8">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold font-mono">
                                    {wa.assetTicket}
                                  </span>
                                  <span className="text-muted-foreground">{wa.assetName}</span>
                                  {isUsd(wa.countryAcronym) && (
                                    <span className="text-xs text-muted-foreground/60">USD</span>
                                  )}
                                  {wa.indicator && (
                                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
                                      wa.indicator === 'COMPRA'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                        : wa.indicator === 'VENDA'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                                    }`}>
                                      {wa.indicator}
                                    </span>
                                  )}
                                  {wa.ceilingPrice != null && (
                                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                                      Ceiling {isUsd(wa.countryAcronym)
                                        ? `$${wa.ceilingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : `R$ ${fmt(wa.ceilingPrice)}`}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {wa.quantity ?? '—'}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {medPriceBrl != null ? `R$ ${fmt(medPriceBrl)}` : '—'}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {curPriceBrl != null ? `R$ ${fmt(curPriceBrl)}` : '—'}
                              </td>
                              <td className={`py-3 px-4 text-right tabular-nums ${diffColor(diff)}`}>
                                {diff != null ? (
                                  <>
                                    {diff >= 0 ? '+' : ''}R$ {fmt(diff)}
                                    {diffPct != null && (
                                      <span className="block text-xs opacity-80">
                                        {diffPct >= 0 ? '+' : ''}{diffPct.toFixed(2)}%
                                      </span>
                                    )}
                                  </>
                                ) : '—'}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums font-semibold">
                                {currentValue != null ? `R$ ${fmt(currentValue)}` : '—'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => openEdit(wa)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                      if (wa.walletId != null) {
                                        removeWalletAsset(wa.walletId, wa.id).then(() => {
                                          queryClient.invalidateQueries({ queryKey: ['my-assets'] })
                                        })
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={5} className="px-4 py-3 text-sm font-semibold">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">
                      R$ {fmt(grandTotalBrl)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import dialog */}
      <Dialog open={importOpen} onOpenChange={(open) => { if (!open) setImportOpen(false) }}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-sm">
            <DialogTitle>Import from Excel</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Tickers already in your portfolio will have their positions updated.
              New tickers found in your assets catalogue will be linked to the selected wallet.
            </p>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Wallet for new assets</Label>
                <Select value={importWalletId} onValueChange={(v) => setImportWalletId(v ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a wallet">
                      {importWalletId
                        ? (wallets.find((w) => String(w.id) === importWalletId)?.name ?? `Wallet #${importWalletId}`)
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={String(w.id)}>
                        {w.name ?? `Wallet #${w.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImport}
                />
                <Button
                  disabled={!importWalletId || importing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {importing ? 'Importing...' : 'Choose File'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Edit position dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null) }}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-sm">
            <DialogTitle>
              Edit Position —{' '}
              <span className="font-mono text-primary">{editing?.assetTicket}</span>
            </DialogTitle>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-qty">Quantity</Label>
                <Input
                  id="edit-qty"
                  type="number"
                  min="0"
                  step="any"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-med">Medium Price (R$)</Label>
                <Input
                  id="edit-med"
                  type="number"
                  min="0"
                  step="0.01"
                  value={medPrice}
                  onChange={(e) => setMedPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cur">Current Price (R$)</Label>
                <Input
                  id="edit-cur"
                  type="number"
                  min="0"
                  step="0.01"
                  value={curPrice}
                  onChange={(e) => setCurPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
