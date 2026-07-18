'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSectors, deleteSector } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function SectorsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const { data: sectors, isLoading } = useQuery({
    queryKey: ['sectors', search],
    queryFn: () => getSectors(search || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSector(id),
    onSuccess: () => {
      toast.success('Sector deleted')
      queryClient.invalidateQueries({ queryKey: ['sectors'] })
    },
    onError: () => toast.error('Failed to delete sector'),
  })

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sectors</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage market sectors</p>
        </div>
        <Button render={<Link href="/sectors/new" />}>
          + New Sector
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
          <CardTitle>All Sectors</CardTitle>
          <CardDescription>
            {sectors ? `${sectors.length} result${sectors.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !sectors?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No sectors found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{s.id}</td>
                    <td className="py-3 px-4 font-medium">{s.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.description ?? '—'}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(s.id, s.name)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
