import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Redirect } from "wouter"
import * as z from 'zod'
import type { LoginResponse } from "./types"
import { isLoggedInAtom, loginAtom } from "@/atoms/auth"

const signInFormSchema = z.object({
  email: z
    .email({ message: 'Enter a valid email' }),
  password: z.string({ message: 'Password is required' })
    .nonempty({ message: "Password must not be empty" }),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

const defaultValues: SignInFormValues = {
  email: '',
  password: '',
}

function LoginForm({
  ...props
}) {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues,
  })

  const setLogin = useSetAtom(loginAtom)
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  const [loading, setLoading] = useState(false)

  async function login(data: SignInFormValues) {
    try {
      setLoading(true)

      const { token } = await api<SignInFormValues, LoginResponse>({
        url: `auth/signin`,
        body: data,
      })

      setLogin(token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      form.setError('root', { type: '', message: errorMessage })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    return <Redirect to='/' />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(login)}>
                  <div className="flex flex-col gap-6">
                    {form.formState.errors.root && (
                      <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {form.formState.errors.root.message}
                      </div>
                    )}
                    <div className='grid gap-2'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type='email' autoComplete='email' placeholder='me@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid gap-2'>
                      <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type='password' autoComplete='new-password' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button disabled={loading} type="submit" className="w-full">
                        Login
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
