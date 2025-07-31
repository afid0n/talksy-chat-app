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
import ChatWrapper from "../pages/client/Chat";
import RedirectIfAuth from "@/components/RedirectIfAuth";

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
      element: (
        <RedirectIfAuth>
          <Login />
        </RedirectIfAuth>
      ),
    },
    {
      path: "register",
      element: (
        <RedirectIfAuth>
          <Register />
        </RedirectIfAuth>
      ),
    },
    {
      path: "forgot-password",
      element: (
        <RedirectIfAuth>
          <ForgotPassword />
        </RedirectIfAuth>
      ),
    },
    {
      path: "reset-password",
      element: <ResetPassword />, // allow access always (optional)
    },
    {
      path: "email-verified",
      element: <VerifyEmail />, // allow access always
    },
  ],
},
  {
    path: "*",
    element: <NotFound />,
  },
];

export default ROUTES;
