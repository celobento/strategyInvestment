'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createWallet } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().max(100).optional(),
})
type FormData = z.infer<typeof schema>

export default function NewWalletPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const userId = Number(session?.user?.id)
      if (!userId) throw new Error('User not authenticated')
      return createWallet({ name: data.name, user: userId })
    },
    onSuccess: () => {
      toast.success('Wallet created successfully')
      router.push('/wallets')
    },
    onError: () => toast.error('Failed to create wallet'),
  })

  return (
    <div className="p-6 max-w-lg">
      <Link href="/wallets" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Wallets
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Wallet</CardTitle>
          <CardDescription>
            Creating wallet for <span className="font-medium text-foreground">{session?.user?.name ?? session?.user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Wallet Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. My Investment Wallet" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending || !session}>
                {mutation.isPending ? 'Saving...' : 'Create Wallet'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
