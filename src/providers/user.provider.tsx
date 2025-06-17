import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile, UserProfileFormData } from "@/@types/user.entity";
import { useWalletContext } from "@/providers/wallet.provider";
import { toast } from "sonner";

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  saveProfile: (data: UserProfileFormData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { walletAddress } = useWalletContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [walletAddress]);

  const loadProfile = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", walletAddress));

      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: UserProfileFormData) => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setSaving(true);
      const now = Date.now();
      const userData: UserProfile = {
        walletAddress,
        ...data,
        createdAt: profile?.createdAt || now,
        updatedAt: now,
      };

      await setDoc(doc(db, "users", walletAddress), userData);
      setProfile(userData);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Error saving user profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        loading,
        saving,
        saveProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
