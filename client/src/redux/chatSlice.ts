import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: null,
  selectedUser: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setSelectedChat, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
