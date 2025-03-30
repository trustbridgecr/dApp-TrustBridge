"use client"
import { useRouter } from "next/navigation"
import Login from "@/components/email-auth/login/login"

export default function LoginPage() {
  const router = useRouter()

  return (
    <Login onSuccess={() => alert("Welcome your credentials are valid")} />
  )
}
