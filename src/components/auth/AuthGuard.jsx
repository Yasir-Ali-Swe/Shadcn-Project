"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isProfileComplete, user, role } = useSelector(
    (state) => state.auth,
  );
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (isAuthenticated) {
      if (!isProfileComplete) {
        const normalizedRole = role.replace("_", "-");
        const profilePath = `/dashboard/${normalizedRole}/complete-profile`;
        if (pathname !== profilePath) {
          router.push(profilePath);
        }
      }
    }
  }, [isAuthenticated, isProfileComplete, role, router, pathname]);
  return <>{children}</>;
}
