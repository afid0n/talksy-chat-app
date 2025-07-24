import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
  id: string | null;
  email: string | null;
  role: string | null;
  fullName: string | null;
  profileImage: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  role: null,
  fullName: null,
  profileImage: null,
  token: localStorage.getItem("token"), // persist token if already stored
  isAuthenticated: !!localStorage.getItem("token"),
};

function loadInitialUserData(initialUser: UserState) {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: {
        role: string;
        email: string;
        fullName: string;
        profileImage: string;
        id: string;
        iat: Date;
        exp: Date;
      } = jwtDecode(token);
      initialUser.id = decoded.id;
      initialUser.email = decoded.email;
      initialUser.role = decoded.role;
      initialUser.fullName = decoded.fullName;
      initialState.profileImage = decoded.profileImage;
      initialUser.isAuthenticated = true;
      initialUser.token = token;
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

loadInitialUserData(initialState);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: string;
        fullName: string;
        profileImage: string;
        token: string;
      }>
    ) => {
      const { id, email, role, fullName, profileImage, token } = action.payload;
      console.log("action payload: ", action.payload);
      state.id = id;
      state.email = email;
      state.role = role;
      state.fullName = fullName;
      state.profileImage = profileImage;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },
    logoutUser: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
      state.fullName = null;
      state.profileImage = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
