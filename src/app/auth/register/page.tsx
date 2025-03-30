"use client"
import { useRouter } from "next/navigation"
import Register from "@/components/email-auth/register/register"

export default function RegisterPage() {
  const router = useRouter()

  return <Register onSuccess={() => router.push("/auth/login")} />
}
