'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, Pencil, Trash2, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import {
  getDividendEntries, createDividendEntry, updateDividendEntry, deleteDividendEntry,
} from '@/lib/api'
import type { DividendEntry } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const SUGGESTED_CATEGORIES = ['Ações', 'FIIs', 'FIAGRO', 'Stocks', 'REITs', 'ETF Exterior']

const CURRENT_YEAR = new Date().getFullYear()

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Parse Brazilian currency values from Excel.
// SheetJS may return the cell as a JS number (1366.09) OR as a string ("R$1.366,09").
// If it's already a number, use it directly — do NOT run string replacements on it
// or the decimal point gets stripped (e.g. 1366.09 → "1366.09" → "136609").
function parseBrValue(raw: unknown): number | null {
  if (raw == null) return null
  if (typeof raw === 'number') return raw === 0 ? null : raw
  // String path: "R$1.366,09" → remove R$, strip dot thousands-sep, swap comma decimal
  const s = String(raw).replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim()
  if (s === '-' || s === '') return null
  const n = parseFloat(s)
  return isNaN(n) || n === 0 ? null : n
}

interface FormState {
  category: string
  month: string
  year: string
  value: string
  currency: string
}

const EMPTY_FORM: FormState = {
  category: '',
  month: String(new Date().getMonth() + 1),
  year: String(CURRENT_YEAR),
  value: '',
  currency: 'BRL',
}

