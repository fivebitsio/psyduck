import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2, UserPlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface User {
  email: string
}

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [_fetching, setFetching] = useState<boolean>(false)

  const formSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(6).max(100)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const fetchUsers = useCallback(async () => {
    try {
      setFetching(true)

      const users = await api<undefined, User[]>({
        method: 'GET',
        url: `config/users`
      })
      setUsers(users)
    } catch (error) {
      console.error('Error fetching users: ', error)
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  async function handleAddUser(body: z.infer<typeof formSchema>): Promise<void> {
    try {
      await api({ url: 'config/users', method: 'POST', body })
      form.reset()
      await fetchUsers()
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as any).message === 'string'
      ) {
        form.setError('root', {
          type: 'server',
          message: (error as any).message
        })
      } else {
        form.setError('root', {
          type: 'server',
          message: 'An error occurred while adding the user'
        })
      }
    }
  }

  async function handleDeleteUser(email: string): Promise<void> {
    try {
      await api({ url: `config/users/${email}`, method: 'DELETE' })
      await fetchUsers()
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New User
          </CardTitle>
          <CardDescription>Create a new user account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="psyduck" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full md:w-auto"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting
                  </>
                ) : (
                  'Add User'
                )}
              </Button>
              {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>Manage existing users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user: User, index: number) => (
              <div
                key={`${user.email}-${index}`}
                className="flex items-center justify-between p-4 border rounded-sm"
              >
                <div className="flex-1">
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user.email)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
