'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWallets, deleteWallet } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function WalletsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets', search],
    queryFn: () => getWallets(search || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteWallet(id),
    onSuccess: () => {
      toast.success('Wallet deleted')
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
    onError: () => toast.error('Failed to delete wallet'),
  })

  const handleDelete = (id: number, name?: string) => {
    if (!window.confirm(`Delete wallet "${name ?? `#${id}`}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallets</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage investment wallets</p>
        </div>
        <Button render={<Link href="/wallets/new" />}>
          + New Wallet
        </Button>
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
          <CardTitle>All Wallets</CardTitle>
          <CardDescription>
            {wallets ? `${wallets.length} result${wallets.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !wallets?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No wallets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Current Value</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Div. Yield</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr key={w.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{w.id}</td>
                      <td className="py-3 px-4 font-medium">{w.name ?? <span className="text-muted-foreground italic">—</span>}</td>
                      <td className="py-3 px-4 tabular-nums">
                        {w.currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {(w.dividendYeld * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{w.user?.username ?? w.user?.id ?? '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{w.createdDate?.slice(0, 10) ?? '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" render={<Link href={`/wallets/${w.id}/edit`} />}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(w.id, w.name)}
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
