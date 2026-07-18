'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBroker } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  webSite: z.string().min(2, 'Website must be at least 2 characters').max(250, 'Website must be at most 250 characters'),
})

type FormValues = z.infer<typeof schema>

export default function NewBrokerPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) => createBroker(data),
    onSuccess: () => {
      toast.success('Broker created successfully')
      router.push('/brokers')
    },
    onError: () => {
      toast.error('Failed to create broker')
    },
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/brokers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Brokers
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Broker</CardTitle>
          <CardDescription>Add a new broker to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Broker name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="webSite">Website</Label>
              <Input
                id="webSite"
                placeholder="https://example.com"
                {...register('webSite')}
              />
              {errors.webSite && (
                <p className="text-sm text-destructive">{errors.webSite.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Broker'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/brokers')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
