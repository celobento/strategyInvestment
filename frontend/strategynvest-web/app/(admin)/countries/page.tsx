'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getCountries } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CountriesPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries', search],
    queryFn: () => getCountries(search || undefined),
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage countries</p>
        </div>
        <Button asChild>
          <Link href="/countries/new">+ New Country</Link>
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
          <CardTitle>All Countries</CardTitle>
          <CardDescription>
            {countries ? `${countries.length} result${countries.length !== 1 ? 's' : ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Loading...</p>
          ) : !countries?.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No countries found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Acronym</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{c.id}</td>
                    <td className="py-3 px-4 font-medium">{c.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {c.acronym}
                      </span>
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
