export interface UserProfile {
  walletAddress: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
}

export interface UserChatData {
  firstName: string;
  lastName: string;
  walletAddress: string;
}
