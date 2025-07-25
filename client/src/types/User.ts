export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  authProvider: "google" | "github" | "local";
  password?: string;
  birthday?: string | null;
  avatar: {
    url: string;
    public_id?: string;
  };
  location: {
    country?: string;
    city?: string;
  };
  interests: string[];
  friends: string[];
  blockedUsers: string[];
  lastSeen: string;
  bio: string;
  emailVerified: boolean;
  friendRequests: string[];
  language: string;
  isOnline: boolean;
  lastLogin?: string | null;
  loginAttempts: number;
  lockUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserState extends Partial<User> {
  token?: string;
  isAuthenticated: boolean;
}
