'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssets, deleteAsset, updateAssetRecommendation } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AssetsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets', search],
    queryFn: () => getAssets(search || undefined),
  })

  // Always fetch all assets for recommendation import lookup
  const { data: allAssets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAsset(id),
    onSuccess: () => {
      toast.success('Asset deleted')
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
    onError: () => toast.error('Failed to delete asset'),
  })

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete asset "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  // ── Import Recommendations ─────────────────────────────────────────────────
  const [importingRec, setImportingRec] = useState(false)
  const recFileInputRef = useRef<HTMLInputElement>(null)

  async function handleImportRecommendations(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportingRec(true)
    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer)

      // columns: 0=Ticker, 3=Current Price (skip), 4=Ceiling Price, 5=Estimated NAV, 6=Premium/Discount, 7=Indicator
      const tasks: Promise<unknown>[] = []
      let updated = 0
      const notFound: string[] = []

      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as unknown[]
          const ticket = String(row[0] ?? '').trim().toUpperCase()
          if (!ticket) continue

          const stripCurrency = (v: unknown) => {
            const s = String(v ?? '').replace(/[$R,\s]/g, '')
            const n = Number(s)
            return isNaN(n) ? undefined : n
          }

          const ceilingPrice   = stripCurrency(row[4])
          const navEstimated   = stripCurrency(row[5])
          const premiumDiscount = stripCurrency(row[6])
          const indicator      = String(row[7] ?? '').trim().toUpperCase() || undefined

          const asset = allAssets.find((a) => a.ticket.toUpperCase() === ticket)
          if (!asset) { notFound.push(ticket); continue }

          updated++
          tasks.push(updateAssetRecommendation(asset.id, { ceilingPrice, navEstimated, premiumDiscount, indicator }))
        }
      }

      await Promise.all(tasks)
      await queryClient.invalidateQueries({ queryKey: ['assets'] })
      await queryClient.invalidateQueries({ queryKey: ['my-assets'] })

      const parts: string[] = []
      if (updated > 0) parts.push(`${updated} asset${updated !== 1 ? 's' : ''} updated`)
      if (notFound.length > 0) parts.push(`${notFound.length} not found: ${notFound.join(', ')}`)
      toast.success(parts.join(' · ') || 'No data imported.')
    } catch {
      toast.error('Failed to read recommendations file.')
    } finally {
      setImportingRec(false)
      e.target.value = ''
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage investment assets</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={recFileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportRecommendations}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={importingRec}
            onClick={() => recFileInputRef.current?.click()}
          >
            {importingRec ? 'Importing…' : 'Import Recommendations'}
          </Button>
          <Button asChild>
            <Link href="/assets/new">+ New Asset</Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
          className="max-w-sm"
        />
        <Button variant="secondary" onClick={() => setSearch(searchInput)}>Search</Button>
        {search && (
          <Button variant="ghost" onClick={() => { setSearchInput(''); setSearch('') }}>Clear</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
          <CardDescription>
            {assets ? `${assets.length} result${assets.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !assets?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No assets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ticker</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sector</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Income Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.id}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold font-mono">
                          {a.ticket}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{a.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{a.category?.name ?? '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{a.sector?.name ?? '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{a.country?.acronym ?? '—'}</td>
                      <td className="py-3 px-4">
                        {a.incomeType ? (
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            a.incomeType === 'FIXED'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {a.incomeType === 'FIXED' ? 'Fixed' : 'Variable'}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{a.assetType?.name ?? '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/assets/${a.id}/edit`}>Edit</Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(a.id, a.name)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
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
    </div>
  )
}
