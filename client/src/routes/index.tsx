import RequireAuth from "@/components/ProtectedAuth";
import AuthLayout from "../layouts/AuthLayout";
import ClientLayout from "../layouts/ClientLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Feed from "../pages/client/Feed";
import Home from "../pages/client/Home";
import Profile from "../pages/client/Profile";
import NotFound from "../pages/Common/NotFound";
import ChatPage from "@/components/ChatPage";
import ChatWrapper from "../pages/client/Chat";

const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "chat",
        element: (
          <RequireAuth>
            <ChatWrapper />
          </RequireAuth>
        ),
      },
          {
        path: "chat/:chatId",
        element: (
          <RequireAuth>
            <ChatPage /> 
          </RequireAuth>
        ),
      },
      {
        path: "feed",
        element: (
          <RequireAuth>
            <Feed />
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/auth/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password", 
        element: <ResetPassword />,
      },
      {
        path: "email-verified",
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default ROUTES;
