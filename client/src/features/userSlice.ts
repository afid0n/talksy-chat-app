import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types/User"; // Adjust this import path as needed

interface UserState extends Partial<User> {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: undefined,
  email: undefined,
  fullName: undefined,
  username: "",
  authProvider: "local",
  birthday: null,
  avatar: { url: "", public_id: "" },
  location: { country: "", city: "" },
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
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

function loadInitialUserData(state: UserState) {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: User = jwtDecode(token);
      Object.assign(state, decoded); // Populate user fields
      state.token = token;
      state.isAuthenticated = true;
    }
  } catch (error) {
    console.error("JWT decode error:", error);
  }
}

loadInitialUserData(initialState);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      Object.assign(state, user);
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },
    logoutUser: (state) => {
      Object.assign(state, initialState);
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
