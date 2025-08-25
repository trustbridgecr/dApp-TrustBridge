import React, { createContext, useContext, useState, useEffect } from "react";
import { db, doc, getDoc, setDoc } from "@/lib/firebase";
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
  const { walletAddress, updateDisplayName } = useWalletContext();
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
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);
        
        // Update display name if profile has name information
        if (userData.firstName || userData.lastName) {
          const displayName = `${userData.firstName} ${userData.lastName}`.trim();
          if (displayName) {
            updateDisplayName(displayName);
          }
        }
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
      
      // Update display name in wallet context
      if (data.firstName || data.lastName) {
        const displayName = `${data.firstName} ${data.lastName}`.trim();
        if (displayName) {
          updateDisplayName(displayName);
        }
      }
      
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
