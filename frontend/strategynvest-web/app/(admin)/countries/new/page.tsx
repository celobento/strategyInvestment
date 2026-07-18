'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createCountry } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  acronym: z.string().min(2, 'Min 2 characters').max(3, 'Max 3 characters'),
})
type FormData = z.infer<typeof schema>

export default function NewCountryPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => createCountry(data),
    onSuccess: () => {
      toast.success('Country created successfully')
      router.push('/countries')
    },
    onError: () => toast.error('Failed to create country'),
  })

  return (
    <div className="p-6 max-w-lg">
      <Link href="/countries" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Countries
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Country</CardTitle>
          <CardDescription>Add a new country to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} placeholder="e.g. Brasil" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="acronym">Acronym <span className="text-destructive">*</span></Label>
              <Input id="acronym" {...register('acronym')} placeholder="e.g. BR" maxLength={3} />
              {errors.acronym && <p className="text-xs text-destructive">{errors.acronym.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Create Country'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
