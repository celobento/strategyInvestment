'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createCategory, getCountries } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  description: z.string().optional(),
  countryId: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewCategoryPage() {
  const router = useRouter()

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
  })
  const countryItems = countries.map((c) => ({ value: String(c.id), label: `${c.name} (${c.acronym})` }))

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createCategory({
        name: data.name,
        description: data.description,
        countryId: data.countryId ? Number(data.countryId) : undefined,
      }),
    onSuccess: () => {
      toast.success('Category created successfully')
      router.push('/categories')
    },
    onError: () => toast.error('Failed to create category'),
  })

  return (
    <div className="p-6 max-w-lg">
      <Link href="/categories" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Categories
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Category</CardTitle>
          <CardDescription>Create a new investment category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} placeholder="Category name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Country</Label>
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    items={countryItems}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryItems.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Optional description" rows={3} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Create Category'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
