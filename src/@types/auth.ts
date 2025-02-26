export type UserRole = 'Lender' | 'Borrower';

export interface User {
  address: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (address: string, name: string, role: UserRole) => void;
  logout: () => void;
  updateRole: (role: UserRole) => void;
}

export interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
} 