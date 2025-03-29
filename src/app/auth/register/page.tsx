"use client";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    const router = useRouter();
    return <RegisterForm onSuccess={() => router.push("/auth/login")} />;
}
