export interface User {
    id: string; 
    email: string;
    fullName: string;
    username: string;
    authProvider: 'google' | 'github' | 'local';
    password?: string; // optional in client (usually hidden anyway)
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
    friends: string[]; // array of User ObjectIds (or populated User objects if needed)
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
