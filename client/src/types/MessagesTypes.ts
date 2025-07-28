export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    fullName: string;
  };
  type: 'text' | 'gif' | 'emoji';
  content: string;
  createdAt: string;
}
