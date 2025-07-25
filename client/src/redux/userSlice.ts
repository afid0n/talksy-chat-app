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
  token: "",
  isAuthenticated: false,
};


const savedUser = localStorage.getItem("user");
if (savedUser) {
  Object.assign(initialState, JSON.parse(savedUser));
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify({ ...state }));
    },
    logoutUser: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logoutUser } = userSlice.actions;
export default userSlice.reducer;
