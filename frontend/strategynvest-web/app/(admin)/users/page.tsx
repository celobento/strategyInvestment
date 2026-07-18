'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { deleteUser } from '@/lib/api'

export default function UsersPage() {
  const [userId, setUserId] = useState<string>('')
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully')
      setUserId('')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    const id = parseInt(userId, 10)
    if (!userId || isNaN(id)) {
      toast.error('Please enter a valid user ID')
      return
    }
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage application users</p>
        </div>
        <Button asChild>
          <Link href="/users/new">+ New User</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>
            Users can be created and deleted. There is no listing endpoint available for users at
            this time. Use the button above to register a new user, or use the form below to delete
            an existing user by ID.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete User</CardTitle>
          <CardDescription>Enter the user ID to delete them permanently.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDelete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="number"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                min={1}
              />
            </div>
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
