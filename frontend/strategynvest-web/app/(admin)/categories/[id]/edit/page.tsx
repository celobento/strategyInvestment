'use client'

import { use, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCategories, updateCategory, getCountries } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  description: z.string().optional(),
  countryId: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Use the list endpoint (no auth guard) and find by ID
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })
  const category = categories.find((c) => c.id === Number(id))

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
  })
  const countryItems = countries.map((c) => ({ value: String(c.id), label: `${c.name} (${c.acronym})` }))

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', countryId: '' },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description ?? '',
        countryId: category.countryId ? String(category.countryId) : '',
      })
    }
  }, [category, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      updateCategory(Number(id), {
        name: data.name,
        description: data.description,
        countryId: data.countryId ? Number(data.countryId) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated')
      router.push('/categories')
    },
    onError: () => toast.error('Failed to update category'),
  })

  if (isLoading) return <div className="p-6 text-muted-foreground text-sm">Loading...</div>
  if (isError || (!isLoading && !category)) return (
    <div className="p-6">
      <p className="text-destructive text-sm">Category not found.</p>
      <Link href="/categories" className="text-sm text-muted-foreground hover:underline mt-2 inline-block">← Categories</Link>
    </div>
  )

  return (
    <div className="p-6 max-w-lg">
      <Link href="/categories" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Categories
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>Update category details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} />
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
              <Textarea id="description" {...register('description')} rows={3} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
