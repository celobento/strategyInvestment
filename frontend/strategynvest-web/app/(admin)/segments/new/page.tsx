'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createSegment } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  description: z.string().max(250, 'Max 250 characters').optional(),
})
type FormData = z.infer<typeof schema>

export default function NewSegmentPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => createSegment({ name: data.name, description: data.description }),
    onSuccess: () => {
      toast.success('Segment created successfully')
      router.push('/segments')
    },
    onError: () => toast.error('Failed to create segment'),
  })

  return (
    <div className="p-6 max-w-lg">
      <Link href="/segments" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Segments
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Segment</CardTitle>
          <CardDescription>Create a new asset segment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} placeholder="Segment name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Optional description" rows={3} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Create Segment'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
