import { useTwoFactor } from "./hooks/useTwoFactor.hook";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TwoFactorAuthProps {
  email: string;
  onLogin: () => void;
}

const TwoFactorAuth = ({ email, onLogin }: TwoFactorAuthProps) => {
  const { otp, setOtp, error, handleSubmit } = useTwoFactor(email, onLogin);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      {error && (
        <Alert
          variant="destructive"
          className="mb-4 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 border dark:border-red-700"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border px-3 py-2 rounded-md"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default TwoFactorAuth;