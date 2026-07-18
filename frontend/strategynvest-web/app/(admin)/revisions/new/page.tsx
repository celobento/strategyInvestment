'use client'

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createRevision } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  currentValue: z.coerce.number(),
  dividendYeld: z.coerce.number(),
  incomeFactor: z.coerce.number(),
  pVp: z.coerce.number(),
  lastIncome: z.coerce.number(),
  dateLastIncome: z.string().min(1, 'Required'),
  nextIncome: z.coerce.number().optional(),
  dateNextIncome: z.string().optional(),
  notes: z.string().max(500).optional(),
  asset: z.coerce.number().int().positive('Asset ID is required'),
})
type FormData = z.infer<typeof schema>

export default function NewRevisionPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => createRevision(data),
    onSuccess: () => {
      toast.success('Revision created successfully')
      router.push('/revisions')
    },
    onError: () => toast.error('Failed to create revision'),
  })

  const req = <span className="text-destructive">*</span>

  return (
    <div className="p-6 max-w-2xl">
      <Link href="/revisions" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Revisions
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Revision</CardTitle>
          <CardDescription>Record a new asset revision with financial data.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="currentValue">Current Value {req}</Label>
                <Input id="currentValue" type="number" step="0.01" {...register('currentValue')} placeholder="0.00" />
                {errors.currentValue && <p className="text-xs text-destructive">{errors.currentValue.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dividendYeld">Dividend Yield {req}</Label>
                <Input id="dividendYeld" type="number" step="0.01" {...register('dividendYeld')} placeholder="0.00" />
                {errors.dividendYeld && <p className="text-xs text-destructive">{errors.dividendYeld.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="incomeFactor">Income Factor {req}</Label>
                <Input id="incomeFactor" type="number" step="0.01" {...register('incomeFactor')} placeholder="0.00" />
                {errors.incomeFactor && <p className="text-xs text-destructive">{errors.incomeFactor.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pVp">P/VP {req}</Label>
                <Input id="pVp" type="number" step="0.01" {...register('pVp')} placeholder="0.00" />
                {errors.pVp && <p className="text-xs text-destructive">{errors.pVp.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastIncome">Last Income {req}</Label>
                <Input id="lastIncome" type="number" step="0.01" {...register('lastIncome')} placeholder="0.00" />
                {errors.lastIncome && <p className="text-xs text-destructive">{errors.lastIncome.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateLastIncome">Date Last Income {req}</Label>
                <Input id="dateLastIncome" type="date" {...register('dateLastIncome')} />
                {errors.dateLastIncome && <p className="text-xs text-destructive">{errors.dateLastIncome.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="nextIncome">Next Income</Label>
                <Input id="nextIncome" type="number" step="0.01" {...register('nextIncome')} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateNextIncome">Date Next Income</Label>
                <Input id="dateNextIncome" type="date" {...register('dateNextIncome')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="asset">Asset ID {req}</Label>
              <Input id="asset" type="number" {...register('asset')} placeholder="Asset ID" />
              {errors.asset && <p className="text-xs text-destructive">{errors.asset.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} placeholder="Optional notes (max 500 chars)" rows={3} />
              {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Create Revision'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
