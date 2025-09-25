'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from 'next/link'
import Cookies from "js-cookie"

import { useRouter } from 'next/navigation'
import { loginUser } from '@/actions/users-mysql'
import toast from 'react-hot-toast'
import { Input } from "../../../forms/components/ui/input"
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),

})

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response: any = await loginUser(values.email, values.password);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success("Login successful! Welcome back.");
      if (response.data && response.data.token) {
        Cookies.set("token", response.data.token);
        Cookies.set("role", response.data.role);
        router.push(`/${response.data.role}/dashboard`);
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };


  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center">
            <h1 className="text-primary font-bold text-2xl mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-600">Sign in to your STERI Clean Air account</p>
          </div>
          <hr className='border-border' />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Enter your email address" 
                      type="email"
                      className="pl-10"
                      {...field} 
                    />
                  </div>
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 font-normal text-sm text-primary"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Enter your password" 
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <Button type="submit" className='w-full' disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/?form=register" className='text-primary hover:underline font-medium'>
                Create account
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
