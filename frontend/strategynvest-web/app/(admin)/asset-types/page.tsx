'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssetTypes, deleteAssetType } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AssetTypesPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const { data: assetTypes, isLoading } = useQuery({
    queryKey: ['asset-types', search],
    queryFn: () => getAssetTypes(search || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAssetType(id),
    onSuccess: () => {
      toast.success('Asset type deleted')
      queryClient.invalidateQueries({ queryKey: ['asset-types'] })
    },
    onError: () => toast.error('Failed to delete asset type'),
  })

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete asset type "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Types</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage asset types (e.g. Qualidade, Crescimento, Dividendo, Valor)</p>
        </div>
        <Button render={<Link href="/asset-types/new" />}>
          + New Asset Type
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
          <CardTitle>All Asset Types</CardTitle>
          <CardDescription>
            {assetTypes ? `${assetTypes.length} result${assetTypes.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !assetTypes?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No asset types found.</p>
          ) : (
            <div className="overflow-x-auto">
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
                  {assetTypes.map((at) => (
                    <tr key={at.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{at.id}</td>
                      <td className="py-3 px-4 font-medium">{at.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{at.description ?? '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" render={<Link href={`/asset-types/${at.id}/edit`} />}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(at.id, at.name)}
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
