"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/auth-slice";
import { getMe } from "@/lib/api/auth";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    getMe()
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => dispatch(clearUser()));
  }, [dispatch]);

  return children;
}
