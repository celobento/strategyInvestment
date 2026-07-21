'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGoals, createGoal, updateGoal, deleteGoal, getMyAssets, getWalletAssets, getUsdBrlRate } from '@/lib/api'
import { useWalletStore } from '@/lib/stores/wallet-store'
import type { Goal } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog'
import { PlusIcon, Pencil, Trash2, Target } from 'lucide-react'

// ── Finance helpers ───────────────────────────────────────────────────────────

function monthsBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
}

function calcPMT(fv: number, pv: number, rPct: number, n: number): number {
  if (n <= 0) return 0
  const r = rPct / 100
  if (r === 0) return Math.max(0, (fv - pv) / n)
  const factor = Math.pow(1 + r, n)
  const pmt = (fv - pv * factor) * r / (factor - 1)
  return Math.max(0, pmt)
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

// ── Default form ──────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)

const emptyForm = {
  description: '',
  goalValue: '',
  limitDate: '',
  startDate: today,
  monthlyRate: '',
  initialBalance: '',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { selectedWalletId } = useWalletStore()
  const qc = useQueryClient()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [form, setForm] = useState(emptyForm)

  // ── Data queries ────────────────────────────────────────────────────────────
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })

  const { data: assets = [] } = useQuery({
    queryKey: ['my-assets', selectedWalletId],
    queryFn: () => selectedWalletId ? getWalletAssets(selectedWalletId) : getMyAssets(),
  })

  const { data: usdRate = 1 } = useQuery({
    queryKey: ['usd-brl-rate'],
    queryFn: getUsdBrlRate,
    staleTime: 5 * 60 * 1000,
  })

  const USD_ACRONYMS = new Set(['US', 'USA', 'EUA'])
  const portfolioTotal = assets.reduce((s, wa) => {
    const r = wa.countryAcronym && USD_ACRONYMS.has(wa.countryAcronym.toUpperCase()) ? usdRate : 1
    return s + (wa.currentPrice ?? 0) * (wa.quantity ?? 0) * r
  }, 0)

  // ── Mutations ───────────────────────────────────────────────────────────────
  const invalidate = () => qc.invalidateQueries({ queryKey: ['goals'] })

  const createMut = useMutation({
    mutationFn: createGoal,
    onSuccess: () => { invalidate(); setOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateGoal>[1] }) =>
      updateGoal(id, data),
    onSuccess: () => { invalidate(); setOpen(false) },
  })

  const deleteMut = useMutation({
    mutationFn: deleteGoal,
    onSuccess: invalidate,
  })

  // ── Live calculation in dialog ──────────────────────────────────────────────
  const liveMonths = form.startDate && form.limitDate
    ? monthsBetween(form.startDate, form.limitDate)
    : 0

  const livePMT = useMemo(() => calcPMT(
    Number(form.goalValue) || 0,
    Number(form.initialBalance) || 0,
    Number(form.monthlyRate) || 0,
    liveMonths,
  ), [form.goalValue, form.initialBalance, form.monthlyRate, liveMonths])

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(g: Goal) {
    setEditing(g)
    setForm({
      description: g.description,
      goalValue: String(g.goalValue),
      limitDate: g.limitDate,
      startDate: g.startDate,
      monthlyRate: String(g.monthlyRate),
      initialBalance: String(g.initialBalance),
    })
    setOpen(true)
  }

  function handleSave() {
    const payload = {
      description: form.description,
      goalValue: Number(form.goalValue),
      limitDate: form.limitDate,
      startDate: form.startDate,
      monthlyRate: Number(form.monthlyRate),
      initialBalance: Number(form.initialBalance),
    }
    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload })
    } else {
      createMut.mutate(payload)
    }
  }

  const saving = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">Investment targets and monthly projection</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" />} onClick={openAdd}>
            <PlusIcon className="h-4 w-4 mr-1.5" />
            New Goal
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Goal' : 'New Goal'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-1">
              {/* Description */}
              <div className="space-y-1">
                <Label>Description *</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. 300K at 40 years"
                />
              </div>

              {/* Goal value + Monthly rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Goal (R$) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.goalValue}
                    onChange={(e) => setForm((f) => ({ ...f, goalValue: e.target.value }))}
                    placeholder="300000"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Monthly rate (%) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.monthlyRate}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyRate: e.target.value }))}
                    placeholder="0.90"
                  />
                </div>
              </div>

              {/* Start date + Limit date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start date *</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Limit date *</Label>
                  <Input
                    type="date"
                    value={form.limitDate}
                    onChange={(e) => setForm((f) => ({ ...f, limitDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Initial balance */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Initial balance (R$) *</Label>
                  <button
                    type="button"
                    className="text-xs text-primary underline-offset-2 hover:underline"
                    onClick={() => setForm((f) => ({ ...f, initialBalance: String(portfolioTotal.toFixed(2)) }))}
                  >
                    Use portfolio value (R$ {fmt(portfolioTotal)})
                  </button>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={form.initialBalance}
                  onChange={(e) => setForm((f) => ({ ...f, initialBalance: e.target.value }))}
                  placeholder="0"
                />
              </div>

              {/* Live suggestion */}
              {liveMonths > 0 && Number(form.goalValue) > 0 && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
                  <p className="text-sm text-primary">
                    Suggested monthly investment:{' '}
                    <span className="font-bold text-base">R$ {fmt(livePMT)}</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      (x{liveMonths} months)
                    </span>
                  </p>
                </div>
              )}
            </div>

            <DialogFooter showCloseButton>
              <Button onClick={handleSave} disabled={saving || !form.description || !form.goalValue || !form.limitDate}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals list */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-2">
            <Target className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No goals yet. Create your first investment goal.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((g) => {
            const n = monthsBetween(g.startDate, g.limitDate)
            const pmt = calcPMT(g.goalValue, g.initialBalance, g.monthlyRate, n)
            const today = new Date().toISOString().slice(0, 10)
            const monthsLeft = monthsBetween(today, g.limitDate)
            const progressPct = n > 0 ? Math.min(100, Math.round(((n - monthsLeft) / n) * 100)) : 100

            return (
              <Card key={g.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{g.description}</CardTitle>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(g)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMut.mutate(g.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key numbers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Goal</p>
                      <p className="text-xl font-bold tabular-nums">R$ {fmt(g.goalValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Suggested monthly</p>
                      <p className="text-xl font-bold tabular-nums text-primary">R$ {fmt(pmt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Initial balance</p>
                      <p className="tabular-nums font-medium">R$ {fmt(g.initialBalance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Rate / months</p>
                      <p className="tabular-nums font-medium">{g.monthlyRate}% · x{n}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Start: {fmtDate(g.startDate)}</span>
                    <span>Deadline: {fmtDate(g.limitDate)}</span>
                    {monthsLeft > 0 && <span className="font-medium text-foreground">{monthsLeft} months left</span>}
                    {monthsLeft <= 0 && <span className="text-red-500 font-medium">Deadline passed</span>}
                  </div>

                  {/* Progress bar (time elapsed) */}
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{progressPct}% of time elapsed</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
