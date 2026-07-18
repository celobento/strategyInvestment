'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createAssetType } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
})

type FormValues = z.infer<typeof schema>

export default function NewAssetTypePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createAssetType({ name: data.name, description: data.description || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-types'] })
      toast.success('Asset type created successfully')
      router.push('/asset-types')
    },
    onError: () => toast.error('Failed to create asset type'),
  })

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/asset-types" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Asset Types
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Asset Type</CardTitle>
          <CardDescription>Create a new asset type (e.g. Qualidade, Crescimento, Dividendo, Valor).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Asset type name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description"
                rows={4}
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Asset Type'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/asset-types')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
