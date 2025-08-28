import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface User {
  username: string
  password: string
}

function Users() {
  const formSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function handleAddUser(
    body: z.infer<typeof formSchema>,
  ): Promise<void> {
    try {
      await api({ url: 'config/users', method: 'POST', body: body })
    } catch (error) {
      console.error(error)
    }
  }

  function handleDeleteUser(userToDelete: User): void {}

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
            <form
              onSubmit={form.handleSubmit(handleAddUser)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
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
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto">
                Add User
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          {/* <CardTitle>Users ({users.length})</CardTitle> */}
          <CardDescription>Manage existing users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* {users.map((user: User, index: number) => (
                <div
                  key={`${user.username}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))} */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
