'use client'

import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getReitsAnalysis, startReitsSync, getReitsSyncStatus } from '@/lib/api'
import type { ReitsAnalysis } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function fmtN(v?: number | null, decimals = 2) {
  if (v == null) return '—'
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtPct(v?: number | null) {
  if (v == null) return '—'
  return `${fmtN(v, 2)}%`
}

function fmtMarketCap(v?: number | null) {
  if (v == null) return '—'
  if (v >= 1_000_000_000) return `$${fmtN(v / 1_000_000_000, 2)}B`
  if (v >= 1_000_000)     return `$${fmtN(v / 1_000_000, 2)}M`
  if (v >= 1_000)         return `$${fmtN(v / 1_000, 2)}K`
  return `$${fmtN(v)}`
}

function yieldColor(y?: number | null) {
  if (y == null) return ''
  if (y >= 4) return 'text-green-600 font-semibold'
  return 'text-red-500 font-semibold'
}

export default function AnalysisReitsPage() {
  const [search, setSearch]           = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [syncStarted, setSyncStarted] = useState(false)

  const qc = useQueryClient()

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['reits-analysis'],
    queryFn: () => getReitsAnalysis(),
  })

  const { data: syncStatus } = useQuery({
    queryKey: ['reits-sync-status'],
    queryFn: getReitsSyncStatus,
    refetchInterval: (query) => query.state.data?.running ? 2000 : false,
    enabled: syncStarted,
  })

  const isSyncing = syncStatus?.running ?? false
  const isDone    = syncStarted && !isSyncing && syncStatus != null

  if (isDone && syncStatus) {
    qc.invalidateQueries({ queryKey: ['reits-analysis'] })
  }

  const startMut = useMutation({
    mutationFn: () => startReitsSync(),
    onSuccess: () => {
      setSyncStarted(true)
      qc.invalidateQueries({ queryKey: ['reits-sync-status'] })
    },
  })

  const sectors = [...new Set(rows.map((r) => r.sector).filter(Boolean))].sort() as string[]

  const filtered = rows.filter((r) => {
    const matchSearch = !search ||
      r.ticket.toLowerCase().includes(search.toLowerCase()) ||
      (r.sector ?? '').toLowerCase().includes(search.toLowerCase())
    const matchSector = !sectorFilter || r.sector === sectorFilter
    return matchSearch && matchSector
  })

  const pct = syncStatus && syncStatus.total > 0
    ? Math.round((syncStatus.processed / syncStatus.total) * 100)
    : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">REITs Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Real estate investment trust data from alreits.com</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            size="sm"
            onClick={() => { setSyncStarted(false); startMut.mutate() }}
            disabled={isSyncing || startMut.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing || startMut.isPending ? 'animate-spin' : ''}`} />
            {startMut.isPending ? 'Starting…' : isSyncing ? 'Syncing…' : 'Sync'}
          </Button>

          {isSyncing && syncStatus && (
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{syncStatus.processed} / {syncStatus.total} tickets</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {syncStatus.updated} updated · {syncStatus.failed} failed so far
              </p>
            </div>
          )}

          {isDone && syncStatus && (
            <div className={`flex items-start gap-1.5 text-sm px-3 py-2 rounded-md max-w-xs ${
              syncStatus.failed === 0
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {syncStatus.failed === 0
                ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium">
                  {syncStatus.updated} updated
                  {syncStatus.failed > 0 && `, ${syncStatus.failed} failed`}
                </p>
                {syncStatus.failedTickets.length > 0 && (
                  <p className="text-xs mt-0.5 break-all">
                    {syncStatus.failedTickets.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Search ticker or sector…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-52 text-sm"
        />
        <select
          className="h-8 rounded-md border border-input bg-background px-3 text-sm"
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
        >
          <option value="">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} REITs</span>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">REIT List</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <p className="text-muted-foreground text-sm p-6">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm p-6">No data found.</p>
          ) : (
            <Table className="text-sm whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10">Ticket</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Yield</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r: ReitsAnalysis) => (
                  <TableRow key={r.id}>
                    <TableCell className="sticky left-0 bg-background z-10 font-semibold">{r.ticket}</TableCell>
                    <TableCell className="text-muted-foreground">{r.sector ?? '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">${fmtN(r.valorAtual)}</TableCell>
                    <TableCell className={`text-right tabular-nums ${yieldColor(r.dividendYield)}`}>{fmtPct(r.dividendYield)}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmtMarketCap(r.marketCap)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
