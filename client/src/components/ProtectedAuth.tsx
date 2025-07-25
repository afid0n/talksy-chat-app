import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/services/userService";
import type { RootState } from "@/redux/store/store";
import { loginSuccess } from "@/redux/userSlice";


const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          const data = await getCurrentUser();
          dispatch(loginSuccess({ ...data, isAuthenticated: true }));
        }
      } catch (error) {
        // Not logged in, let Navigate redirect
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (checking) return null; // loading spinner optionally
  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return <>{children}</>;
};

export default RequireAuth;
