'use client'

import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRevisions, deleteRevision } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function RevisionsPage() {
  const queryClient = useQueryClient()

  const { data: revisions, isLoading } = useQuery({
    queryKey: ['revisions'],
    queryFn: getRevisions,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRevision(id),
    onSuccess: () => {
      toast.success('Revision deleted')
      queryClient.invalidateQueries({ queryKey: ['revisions'] })
    },
    onError: () => toast.error('Failed to delete revision'),
  })

  const handleDelete = (id: number) => {
    if (!window.confirm(`Delete revision #${id}?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revisions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage asset revisions</p>
        </div>
        <Button render={<Link href="/revisions/new" />}>
          + New Revision
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Revisions</CardTitle>
          <CardDescription>
            {revisions ? `${revisions.length} result${revisions.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !revisions?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No revisions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Current Value</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Div. Yield</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">P/VP</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Income</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revisions.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{r.id}</td>
                      <td className="py-3 px-4 font-medium">
                        <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold font-mono">
                          {r.asset?.ticket ?? r.asset?.id ?? '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {r.currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {(r.dividendYeld * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 tabular-nums">{r.pVp?.toFixed(2) ?? '—'}</td>
                      <td className="py-3 px-4 tabular-nums">
                        {r.lastIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{r.createdDate?.slice(0, 10) ?? '—'}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(r.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
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
