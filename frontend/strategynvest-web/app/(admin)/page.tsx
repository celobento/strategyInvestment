'use client'

import { useQuery } from '@tanstack/react-query'
import { useWalletStore } from '@/lib/stores/wallet-store'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { getMyAssets, getWalletAssets, getUsdBrlRate, getWalletStrategies, getDividendEntries } from '@/lib/api'
import type { WalletAsset, WalletStrategy, DividendEntry } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler)

// Brand palette + harmonious extensions
const COLORS = [
  '#6ba513', // primary green
  '#b7a674', // gold
  '#4d7a0e', // medium green
  '#d4a843', // amber gold
  '#00250c', // dark green
  '#a0c060', // yellow-green
  '#8b7040', // dark gold
  '#5e8a2e', // forest green
  '#c8b47a', // light tan
  '#2d5a1b', // deep forest
]

const ARCA_COLORS: Record<string, string> = {
  'A · Stocks':        '#6ba513',
  'R · Receivables':   '#b7a674',
  'C · Cash':          '#00250c',
  'A · International': '#8bc34a',
}

const USD_ACRONYMS = new Set(['US', 'USA', 'EUA'])
const isUsd = (a?: string) => a != null && USD_ACRONYMS.has(a.toUpperCase())

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtUsd(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function currentValueBrl(wa: WalletAsset, rate: number) {
  const r = isUsd(wa.countryAcronym) ? rate : 1
  return (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * r
}

function groupBy(
  items: WalletAsset[],
  key: (wa: WalletAsset) => string,
  rate: number
): { name: string; value: number }[] {
  const map = new Map<string, number>()
  for (const wa of items) {
    const k = key(wa) || 'N/A'
    map.set(k, (map.get(k) ?? 0) + currentValueBrl(wa, rate))
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function arcaLabel(wa: WalletAsset): string {
  const cat     = (wa.categoryName  ?? '').toLowerCase()
  const country = (wa.countryAcronym ?? '').toUpperCase()

  if (country && country !== 'BR') return 'A · International'
  if (cat.includes('fii') || cat.includes('fiagro')) return 'R · Receivables'
  if (cat.includes('tesouro') || wa.assetTicket.toLowerCase().includes('tesouro')) return 'C · Cash'
  return 'A · Stocks'
}

function arcaGroupBy(items: WalletAsset[], rate: number): { name: string; value: number }[] {
  const order = ['A · Stocks', 'R · Receivables', 'C · Cash', 'A · International']
  const map = new Map<string, number>()
  for (const wa of items) {
    const k = arcaLabel(wa)
    map.set(k, (map.get(k) ?? 0) + currentValueBrl(wa, rate))
  }
  return order.map((name) => ({ name, value: map.get(name) ?? 0 }))
}

interface ChartCardProps {
  title: string
  data: { name: string; value: number }[]
  total: number
  colorMap?: Record<string, string>
}

function ChartCard({ title, data, total, colorMap }: ChartCardProps) {
  const colors = data.map((d, i) => colorMap?.[d.name] ?? COLORS[i % COLORS.length])

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: colors,
      borderColor: '#fff',
      borderWidth: 2,
    }],
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-48 h-48 shrink-0">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` R$ ${fmt(ctx.raw as number)}`,
                    },
                  },
                },
              }}
            />
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            {data.map((entry, i) => {
              const pct = total > 0 ? (entry.value / total) * 100 : 0
              return (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: colors[i] }}
                  />
                  <span className="flex-1 truncate text-muted-foreground">{entry.name}</span>
                  <span className="tabular-nums font-medium">R$ {fmt(entry.value)}</span>
                  <span className="tabular-nums text-muted-foreground text-xs w-12 text-right">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type GroupMode = 'category' | 'country'

function buildComparisonData(
  strategies: WalletStrategy[],
  items: WalletAsset[],
  usdRate: number,
  mode: GroupMode
) {
  const totalBrl = items.reduce((s, wa) => s + currentValueBrl(wa, usdRate), 0)

  const assetKey = (wa: WalletAsset) =>
    mode === 'category'
      ? (wa.categoryName ?? 'Uncategorized')
      : (wa.countryAcronym ?? 'Unknown')

  const strategyKey = (s: WalletStrategy) =>
    mode === 'category' ? s.categoryName : (s.countryAcronym ?? 'Unknown')

  const actualMap = new Map<string, number>()
  for (const wa of items) {
    const k = assetKey(wa)
    actualMap.set(k, (actualMap.get(k) ?? 0) + currentValueBrl(wa, usdRate))
  }
  const actualPct = new Map<string, number>()
  actualMap.forEach((v, k) => actualPct.set(k, totalBrl > 0 ? (v / totalBrl) * 100 : 0))

  const plannedPct = new Map<string, number>()
  for (const s of strategies) {
    const k = strategyKey(s)
    plannedPct.set(k, (plannedPct.get(k) ?? 0) + s.percent)
  }

  const allKeys = Array.from(new Set([...plannedPct.keys(), ...actualPct.keys()])).sort()

  return allKeys.map((name) => ({
    name,
    planned: parseFloat((plannedPct.get(name) ?? 0).toFixed(2)),
    actual: parseFloat((actualPct.get(name) ?? 0).toFixed(2)),
  }))
}

function AllocationComparisonChart({ walletId, items, usdRate, mode }: {
  walletId: number
  items: WalletAsset[]
  usdRate: number
  mode: GroupMode
}) {
  const { data: strategies = [] } = useQuery({
    queryKey: ['wallet-strategies', walletId],
    queryFn: () => getWalletStrategies(walletId),
    enabled: walletId > 0,
  })

  const rows = buildComparisonData(strategies, items, usdRate, mode)

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-6 text-center">
        No strategy or portfolio data to compare.
      </p>
    )
  }

  const chartData = {
    labels: rows.map(r => r.name),
    datasets: [
      {
        label: 'Planned',
        data: rows.map(r => r.planned),
        backgroundColor: '#4d7a0e',
        borderRadius: 3,
        maxBarThickness: 40,
      },
      {
        label: 'Actual',
        data: rows.map(r => r.actual),
        backgroundColor: '#b7a674',
        borderRadius: 3,
        maxBarThickness: 40,
      },
    ],
  }

  return (
    <div style={{ height: 320 }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.raw as number).toFixed(1)}%`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: { size: 11 },
                maxRotation: 35,
                minRotation: 35,
              },
              grid: { display: false },
            },
            y: {
              ticks: {
                font: { size: 11 },
                callback: (v) => `${v}%`,
              },
              grid: { color: 'rgba(0,0,0,0.06)' },
            },
          },
        }}
      />
    </div>
  )
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function DividendPieChart({ dividends, usdRate }: { dividends: DividendEntry[]; usdRate: number }) {
  const map = new Map<string, number>()
  for (const d of dividends) {
    const brl = d.currency === 'USD' ? d.value * usdRate : d.value
    map.set(d.category, (map.get(d.category) ?? 0) + brl)
  }
  const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, v]) => s + v, 0)
  const colors = entries.map((_, i) => COLORS[i % COLORS.length])

  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm py-6 text-center">No dividend data yet.</p>
  }

  const chartData = {
    labels: entries.map(([k]) => k),
    datasets: [{
      data: entries.map(([, v]) => v),
      backgroundColor: colors,
      borderColor: '#fff',
      borderWidth: 2,
    }],
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-full sm:w-44 h-44 shrink-0">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => ` R$ ${fmt(ctx.raw as number)}` } },
            },
          }}
        />
      </div>
      <div className="flex-1 space-y-1.5 min-w-0">
        {entries.map(([name, value], i) => (
          <div key={name} className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: colors[i] }} />
            <span className="flex-1 truncate text-muted-foreground">{name}</span>
            <span className="tabular-nums font-medium">R$ {fmt(value)}</span>
            <span className="tabular-nums text-muted-foreground text-xs w-12 text-right">
              {total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DividendLineChart({ dividends, usdRate, year }: { dividends: DividendEntry[]; usdRate: number; year: number }) {
  const monthlyTotals = Array(12).fill(0)
  for (const d of dividends) {
    if (d.year === year) {
      const brl = d.currency === 'USD' ? d.value * usdRate : d.value
      monthlyTotals[d.month - 1] += brl
    }
  }

  const nonZero = monthlyTotals.filter((v) => v > 0)
  const avg = nonZero.length > 0 ? nonZero.reduce((s, v) => s + v, 0) / nonZero.length : 0

  const chartData = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: `Dividends ${year} (BRL)`,
        data: monthlyTotals,
        borderColor: '#6ba513',
        backgroundColor: 'rgba(107, 165, 19, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#6ba513',
        order: 1,
      },
      ...(avg > 0 ? [{
        label: `Avg R$ ${fmt(avg)}`,
        data: Array(12).fill(avg),
        borderColor: '#b7a674',
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        borderWidth: 1.5,
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 0,
      }] : []),
    ],
  }

  return (
    <div style={{ height: 280 }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: avg > 0,
              position: 'bottom' as const,
              labels: { font: { size: 11 }, boxWidth: 14, padding: 10 },
            },
            tooltip: { callbacks: { label: (ctx) => ` R$ ${fmt(ctx.raw as number)}` } },
          },
          scales: {
            x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            y: {
              ticks: { font: { size: 11 }, callback: (v) => `R$ ${fmt(Number(v))}` },
              grid: { color: 'rgba(0,0,0,0.06)' },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}

// Categories that come from US/International assets
const US_CATEGORY_PATTERNS = ['stock', 'reit', 'etf', 'exterior', 'internacional', 'international']
const isDividendUS = (cat: string) => {
  const c = cat.toLowerCase()
  return US_CATEGORY_PATTERNS.some((p) => c.includes(p))
}

function DividendOriginChart({ dividends, usdRate }: { dividends: DividendEntry[]; usdRate: number }) {
  let brTotal = 0
  let usTotal = 0
  for (const d of dividends) {
    const brl = d.currency === 'USD' ? d.value * usdRate : d.value
    if (isDividendUS(d.category)) usTotal += brl
    else brTotal += brl
  }

  const total = brTotal + usTotal
  if (total === 0) {
    return <p className="text-muted-foreground text-sm py-6 text-center">No dividend data yet.</p>
  }

  const data = [
    { label: 'BR', value: brTotal,  color: '#6ba513' },
    { label: 'US', value: usTotal, color: '#b7a674' },
  ]

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.value),
      backgroundColor: data.map((d) => d.color),
      borderColor: '#fff',
      borderWidth: 2,
    }],
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-full sm:w-44 h-44 shrink-0">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => ` R$ ${fmt(ctx.raw as number)}` } },
            },
          }}
        />
      </div>
      <div className="flex-1 space-y-1.5 min-w-0 pt-2">
        {data.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
            <span className="flex-1 text-muted-foreground">{entry.label}</span>
            <span className="tabular-nums font-medium">R$ {fmt(entry.value)}</span>
            <span className="tabular-nums text-muted-foreground text-xs w-12 text-right">
              {total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DividendLineByCategoryChart({ dividends, usdRate, year }: {
  dividends: DividendEntry[]
  usdRate: number
  year: number
}) {
  const yearDivs = dividends.filter((d) => d.year === year)
  const categories = [...new Set(yearDivs.map((d) => d.category))].sort()

  if (categories.length === 0) {
    return <p className="text-muted-foreground text-sm py-6 text-center">No dividend data for {year}.</p>
  }

  const datasets = categories.map((cat, i) => {
    const monthly = Array(12).fill(0)
    for (const d of yearDivs) {
      if (d.category === cat) {
        monthly[d.month - 1] += d.currency === 'USD' ? d.value * usdRate : d.value
      }
    }
    const color = COLORS[i % COLORS.length]
    return {
      label: cat,
      data: monthly,
      borderColor: color,
      backgroundColor: 'transparent',
      tension: 0.35,
      pointRadius: 3,
      pointBackgroundColor: color,
      borderWidth: 2,
    }
  })

  return (
    <div style={{ height: 300 }}>
      <Line
        data={{ labels: MONTH_LABELS, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, boxWidth: 12, padding: 10 },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: R$ ${fmt(ctx.raw as number)}`,
              },
            },
          },
          scales: {
            x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            y: {
              ticks: { font: { size: 11 }, callback: (v) => `R$ ${fmt(Number(v))}` },
              grid: { color: 'rgba(0,0,0,0.06)' },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}

export default function DashboardPage() {
  const { selectedWalletId } = useWalletStore()
  const currentYear = new Date().getFullYear()

  const { data: items = [], isLoading, isFetching } = useQuery({
    queryKey: ['my-assets', selectedWalletId],
    queryFn: () => selectedWalletId ? getWalletAssets(selectedWalletId) : getMyAssets(),
    placeholderData: (prev) => prev,
  })

  const { data: usdRate = 1 } = useQuery({
    queryKey: ['usd-brl-rate'],
    queryFn: getUsdBrlRate,
    staleTime: 5 * 60 * 1000,
  })

  const { data: dividends = [] } = useQuery({
    queryKey: ['dividend-entries', selectedWalletId],
    queryFn: () => getDividendEntries(selectedWalletId ? { walletId: selectedWalletId } : {}),
    placeholderData: (prev) => prev,
  })

  const totalBrl = items.reduce((s, wa) => s + currentValueBrl(wa, usdRate), 0)
  const totalUsd = items.reduce((s, wa) => {
    const r = isUsd(wa.countryAcronym) ? 1 : 1 / usdRate
    return s + (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * r
  }, 0)

  const byCategory  = groupBy(items, (wa) => wa.categoryName ?? 'Uncategorized', usdRate)
  const byCountry   = groupBy(items, (wa) => wa.countryAcronym ?? 'Unknown', usdRate)
  const byIncome    = groupBy(
    items,
    (wa) => wa.incomeType === 'FIXED' ? 'Fixed' : wa.incomeType === 'VARIABLE' ? 'Variable' : 'N/A',
    usdRate
  )
  const byAssetType  = groupBy(items, (wa) => wa.assetTypeName ?? 'N/A', usdRate)
  const bySegment    = groupBy(items, (wa) => wa.segmentName ?? 'N/A', usdRate)
  const bySector     = groupBy(items, (wa) => wa.sectorName  ?? 'N/A', usdRate)
  const reitItems    = items.filter((wa) => wa.categoryName?.toLowerCase().includes('reit'))
  const byAssetTypeReit = groupBy(reitItems, (wa) => wa.assetTypeName ?? 'N/A', usdRate)
  const bySectorReit    = groupBy(reitItems, (wa) => wa.sectorName    ?? 'N/A', usdRate)
  const totalBrlReit = reitItems.reduce((s, wa) => s + currentValueBrl(wa, usdRate), 0)
  const totalUsdReit = reitItems.reduce((s, wa) => {
    const r = isUsd(wa.countryAcronym) ? 1 : 1 / usdRate
    return s + (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * r
  }, 0)
  const byArca      = arcaGroupBy(items, usdRate)

  if (isLoading && items.length === 0) {
    return <div className="p-6"><p className="text-muted-foreground text-sm">Loading...</p></div>
  }

  return (
    <div className={`p-6 space-y-6 ${isFetching ? 'opacity-80 transition-opacity' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {selectedWalletId ? 'Showing data for selected wallet' : 'All wallets · Select a wallet in the sidebar to filter'}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Assets</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total in BRL</p>
            <p className="text-2xl font-bold tabular-nums">R$ {fmt(totalBrl)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total in USD</p>
            <p className="text-2xl font-bold tabular-nums">$ {fmtUsd(totalUsd)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">USD/BRL Rate</p>
            <p className="text-2xl font-bold tabular-nums">
              {usdRate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy vs actual allocation */}
      {selectedWalletId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Strategy vs Actual — By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <AllocationComparisonChart walletId={selectedWalletId} items={items} usdRate={usdRate} mode="category" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Strategy vs Actual — By Country</CardTitle>
            </CardHeader>
            <CardContent>
              <AllocationComparisonChart walletId={selectedWalletId} items={items} usdRate={usdRate} mode="country" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            Select a wallet in the sidebar to see strategy vs actual allocation.
          </CardContent>
        </Card>
      )}

      {/* Tabbed charts */}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="dividend">Dividend</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <ChartCard key={`arca-${selectedWalletId ?? 'all'}`}    title="ARCA Strategy"  data={byArca}     total={totalBrl} colorMap={ARCA_COLORS} />
            <ChartCard key={`cat-${selectedWalletId ?? 'all'}`}     title="By Category"    data={byCategory} total={totalBrl} />
            <ChartCard key={`country-${selectedWalletId ?? 'all'}`} title="By Country"     data={byCountry}  total={totalBrl} />
            <ChartCard key={`income-${selectedWalletId ?? 'all'}`}  title="By Income Type" data={byIncome}   total={totalBrl} />
            <ChartCard key={`atype-${selectedWalletId ?? 'all'}`}    title="By Asset Type"  data={byAssetType} total={totalBrl} />
            <ChartCard key={`seg-${selectedWalletId ?? 'all'}`}     title="By Segment"     data={bySegment}  total={totalBrl} />
            <ChartCard key={`sec-${selectedWalletId ?? 'all'}`}     title="By Sector"      data={bySector}   total={totalBrl} />
          </div>
        </TabsContent>

        <TabsContent value="dividend">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Dividend Flow — {currentYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <DividendLineChart key={`line-${selectedWalletId ?? 'all'}`} dividends={dividends} usdRate={usdRate} year={currentYear} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dividends by Category — {currentYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <DividendLineByCategoryChart key={`linecat-${selectedWalletId ?? 'all'}`} dividends={dividends} usdRate={usdRate} year={currentYear} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dividends by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <DividendPieChart key={`pie-${selectedWalletId ?? 'all'}`} dividends={dividends} usdRate={usdRate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dividend Origin — BR vs US</CardTitle>
              </CardHeader>
              <CardContent>
                <DividendOriginChart key={`origin-${selectedWalletId ?? 'all'}`} dividends={dividends} usdRate={usdRate} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="international">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <ChartCard key={`atype-reit-${selectedWalletId ?? 'all'}`} title={`By Asset Type — REIT · R$ ${fmt(totalBrlReit)} / $ ${fmtUsd(totalUsdReit)}`} data={byAssetTypeReit} total={totalBrlReit} />
            <ChartCard key={`sec-reit-${selectedWalletId ?? 'all'}`}   title={`By Sector — REIT · R$ ${fmt(totalBrlReit)} / $ ${fmtUsd(totalUsdReit)}`}       data={bySectorReit}    total={totalBrlReit} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
