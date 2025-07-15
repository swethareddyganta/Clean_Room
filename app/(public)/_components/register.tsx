'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import toast from 'react-hot-toast'
import { registerUser } from '@/actions/users'






const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invaild email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),

})



function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

   async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
           setLoading(true);
           const response = await registerUser(values)
           if (!response.success) {
               throw new Error(response.message);
           }
           toast.success("User registered successfully");
           router.push("/?form=login");
        
       } catch (error: any) {
        toast.error(error.message || "An error occurred while registering")
       } finally {
           setLoading(false);
       }
    }

    return (
        <div className='w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    <h1 className="text-gray-700 font-bold text-xl"> Register Your Account </h1>
                    <hr className='border-gray-300' />
                    <FormField
                        
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <input className='border border-gray-500 rounded-md p-2' placeholder="Enter Username" {...field} />
                                </FormControl>
                              
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <input className='border border-gray-500 rounded-md p-2' placeholder="Enter Email..." {...field} />
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
                                    <input className='border border-gray-500 rounded-md p-2 ' placeholder="Enter Password" {...field} />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    
                    <div className="flex justify-between items-center">
                        <h1 className="text-sm text-gray-700 font-semibold flex gap-5">
                            Already have an account?{" "} <Link href="/?form=login" className='text-gray-700 underline font-semibold'> Login </Link>
                        </h1>
                


                        <Button type="submit" className='w-max' disabled ={loading} > Register </Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default RegisterForm