export default function DividendsPage() {
  const qc = useQueryClient()

  // ── Add / Edit dialog ───────────────────────────────────────────────────────
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DividendEntry | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  // ── Import dialog ───────────────────────────────────────────────────────────
  const [importOpen, setImportOpen] = useState(false)
  const [importYear, setImportYear] = useState(String(CURRENT_YEAR))
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Filter ──────────────────────────────────────────────────────────────────
  const [yearFilter, setYearFilter] = useState<string>('')

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['dividend-entries', yearFilter],
    queryFn: () => getDividendEntries(yearFilter ? Number(yearFilter) : undefined),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['dividend-entries'] })

  const createMut = useMutation({
    mutationFn: createDividendEntry,
    onSuccess: () => { invalidate(); setOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateDividendEntry>[1] }) =>
      updateDividendEntry(id, data),
    onSuccess: () => { invalidate(); setOpen(false) },
  })

  const deleteMut = useMutation({
    mutationFn: deleteDividendEntry,
    onSuccess: invalidate,
  })

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(e: DividendEntry) {
    setEditing(e)
    setForm({
      category: e.category,
      month: String(e.month),
      year: String(e.year),
      value: String(e.value),
      currency: e.currency,
    })
    setOpen(true)
  }

  function handleSave() {
    const payload = {
      category: form.category.trim(),
      month: Number(form.month),
      year: Number(form.year),
      value: parseFloat(form.value.replace(',', '.')),
      currency: form.currency,
    }
    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload })
    } else {
      createMut.mutate(payload)
    }
  }

  // ── Excel import ─────────────────────────────────────────────────────────
  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const year = Number(importYear)
    if (!year) { toast.error('Please enter a valid year before choosing a file.'); return }

    setImporting(true)
    try {
      // Parse file first so we fail fast before touching the API
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer)

      // Collect all (category, month, value) triples across all sheets
      const cells: { category: string; month: number; value: number }[] = []

      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
        if (rows.length < 2) continue

        // Row 0: [null, "Jan", "Fev", ..., "Dez"] — columns 1–12 = months 1–12
        for (let r = 1; r < rows.length; r++) {
          const row = rows[r] as unknown[]
          const category = String(row[0] ?? '').trim()
          if (!category || category.toUpperCase() === 'CARTEIRA') continue

          for (let col = 1; col <= 12; col++) {
            const value = parseBrValue(row[col])
            if (value === null) continue
            cells.push({ category, month: col, value })
          }
        }
      }

      if (cells.length === 0) {
        toast.warning('No dividend data found in the file.')
        return
      }

      // Fetch existing entries so we can upsert
      let existing: DividendEntry[] = []
      try {
        existing = await getDividendEntries(year)
      } catch (apiErr) {
        console.error('Failed to fetch existing entries:', apiErr)
        toast.error('Could not reach the API. Make sure the backend is running.')
        return
      }

      const existingMap = new Map<string, DividendEntry>()
      for (const d of existing) {
        existingMap.set(`${d.category}__${d.month}`, d)
      }

      let created = 0
      let updated = 0
      let failed = 0

      // Run all upserts in parallel, counting successes/failures individually
      const results = await Promise.allSettled(
        cells.map(({ category, month, value }) => {
          const payload = { category, month, year, value, currency: 'BRL' }
          const existingEntry = existingMap.get(`${category}__${month}`)
          return existingEntry
            ? updateDividendEntry(existingEntry.id, payload)
            : createDividendEntry(payload)
        })
      )

      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'fulfilled') {
          existingMap.has(`${cells[i].category}__${cells[i].month}`) ? updated++ : created++
        } else {
          failed++
          console.error('Failed cell:', cells[i], (results[i] as PromiseRejectedResult).reason)
        }
      }

      await invalidate()

      const parts: string[] = []
      if (created > 0) parts.push(`${created} created`)
      if (updated > 0) parts.push(`${updated} updated`)
      if (failed > 0) parts.push(`${failed} failed`)

      if (failed > 0 && created + updated === 0) {
        toast.error(`Import failed for all ${failed} entries. Check the console for details.`)
      } else if (failed > 0) {
        toast.warning(parts.join(', '))
      } else {
        toast.success(parts.join(', '))
      }

      if (created + updated > 0) setImportOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Import error:', err)
      toast.error(`Import failed: ${msg}`)
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const totalBrl = entries.reduce((s, e) => s + e.value, 0)
  const saving = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dividends</h1>
          <p className="text-muted-foreground text-sm mt-1">Monthly income by category</p>
        </div>
        <div className="flex gap-2">
          {/* Import Excel */}
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Import Excel
          </Button>

          {/* Add Dividend */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />} onClick={openAdd}>
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Add Dividend
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Dividend' : 'Add Dividend'}</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 py-1">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input
                    list="category-suggestions"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. FIIs"
                  />
                  <datalist id="category-suggestions">
                    {SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Month</Label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={form.month}
                      onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                    >
                      {MONTH_NAMES.map((m, i) => (
                        <option key={i + 1} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      min="2000"
                      max="2100"
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Currency</Label>
                  <div className="flex gap-3 mt-1">
                    {['BRL', 'USD'].map((c) => (
                      <label key={c} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="currency"
                          value={c}
                          checked={form.currency === c}
                          onChange={() => setForm((f) => ({ ...f, currency: c }))}
                        />
                        {c === 'BRL' ? 'R$ (BRL)' : '$ (USD)'}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Value ({form.currency === 'BRL' ? 'R$' : '$'})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <DialogFooter showCloseButton>
                <Button onClick={handleSave} disabled={saving || !form.category || !form.value}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Excel dialog */}
      <Dialog open={importOpen} onOpenChange={(o) => { if (!o) setImportOpen(false) }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Import from Excel</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <p className="text-sm text-muted-foreground">
              Expected format: first column is category, columns 2–13 are Jan–Dez values
              in <span className="font-mono text-xs">R$1.666,96</span> format.
              The <strong>CARTEIRA</strong> row is skipped automatically.
            </p>

            <div className="space-y-1">
              <Label>Year for this file</Label>
              <Input
                type="number"
                min="2000"
                max="2100"
                value={importYear}
                onChange={(e) => setImportYear(e.target.value)}
                placeholder="e.g. 2025"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button
              disabled={importing || !importYear}
              onClick={() => fileInputRef.current?.click()}
            >
              {importing ? 'Importing…' : 'Choose File & Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Entries</p>
            <p className="text-2xl font-bold">{entries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Total {yearFilter ? yearFilter : 'All Time'}
            </p>
            <p className="text-2xl font-bold tabular-nums">R$ {fmt(totalBrl)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Filter by Year</p>
              <Input
                type="number"
                min="2000"
                max="2100"
                placeholder="All years"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dividend Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="text-muted-foreground text-sm p-6">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground text-sm p-6">
              No entries yet. Use <strong>Import Excel</strong> or <strong>Add Dividend</strong> to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {MONTH_NAMES[e.month - 1]} / {e.year}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded mr-1
                        ${e.currency === 'USD' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {e.currency}
                      </span>
                      {e.currency === 'USD' ? '$ ' : 'R$ '}
                      {fmt(e.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(e)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm('Delete this entry?')) deleteMut.mutate(e.id) }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
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
