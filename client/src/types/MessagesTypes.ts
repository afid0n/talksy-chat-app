export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    username: string;
  };
  type: 'text' | 'gif' | 'emoji';
  content: string;
  createdAt: string;
}
