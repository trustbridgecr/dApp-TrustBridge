
'use client';
import { useRoleContext } from "@/providers/role.provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BorrowerPoolPage from '@/components/modules/marketplace/ui/pages/BorrowerPoolPage';

export default function BorrowerMarketplace() {
  const { role, isLoading } = useRoleContext();
  const router = useRouter();

  useEffect(() => {
    
    if (isLoading) return;
    
    console.log('BorrowerMarketplace - Role loaded:', role);
    
    // If no role is set after loading, redirect to marketplace entry
    if (!role) {
      console.log('No role found, redirecting to marketplace');
      router.push("/dashboard/marketplace");
      return;
    } 
    
    if (role !== "borrower") {
      // If role is set but not borrower, redirect to correct role page
      console.log('Role is not borrower, redirecting to:', `/dashboard/marketplace/${role}`);
      router.push(`/dashboard/marketplace/${role}`);
      return;
    }

    console.log('Role is borrower, staying on page');
  }, [role, isLoading, router]);

  // Show loading while the role provider is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Loading user role...</p>
        </div>
      </div>
    );
  }


  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>

          <p className="text-gray-400">Redirecting to marketplace...</p>

        </div>
      </div>
    );
  }



 // Show loading while redirecting

  if (role !== "borrower") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Redirecting to your marketplace...</p>
        </div>
      </div>
    );
  }


  return <BorrowerPoolPage />;
}
