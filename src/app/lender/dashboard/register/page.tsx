import { AuthTabs } from "@/components/auth/auth-tabs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground mt-2">
            Sign in or create an account to continue
          </p>
        </div>
        <AuthTabs />
      </div>
    </main>
  );
}
