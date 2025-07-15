export interface IUser{
    id: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    created_at: Date;
    is_active: boolean;
}