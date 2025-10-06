export interface APILoginResponse {
  user:  User;
  token: string;
}

export type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}
