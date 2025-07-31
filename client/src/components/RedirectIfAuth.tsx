import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/services/userService";
import type { RootState } from "@/redux/store/store";
import { loginSuccess } from "@/redux/userSlice";

const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated && localStorage.getItem("token")) {
          const data = await getCurrentUser();
          dispatch(loginSuccess({ ...data, isAuthenticated: true }));
        }
      } catch (error) {
        // Token invalid, allow access to auth pages
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (checking) return null; 
  if (isAuthenticated) return <Navigate to="/feed" replace />;

  return <>{children}</>;
};

export default RedirectIfAuth;
