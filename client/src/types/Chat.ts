export interface Chat {
  _id: string;
  isGroup: boolean;
  name?: string;
  participants: {
    _id: string;
    fullName: string;
    email: string;
  }[];
  admin?: {
    _id: string;
    fullName: string;
    email: string;
  };
  lastMessage?: {
    _id: string;
    sender: {
      _id: string;
      fullName: string;
    };
    content: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatPayload {
  isGroup: boolean;
  name?: string;
  participants: string[]; // user IDs
  admin?: string; // admin user ID
}

export interface UpdateChatPayload {
  name?: string;
  participants?: string[];
  admin?: string;
}
