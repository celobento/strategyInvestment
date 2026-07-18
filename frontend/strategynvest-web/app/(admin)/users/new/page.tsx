'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const schema = z
  .object({
    username: z.string().min(2, 'Min 2 characters').max(50),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Min 6 characters').max(200),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function NewUserPage() {
  const router = useRouter()
  const [hasUser, setHasUser] = useState(true)
  const [hasAdmin, setHasAdmin] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const roles = [...(hasUser ? ['USER'] : []), ...(hasAdmin ? ['ADMIN'] : [])]
      if (roles.length === 0) roles.push('USER')
      return createUser({ username: data.username, email: data.email, password: data.password, roles })
    },
    onSuccess: () => {
      toast.success('User created successfully')
      router.push('/users')
    },
    onError: () => toast.error('Failed to create user'),
  })

  return (
    <div className="p-6 max-w-lg">
      <Link href="/users" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Users
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New User</CardTitle>
          <CardDescription>Create a new system user.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
              <Input id="username" {...register('username')} placeholder="johndoe" />
              {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input id="password" type="password" {...register('password')} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">USER</p>
                    <p className="text-xs text-muted-foreground">Standard user access</p>
                  </div>
                  <Switch checked={hasUser} onCheckedChange={setHasUser} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">ADMIN</p>
                    <p className="text-xs text-muted-foreground">Full administrative access</p>
                  </div>
                  <Switch checked={hasAdmin} onCheckedChange={setHasAdmin} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
