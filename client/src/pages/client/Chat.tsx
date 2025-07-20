import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

const App = () => {
  return (
    <div className="flex min-h-screen w-full h-full">
      <Messages />
      <ChatPage />
    </div>
  );
};

export default App;
