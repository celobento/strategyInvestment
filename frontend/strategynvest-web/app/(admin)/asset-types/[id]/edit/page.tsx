'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getAssetTypes, updateAssetType } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function EditAssetTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: assetTypes = [], isLoading } = useQuery({
    queryKey: ['asset-types'],
    queryFn: () => getAssetTypes(),
  })
  const assetType = assetTypes.find((at) => at.id === Number(id))

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  useEffect(() => {
    if (assetType) {
      reset({ name: assetType.name, description: assetType.description ?? '' })
    }
  }, [assetType, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      updateAssetType(Number(id), { name: data.name, description: data.description || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-types'] })
      toast.success('Asset type updated')
      router.push('/asset-types')
    },
    onError: () => toast.error('Failed to update asset type'),
  })

  if (isLoading) return <div className="p-6 text-muted-foreground text-sm">Loading...</div>
  if (!isLoading && !assetType) return (
    <div className="p-6">
      <p className="text-destructive text-sm">Asset type not found.</p>
      <Link href="/asset-types" className="text-sm text-muted-foreground hover:underline mt-2 inline-block">← Asset Types</Link>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/asset-types" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Asset Types
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Asset Type</CardTitle>
          <CardDescription>{assetType?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register('description')} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
