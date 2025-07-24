// Payload and response types
export interface RegisterPayload {
  email: string;
  username: string;
  fullName: string;
  authProvider: "local" | "google" | "github";
  password?: string; // optional for non-local
  birthday: Date | string; // ISO string or Date object
  avatar?: { url: string };
  location: {
    country: string;
    city: string;
  };
  interests: string[];
  language: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    authProvider: "local" | "google" | "github";
    birthday: string;
    avatar: { url: string };
    location: { country: string; city: string };
    interests: string[];
    friends: string[];
    blockedUsers: string[];
    bio: string;
    emailVerified: boolean;
    friendRequests: string[];
    language: string;
    isOnline: boolean;
    lastLogin: string | null;
    loginAttempts: number;
    lockUntil: string | null;
    lastSeen: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}