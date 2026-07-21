'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSegments, deleteSegment } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function SegmentsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ['segments', search],
    queryFn: () => getSegments(),
  })

  const filtered = search
    ? segments.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : segments

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSegment(id),
    onSuccess: () => {
      toast.success('Segment deleted')
      queryClient.invalidateQueries({ queryKey: ['segments'] })
    },
    onError: () => toast.error('Failed to delete segment'),
  })

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Segments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage asset segments</p>
        </div>
        <Button render={<Link href="/segments/new" />}>
          + New Segment
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
          <CardTitle>All Segments</CardTitle>
          <CardDescription>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !filtered.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No segments found.</p>
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
                {filtered.map((seg) => (
                  <tr key={seg.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{seg.id}</td>
                    <td className="py-3 px-4 font-medium">{seg.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{seg.description ?? '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" render={<Link href={`/segments/${seg.id}/edit`} />}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(seg.id, seg.name)}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
