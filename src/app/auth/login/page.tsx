"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    const router = useRouter();
    return <LoginForm onSuccess={() => alert("Welcome your credentials are valid")}/>
};