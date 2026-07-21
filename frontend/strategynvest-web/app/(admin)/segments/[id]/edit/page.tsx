'use client'

import { use, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
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
import { getSegments, updateSegment } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  description: z.string().max(250, 'Max 250 characters').optional(),
})
type FormData = z.infer<typeof schema>

export default function EditSegmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: segments = [], isLoading, isError } = useQuery({
    queryKey: ['segments'],
    queryFn: () => getSegments(),
  })
  const segment = segments.find((s) => s.id === Number(id))

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  useEffect(() => {
    if (segment) {
      reset({ name: segment.name, description: segment.description ?? '' })
    }
  }, [segment, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateSegment(Number(id), { name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] })
      toast.success('Segment updated')
      router.push('/segments')
    },
    onError: () => toast.error('Failed to update segment'),
  })

  if (isLoading) return <div className="p-6 text-muted-foreground text-sm">Loading...</div>
  if (isError || (!isLoading && !segment)) return (
    <div className="p-6">
      <p className="text-destructive text-sm">Segment not found.</p>
      <Link href="/segments" className="text-sm text-muted-foreground hover:underline mt-2 inline-block">← Segments</Link>
    </div>
  )

  return (
    <div className="p-6 max-w-lg">
      <Link href="/segments" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Segments
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Segment</CardTitle>
          <CardDescription>Update segment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={3} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
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
