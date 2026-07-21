'use client'

import { Fragment, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMyAssets,
  getWalletAssets,
  getAssets,
  addWalletAsset,
  removeWalletAsset,
  updateWalletAssetPosition,
  getUsdBrlRate,
} from '@/lib/api'
import type { WalletAsset } from '@/lib/types'
import { useWalletStore } from '@/lib/stores/wallet-store'
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

const norm = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ').trim()

// Explicit mappings for tickers whose names differ between the broker export and the system catalogue.
// Key: norm(Excel ticker)  →  Value: norm(system ticket or name)
const TICKER_ALIASES: Record<string, string> = {
  'tesouro ipca 2045': 'tesouro ipca 2045',
  'tesouro ipca juros 2026': 'tesouro ipca com juros semestrais 2026',
  'tesouro ipca com juros semestrais 2026': 'tesouro ipca juros 2026',
  'tesouro prefixado com juros semestrais 2029': 'tesouro prefixado juros 2029',
}

export default function MyAssetsPage() {
  const queryClient = useQueryClient()
  const { selectedWalletId } = useWalletStore()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['my-assets', selectedWalletId],
    queryFn: () => selectedWalletId ? getWalletAssets(selectedWalletId) : getMyAssets(),
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
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<{ missing: string[]; file: File } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function closeImport() {
    setImportOpen(false)
    setPreview(null)
  }

  // Step 1: parse the file client-side and check tickets against the catalogue
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !selectedWalletId) return

    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer)

      const dataRows: unknown[][] = []
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
        if (sheetRows.length > 1) dataRows.push(...sheetRows.slice(1))
      }

      const missing: string[] = []
      for (const rawRow of dataRows) {
        const row = rawRow as unknown[]
        const rawTicket = String(row[0] ?? '').trim()
        if (!rawTicket) continue
        const ticketUpper = rawTicket.toUpperCase()
        const ticketNorm = norm(rawTicket)
        const patrimony = Number(row[6])
        if (!isNaN(patrimony) && patrimony === 0) continue

        const inWallet = items.some(
          (w) => w.assetTicket.toUpperCase() === ticketUpper || norm(w.assetTicket) === ticketNorm
        )
        if (inWallet) continue

        const alias = TICKER_ALIASES[ticketNorm]
        const inCatalogue = allAssets.some(
          (a) =>
            a.ticket.toUpperCase() === ticketUpper ||
            norm(a.ticket) === ticketNorm ||
            norm(a.name) === ticketNorm ||
            (alias != null && (norm(a.ticket) === alias || norm(a.name) === alias))
        )
        if (!inCatalogue) missing.push(rawTicket)
      }

      setPreview({ missing, file })
    } catch {
      toast.error('Failed to read file. Make sure it is a valid .xlsx file.')
    }
  }

  // Step 2: run the actual import using the already-parsed file
  async function runImport() {
    if (!preview?.file || !selectedWalletId) return
    const walletId = selectedWalletId

    setImporting(true)
    try {
      const buffer = await preview.file.arrayBuffer()
      const wb = XLSX.read(buffer)

      const dataRows: unknown[][] = []
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
        if (sheetRows.length > 1) dataRows.push(...sheetRows.slice(1))
      }

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
        const positionData = {
          quantity:    isNaN(Number(row[5])) ? undefined : Number(row[5]),
          mediumPrice: isNaN(Number(row[2])) ? undefined : Number(row[2]),
          currentPrice: isNaN(Number(row[3])) ? undefined : Number(row[3]),
        }

        const existing = items.find(
          (w) => w.assetTicket.toUpperCase() === ticketUpper || norm(w.assetTicket) === ticketNorm
        )

        if (!isNaN(patrimony) && patrimony === 0) {
          if (existing && existing.walletId != null)
            updateTasks.push(removeWalletAsset(existing.walletId, existing.id).then(() => existing))
          continue
        }

        if (existing && existing.walletId != null) {
          updated++
          updateTasks.push(updateWalletAssetPosition(existing.walletId, existing.id, positionData))
        } else {
          const alias = TICKER_ALIASES[ticketNorm]
          const asset = allAssets.find(
            (a) =>
              a.ticket.toUpperCase() === ticketUpper ||
              norm(a.ticket) === ticketNorm ||
              norm(a.name) === ticketNorm ||
              (alias != null && (norm(a.ticket) === alias || norm(a.name) === alias))
          )
          if (!asset) { notInSystem.push(rawTicket); continue }
          linked++
          try {
            const wa = await addWalletAsset(walletId, asset.id)
            updateTasks.push(updateWalletAssetPosition(walletId, wa.id, positionData))
          } catch {
            notInSystem.push(rawTicket)
          }
        }
      }

      await Promise.all(updateTasks)
      await queryClient.invalidateQueries({ queryKey: ['my-assets'] })

      const parts: string[] = []
      if (updated > 0) parts.push(`${updated} updated`)
      if (linked > 0) parts.push(`${linked} newly linked`)
      if (notInSystem.length > 0) parts.push(`${notInSystem.length} skipped (not in system)`)

      if (updated + linked > 0) {
        toast.success(parts.join(' · '))
      } else {
        toast.warning(parts.join(' · ') || 'No matching assets found in file.')
      }

      closeImport()
    } catch {
      toast.error('Failed to import. Make sure the backend is running.')
    } finally {
      setImporting(false)
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
                      <Fragment key={`cat-${category}`}>
                        <tr className="bg-muted/30">
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
                      </Fragment>
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
      <Dialog open={importOpen} onOpenChange={(open) => { if (!open) closeImport() }}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-sm">
            <DialogTitle>Import from Excel</DialogTitle>

            {!selectedWalletId ? (
              <>
                <p className="text-sm text-destructive mt-2">
                  No wallet selected. Select a wallet in the sidebar before importing.
                </p>
                <div className="flex justify-end mt-6">
                  <DialogClose render={<Button variant="outline">Close</Button>} />
                </div>
              </>
            ) : !preview ? (
              <>
                <p className="text-sm text-muted-foreground mt-1">
                  Tickers already in your portfolio will have their positions updated.
                  New tickers will be linked to the currently selected wallet.
                </p>
                <div className="flex gap-2 justify-end mt-6">
                  <DialogClose render={<Button variant="outline">Cancel</Button>} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
              </>
            ) : (
              <>
                {preview.missing.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-destructive">
                      {preview.missing.length} ticket{preview.missing.length !== 1 ? 's' : ''} not found in the system:
                    </p>
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-48 overflow-y-auto">
                      <ul className="space-y-1">
                        {preview.missing.map((t) => (
                          <li key={t} className="font-mono text-sm text-destructive">{t}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add them at <strong>/assets</strong> first, or proceed to import only the tickets already in the system.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    All tickets found in the system. Ready to import.
                  </p>
                )}
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" onClick={() => setPreview(null)}>
                    Back
                  </Button>
                  <Button onClick={runImport} disabled={importing}>
                    {importing ? 'Importing…' : preview.missing.length > 0 ? 'Proceed anyway' : 'Import'}
                  </Button>
                </div>
              </>
            )}
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
