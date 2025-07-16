'use server'

import supabaseConfig from "@/config/supabase-config";
import bcrypt from "bcryptjs"
import { IUser } from "@/interfaces";
import jwt from "jsonwebtoken";

export const registerUser = async (payload: Partial<IUser>) => {

    try {
        
        //step1 : check user
        const { data: existingUser, error: userError } = await supabaseConfig
            .from("user_profiles")
            .select("*")
            .eq("email", payload.email);
        
        if (existingUser && existingUser.length > 0) {
            throw new Error("User already exists with this email address.");
        }

        //step2: Hash password
        const hashedPassword = await bcrypt.hash(payload.password || "", 10)

        //step3: Insert user into database

        const row = {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: "user",
            is_active: true,
        };

        const { data, error } = await supabaseConfig
            .from("user_profiles")
            .insert([row])
        
        if (error) {
            throw new Error(error.message);
        }
        return {
            success: true,
            message: "User registered successfully.",
        };

    } catch (error: any) {
        return {
            success: false,
            message:error.message,
        }
        
    }
    
}

export const loginUser = async (email: string, password: string, role: string) =>{
    
    try {
        //step1 Check if user exists

          const { data: users, error: userError } = await supabaseConfig
            .from("user_profiles")
            .select("*")
              .eq("email", email);
        
        if (userError || !users || users.length === 0) {
            throw new Error("User not found!");
        }

        const user = users[0] as IUser;
        if (user.role !== role) {
            throw new Error("Invalid role for this user!")
        }

        ///step2: compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        }

        //step3: Generate JWT token and return user data
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        })

        return {
            success: true,
            message: "Login Successful",
            data: {
                role: user.role,
                token
            },
        }
        
    } catch (error: any) {
        return {
            success: false,
            message: error.messsage,
        }
        
    }

}

export const logoutUser = async () => {
    try {
        return {
            success: true,
            message: "Logout successful",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        }
    }
}