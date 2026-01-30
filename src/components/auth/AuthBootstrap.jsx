"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authApi } from "@/lib/api";
import { setUser, clearUser } from "@/store/slices/auth-slice";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authApi.getMe();
        if (data.success) {
          dispatch(setUser(data.user));
        } else {
          console.error("Auth check failed:", data); // Debugging
          dispatch(clearUser());
        }
      } catch (error) {
        // Silent fail for 401s, user just isn't logged in
        dispatch(clearUser());
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
}
