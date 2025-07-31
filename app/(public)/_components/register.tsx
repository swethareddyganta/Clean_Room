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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import toast from 'react-hot-toast'
import { registerUser } from '@/actions/users-mysql'
import { Input } from "../../../forms/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, UserPlus, CheckCircle } from 'lucide-react'

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Full name must be at least 2 characters",
    }).max(50, {
        message: "Full name must be less than 50 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: "Password must contain at least one lowercase letter, one uppercase letter, and one number",
        }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = form.watch("password");
    
    const passwordStrength = {
        hasLength: password.length >= 8,
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const { confirmPassword, ...registerData } = values;
            const response = await registerUser(registerData);
            
            if (!response.success) {
                throw new Error(response.message);
            }
            
            setRegistrationSuccess(true);
            toast.success("Account created successfully! Please sign in.");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/?form=login");
            }, 2000);
            
        } catch (error: any) {
            toast.error(error.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    if (registrationSuccess) {
        return (
            <div className='w-full'>
                <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h1 className="text-primary font-bold text-2xl">Account Created!</h1>
                    <p className="text-gray-600">
                        Your STERI Clean Air account has been created successfully. 
                        You'll be redirected to the login page shortly.
                    </p>
                    <Button 
                        onClick={() => router.push("/?form=login")}
                        className="mt-4"
                    >
                        Continue to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-primary font-bold text-2xl mb-2">Create Your Account</h1>
                        <p className="text-sm text-gray-600">Join STERI Clean Air to get started</p>
                    </div>
                    <hr className='border-border' />
                    
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            placeholder="Enter your full name" 
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            placeholder="Create a strong password" 
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
                                
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-2 mt-2">
                                        <div className="text-xs text-gray-600">Password requirements:</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className={`flex items-center ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                8+ characters
                                            </div>
                                            <div className={`flex items-center ${passwordStrength.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasLower ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                Lowercase
                                            </div>
                                            <div className={`flex items-center ${passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasUpper ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                Uppercase
                                            </div>
                                            <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                Number
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            placeholder="Confirm your password" 
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                            {...field} 
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
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

                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                        By creating an account, you agree to our Terms of Service and Privacy Policy. 
                        Your account will be set up as a User account by default.
                    </div>

                    <Button type="submit" className='w-full' disabled={loading}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/?form=login" className='text-primary hover:underline font-medium'>
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default RegisterForm
