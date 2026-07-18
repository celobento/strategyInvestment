'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getBrokers } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BrokersPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: brokers, isLoading } = useQuery({
    queryKey: ['brokers', search],
    queryFn: () => getBrokers(search || undefined),
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brokers</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage brokers</p>
        </div>
        <Button asChild>
          <Link href="/brokers/new">+ New Broker</Link>
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
          <CardTitle>All Brokers</CardTitle>
          <CardDescription>
            {brokers ? `${brokers.length} result${brokers.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !brokers?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No brokers found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Website</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{b.id}</td>
                    <td className="py-3 px-4 font-medium">{b.name}</td>
                    <td className="py-3 px-4">
                      <a href={b.webSite.startsWith('http') ? b.webSite : `https://${b.webSite}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {b.webSite}
                      </a>
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
