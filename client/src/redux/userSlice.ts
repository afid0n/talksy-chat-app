import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "@/types/User";

const initialState: UserState = {
  id: "",
  email: "",
  fullName: "",
  username: "",
  authProvider: "local",
  password: undefined,
  birthday: null,
  avatar: { url: "", public_id: undefined },
  location: { country: undefined, city: undefined },
  interests: [],
  friends: [],
  blockedUsers: [],
  lastSeen: "",
  bio: "",
  emailVerified: false,
  friendRequests: [],
  language: "en",
  isOnline: false,
  lastLogin: null,
  loginAttempts: 0,
  lockUntil: null,
  createdAt: "",
  updatedAt: "",
  token: undefined, 
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginSuccess, logoutUser } = userSlice.actions;
export default userSlice.reducer;
